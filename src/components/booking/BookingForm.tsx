import { useState, useEffect } from 'react';
import { Calendar, Users, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Tour, ShuttleSchedule, BookingFormData } from '../../types';
import { getToursFromSupabase, getShuttleSchedulesFromSupabase, createBooking } from '../../api/supabaseService';
import { getPublicSiteSettingByKey } from '../../api/madabookingApi';
import Button from '../ui/Button';
import PayPalButton from './PayPalButton';

export default function BookingForm() {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    service: 'tour',
    serviceId: 0,
    date: '',
    numberOfPeople: 1,
    specialRequests: '',
  });

  const [tours, setTours] = useState<Tour[]>([]);
  const [schedules, setSchedules] = useState<ShuttleSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [bookingEnabled, setBookingEnabled] = useState(true);
  const [maxParticipants, setMaxParticipants] = useState(20);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [toursData, schedulesData, enabledSetting, maxSetting] = await Promise.all([
          getToursFromSupabase(),
          getShuttleSchedulesFromSupabase(),
          getPublicSiteSettingByKey('booking_enabled'),
          getPublicSiteSettingByKey('max_booking_participants'),
        ]);

        setTours(toursData);
        setSchedules(schedulesData);

        if (enabledSetting?.value !== undefined && enabledSetting?.value !== null) {
          setBookingEnabled(enabledSetting.value === true || enabledSetting.value === 'true');
        }
        if (maxSetting?.value) {
          const max = parseInt(String(maxSetting.value), 10);
          if (!Number.isNaN(max) && max > 0) {
            setMaxParticipants(max);
          }
        }

        if (toursData.length > 0) {
          setFormData((prev) => ({ ...prev, serviceId: toursData[0].id }));
        }
      } catch (error) {
        console.error('Error loading booking form data:', error);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numberOfPeople' ? parseInt(value) || 1 : value,
    }));
  };

  const handleServiceTypeChange = (type: 'tour' | 'shuttle') => {
    setFormData((prev) => ({
      ...prev,
      service: type,
      serviceId:
        type === 'tour' && tours.length > 0
          ? tours[0].id
          : type === 'shuttle' && schedules.length > 0
            ? schedules[0].id
            : 0,
    }));
  };

  const validateForm = () => {
    if (!bookingEnabled) {
      setErrorMessage(t('booking.form.errors.disabled', { defaultValue: 'Les réservations sont temporairement désactivées.' }));
      return false;
    }
    if (!formData.name.trim()) {
      setErrorMessage(t('booking.form.errors.name'));
      return false;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setErrorMessage(t('booking.form.errors.email'));
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage(t('booking.form.errors.phone'));
      return false;
    }
    if (!formData.date) {
      setErrorMessage(t('booking.form.errors.date'));
      return false;
    }
    if (formData.numberOfPeople < 1 || formData.numberOfPeople > maxParticipants) {
      setErrorMessage(t('booking.form.errors.maxParticipants', { defaultValue: `Maximum ${maxParticipants} participants.` }));
      return false;
    }
    if (formData.serviceId === 0) {
      setErrorMessage(
        t(formData.service === 'tour' ? 'booking.form.errors.serviceTour' : 'booking.form.errors.serviceShuttle')
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const amount = getBookingAmount();
      let result;

      if (formData.service === 'tour') {
        const selectedTour = tours.find((tour) => tour.id === formData.serviceId);
        if (!selectedTour?.supabaseId) {
          throw new Error(t('booking.form.errors.serviceTour'));
        }
        result = await createBooking({
          service_type: 'tour',
          tour_id: selectedTour.supabaseId,
          user_email: formData.email,
          user_name: formData.name,
          phone: formData.phone,
          special_requests: formData.specialRequests,
          booking_date: formData.date,
          participants: formData.numberOfPeople,
          total_price: amount,
        });
      } else {
        const selectedSchedule = schedules.find((s) => s.id === formData.serviceId);
        if (!selectedSchedule?.apiId) {
          throw new Error(t('booking.form.errors.serviceShuttle'));
        }
        result = await createBooking({
          service_type: 'shuttle',
          shuttle_id: selectedSchedule.apiId,
          user_email: formData.email,
          user_name: formData.name,
          phone: formData.phone,
          special_requests: formData.specialRequests,
          booking_date: formData.date,
          participants: formData.numberOfPeople,
          total_price: amount,
        });
      }

      const id = result?.[0]?.id;
      if (!id) {
        throw new Error(t('booking.form.errors.network'));
      }

      setBookingId(id);
      setPaymentStep(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('booking.form.errors.network');
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (details: { id?: string; transactionID?: string }) => {
    setSuccess(true);
    setBookingId(bookingId || details.id || details.transactionID || `BK${Date.now()}`);
  };

  const handlePaymentError = () => {
    setSuccess(false);
    setErrorMessage(t('booking.form.errors.payment'));
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
      specialRequests: '',
    });
    setPaymentStep(false);
    setSuccess(null);
    setErrorMessage(null);
    setBookingId(null);
  };

  const getBookingAmount = (): number => {
    if (formData.service === 'tour') {
      const selectedTour = tours.find((tour) => tour.id === formData.serviceId);
      return selectedTour ? selectedTour.price * formData.numberOfPeople : 0;
    }
    const selectedSchedule = schedules.find((schedule) => schedule.id === formData.serviceId);
    return selectedSchedule ? selectedSchedule.price * formData.numberOfPeople : 0;
  };

  const getBookingCurrency = (): string => {
    if (formData.service === 'tour') {
      return tours.find((tour) => tour.id === formData.serviceId)?.currency ?? 'EUR';
    }
    return schedules.find((schedule) => schedule.id === formData.serviceId)?.currency ?? 'EUR';
  };

  const getServiceLabel = () => {
    if (formData.service === 'tour') {
      return tours.find((tour) => tour.id === formData.serviceId)?.title ?? '';
    }
    const schedule = schedules.find((s) => s.id === formData.serviceId);
    if (!schedule) return '';
    return t('booking.form.shuttleRoute', { from: schedule.from, to: schedule.to });
  };

  const getMinDate = () => new Date().toISOString().split('T')[0];

  const inputWithIcon = 'field-input pl-10';

  if (!bookingEnabled && success === null && !paymentStep) {
    return (
      <p className="text-ink-muted text-sm">
        {t('booking.form.errors.disabled', { defaultValue: 'Les réservations sont temporairement désactivées.' })}
      </p>
    );
  }

  return (
    <div>
      {success === null ? (
        <>
          {!paymentStep ? (
            <form onSubmit={handleSubmit} noValidate>
              <h3 className="font-display text-2xl font-semibold text-ink mb-6">
                {t('booking.form.title')}
              </h3>

              <div className="mb-6">
                <div
                  className="inline-flex w-full rounded-lg border border-sand-300 bg-sand-50 p-1"
                  role="tablist"
                  aria-label={t('booking.form.title')}
                >
                  {(['tour', 'shuttle'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      role="tab"
                      aria-selected={formData.service === type}
                      className={`flex-1 min-h-[44px] py-2.5 px-4 text-sm font-medium rounded-md transition-colors duration-200 ${
                        formData.service === type
                          ? 'bg-ocean-600 text-sand-50'
                          : 'text-ink-muted hover:text-ink hover:bg-white/60'
                      }`}
                      onClick={() => handleServiceTypeChange(type)}
                    >
                      {t(type === 'tour' ? 'booking.form.tourTab' : 'booking.form.shuttleTab')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="serviceId" className="field-label">
                  {t(formData.service === 'tour' ? 'booking.form.selectTour' : 'booking.form.selectShuttle')}
                </label>
                <select
                  id="serviceId"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleInputChange}
                  className="field-input"
                  required
                >
                  <option value={0}>
                    {t(
                      formData.service === 'tour'
                        ? 'booking.form.selectPlaceholderTour'
                        : 'booking.form.selectPlaceholderShuttle'
                    )}
                  </option>
                  {formData.service === 'tour'
                    ? tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          {tour.title} — {tour.price} {tour.currency} {t('booking.form.perPerson')}
                        </option>
                      ))
                    : schedules.map((schedule) => (
                        <option key={schedule.id} value={schedule.id}>
                          {schedule.from} → {schedule.to} — {schedule.departureTime} (
                          {t('booking.form.seatsAvailable', { count: schedule.availableSeats })})
                        </option>
                      ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="date" className="field-label">
                    {t('booking.form.date')}
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light pointer-events-none" />
                    <input
                      type="date"
                      id="date"
                      name="date"
                      min={getMinDate()}
                      value={formData.date}
                      onChange={handleInputChange}
                      className={inputWithIcon}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="numberOfPeople" className="field-label">
                    {t('booking.form.guests')}
                  </label>
                  <div className="relative">
                    <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light pointer-events-none" />
                    <input
                      type="number"
                      id="numberOfPeople"
                      name="numberOfPeople"
                      min={1}
                      max={maxParticipants}
                      value={formData.numberOfPeople}
                      onChange={handleInputChange}
                      className={inputWithIcon}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="name" className="field-label">
                  {t('booking.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="field-input"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="email" className="field-label">
                    {t('booking.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="field-input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="field-label">
                    {t('booking.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="field-input"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="specialRequests" className="field-label">
                  {t('booking.form.specialRequests')}
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  rows={3}
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  className="field-input resize-y min-h-[5rem]"
                />
              </div>

              {errorMessage && (
                <div className="field-error mb-6" role="alert">
                  {errorMessage}
                </div>
              )}

              <Button type="submit" variant="primary" fullWidth isLoading={loading}>
                {t('booking.form.submit')}
              </Button>
            </form>
          ) : (
            <div>
              <h3 className="font-display text-2xl font-semibold text-ink mb-6">
                {t('booking.form.paymentTitle')}
              </h3>

              <div className="bg-ocean-50 border border-ocean-100 p-5 rounded-lg mb-6">
                <h4 className="font-medium text-ink mb-3">{t('booking.form.summaryTitle')}</h4>
                <dl className="space-y-2 text-sm text-ink-muted">
                  <div className="flex justify-between gap-4">
                    <dt>{t('booking.form.summaryService')}</dt>
                    <dd className="text-ink text-right">{getServiceLabel()}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t('booking.form.summaryDate')}</dt>
                    <dd className="text-ink">
                      {new Date(formData.date).toLocaleDateString(i18n.language)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t('booking.form.summaryGuests')}</dt>
                    <dd className="text-ink">{formData.numberOfPeople}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>{t('booking.form.summaryReference')}</dt>
                    <dd className="text-ink">{bookingId ?? t('booking.form.summaryPending')}</dd>
                  </div>
                </dl>
                <div className="border-t border-ocean-200 mt-4 pt-4">
                  <p className="font-display text-lg font-semibold text-ink">
                    {t('booking.form.summaryTotal')} : {getBookingAmount()} {getBookingCurrency()}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <PayPalButton
                  amount={getBookingAmount()}
                  currency={getBookingCurrency()}
                  bookingId={bookingId}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>

              {errorMessage && (
                <div className="field-error mb-6" role="alert">
                  {errorMessage}
                </div>
              )}

              <Button variant="outline" fullWidth onClick={() => setPaymentStep(false)}>
                {t('booking.form.backToForm')}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-6">
          {success ? (
            <>
              <div className="mx-auto w-14 h-14 bg-ocean-50 border border-ocean-100 rounded-full flex items-center justify-center mb-5">
                <Check size={28} className="text-ocean-700" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink mb-3">
                {t('booking.form.confirmedTitle')}
              </h3>
              <p className="prose-body mx-auto mb-4">{t('booking.form.confirmedBody')}</p>
              <p className="text-sm text-ink-muted mb-6">
                {t('booking.form.summaryReference')} : <span className="font-medium text-ink">{bookingId}</span>
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto w-14 h-14 bg-terracotta-50 border border-terracotta-100 rounded-full flex items-center justify-center mb-5">
                <X size={28} className="text-terracotta-600" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-ink mb-3">
                {t('booking.form.failedTitle')}
              </h3>
              <p className="prose-body mx-auto mb-6">
                {errorMessage ?? t('booking.form.failedBody')}
              </p>
            </>
          )}

          <Button variant={success ? 'primary' : 'outline'} onClick={resetForm}>
            {t(success ? 'booking.form.bookAnother' : 'booking.form.retry')}
          </Button>
        </div>
      )}
    </div>
  );
}
