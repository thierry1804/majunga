import { useState, useEffect } from 'react';
import { Calendar, Users, Check, X } from 'lucide-react';
import { Tour, ShuttleSchedule, BookingFormData } from '../../types';
import { submitBooking, fetchTours, fetchShuttleSchedules } from '../../api/mockApi';
import Button from '../ui/Button';
import PayPalButton from './PayPalButton';

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    service: 'tour',
    serviceId: 0,
    date: '',
    numberOfPeople: 1,
    specialRequests: ''
  });
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [schedules, setSchedules] = useState<ShuttleSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  // Load tours and schedules
  useEffect(() => {
    const loadData = async () => {
      try {
        const [toursData, schedulesData] = await Promise.all([
          fetchTours(),
          fetchShuttleSchedules()
        ]);
        setTours(toursData);
        setSchedules(schedulesData);
        
        // Set default selections if available
        if (toursData.length > 0) {
          setFormData(prev => ({
            ...prev,
            serviceId: toursData[0].id
          }));
        }
      } catch (error) {
        console.error('Error loading booking form data:', error);
      }
    };
    
    loadData();
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'numberOfPeople' ? parseInt(value) || 1 : value
    }));
  };
  
  const handleServiceTypeChange = (type: 'tour' | 'shuttle') => {
    setFormData(prev => ({
      ...prev,
      service: type,
      serviceId: type === 'tour' && tours.length > 0 ? tours[0].id : 
                type === 'shuttle' && schedules.length > 0 ? schedules[0].id : 0
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await submitBooking(formData);
      
      if (response.success) {
        setPaymentStep(true);
        setBookingId(response.bookingId || null);
      } else {
        setErrorMessage(response.error || 'An error occurred while processing your booking.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again later.');
      console.error('Booking submission error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your name.');
      return false;
    }
    
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return false;
    }
    
    if (!formData.date) {
      setErrorMessage('Please select a date for your booking.');
      return false;
    }
    
    if (formData.serviceId === 0) {
      setErrorMessage(`Please select a ${formData.service === 'tour' ? 'tour' : 'shuttle'}.`);
      return false;
    }
    
    return true;
  };
  
  const handlePaymentSuccess = (details: any) => {
    setSuccess(true);
    console.log('Payment successful:', details);
  };
  
  const handlePaymentError = (error: any) => {
    setSuccess(false);
    setErrorMessage('Payment failed: ' + (error.message || 'Unknown error'));
    console.error('Payment error:', error);
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: 'tour',
      serviceId: tours.length > 0 ? tours[0].id : 0,
      date: '',
      numberOfPeople: 1,
      specialRequests: ''
    });
    setPaymentStep(false);
    setSuccess(null);
    setErrorMessage(null);
    setBookingId(null);
  };
  
  // Calculate booking amount
  const getBookingAmount = (): number => {
    if (formData.service === 'tour') {
      const selectedTour = tours.find(tour => tour.id === formData.serviceId);
      return selectedTour ? selectedTour.price * formData.numberOfPeople : 0;
    } else {
      const selectedSchedule = schedules.find(schedule => schedule.id === formData.serviceId);
      return selectedSchedule ? selectedSchedule.price * formData.numberOfPeople : 0;
    }
  };
  
  // Get currency from selected service
  const getBookingCurrency = (): string => {
    if (formData.service === 'tour') {
      const selectedTour = tours.find(tour => tour.id === formData.serviceId);
      return selectedTour ? selectedTour.currency : 'EUR';
    } else {
      const selectedSchedule = schedules.find(schedule => schedule.id === formData.serviceId);
      return selectedSchedule ? selectedSchedule.currency : 'EUR';
    }
  };
  
  // Get today's date in YYYY-MM-DD format for min date attribute
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {success === null ? (
        <>
          {!paymentStep ? (
            // Booking form
            <form onSubmit={handleSubmit}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Make a Reservation</h3>
              
              {/* Service type selector */}
              <div className="mb-6">
                <div className="flex rounded-lg overflow-hidden mb-4 border">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 font-medium ${
                      formData.service === 'tour'
                        ? 'bg-blue-700 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleServiceTypeChange('tour')}
                  >
                    Book a Tour
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 font-medium ${
                      formData.service === 'shuttle'
                        ? 'bg-blue-700 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleServiceTypeChange('shuttle')}
                  >
                    Airport Shuttle
                  </button>
                </div>
              </div>
              
              {/* Service selection */}
              <div className="mb-6">
                <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700 mb-1">
                  {formData.service === 'tour' ? 'Select Tour' : 'Select Shuttle'}
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                  required
                >
                  <option value={0}>-- Select {formData.service === 'tour' ? 'a tour' : 'a shuttle'} --</option>
                  
                  {formData.service === 'tour' ? (
                    tours.map(tour => (
                      <option key={tour.id} value={tour.id}>
                        {tour.title} - {tour.price} {tour.currency}/person
                      </option>
                    ))
                  ) : (
                    schedules.map(schedule => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.from} to {schedule.to} - {schedule.departureTime} ({schedule.availableSeats} seats available)
                      </option>
                    ))
                  )}
                </select>
              </div>
              
              {/* Two column layout for date and people */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      min={getMinDate()}
                      value={formData.date}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of People
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Users size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="numberOfPeople"
                      name="numberOfPeople"
                      min="1"
                      max="20"
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Personal details */}
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Requests (Optional)
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={3}
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                />
              </div>
              
              {errorMessage && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
                  {errorMessage}
                </div>
              )}
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={loading}
              >
                Proceed to Payment
              </Button>
            </form>
          ) : (
            // Payment form
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Payment</h3>
              
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
                <p className="text-gray-700 mb-1">
                  <strong>Service:</strong> {formData.service === 'tour' ? 
                    tours.find(t => t.id === formData.serviceId)?.title : 
                    `Shuttle from ${schedules.find(s => s.id === formData.serviceId)?.from} to ${schedules.find(s => s.id === formData.serviceId)?.to}`
                  }
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Participants:</strong> {formData.numberOfPeople}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Booking Reference:</strong> {bookingId || 'Pending payment'}
                </p>
                <div className="border-t border-blue-200 my-3 pt-3">
                  <p className="text-lg font-bold text-gray-900">
                    Total: {getBookingAmount()} {getBookingCurrency()}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <PayPalButton
                  amount={getBookingAmount()}
                  currency={getBookingCurrency()}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
              
              {errorMessage && (
                <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md">
                  {errorMessage}
                </div>
              )}
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => setPaymentStep(false)}
              >
                Back to Booking Form
              </Button>
            </div>
          )}
        </>
      ) : (
        // Confirmation message
        <div className="text-center py-8">
          {success ? (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Booking Confirmed!</h3>
              <p className="text-gray-600 mb-6">
                Your booking has been confirmed and payment has been processed successfully. 
                We've sent a confirmation email with all the details.
              </p>
              <p className="text-gray-700 mb-6">
                <strong>Booking Reference:</strong> {bookingId}
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <X size={32} className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Payment Failed</h3>
              <p className="text-gray-600 mb-6">
                {errorMessage || 'There was an issue processing your payment. Please try again.'}
              </p>
            </>
          )}
          
          <Button
            variant={success ? 'primary' : 'outline'}
            onClick={resetForm}
          >
            {success ? 'Make Another Booking' : 'Try Again'}
          </Button>
        </div>
      )}
    </div>
  );
}