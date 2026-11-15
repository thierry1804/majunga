import { useState, useEffect } from 'react';
import { Clock, MapPin, Ticket, Plane } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getShuttleSchedulesFromSupabase } from '../../api/supabaseService';
import { getShuttleAvailability } from '../../api/madabookingApi';
import { ShuttleSchedule } from '../../types';
import Container from '../ui/Container';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import FlightSchedule from '../FlightSchedule';
import RevealOnScroll from '../motion/RevealOnScroll';
import { useBookingSelection } from '../../contexts/BookingSelectionContext';

export default function ShuttleSection() {
  const { t } = useTranslation();
  const { selectForBooking } = useBookingSelection();
  const [schedules, setSchedules] = useState<ShuttleSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'airport-to-city' | 'city-to-airport'>(
    'airport-to-city'
  );
  // Les places se calculent par jour : le visiteur choisit la date, aujourd'hui par défaut.
  const todayIso = () => new Date().toLocaleDateString('en-CA');
  const [date, setDate] = useState(todayIso);
  const [availability, setAvailability] = useState<Record<string, { remaining: number; departed: boolean }>>({});

  useEffect(() => {
    let active = true;
    getShuttleAvailability(date)
      .then((list) => {
        if (active) {
          setAvailability(Object.fromEntries(list.map((a) => [a.id, { remaining: a.remaining, departed: a.departed }])));
        }
      })
      // Sans réponse, on garde l'affichage de la capacité : le serveur refuse de toute façon une navette complète.
      .catch(() => {
        if (active) setAvailability({});
      });
    return () => {
      active = false;
    };
  }, [date]);

  // État d'un départ à la date choisie
  const seatState = (schedule: ShuttleSchedule) => {
    const info = schedule.apiId ? availability[schedule.apiId] : undefined;
    const departed = !!info?.departed;
    const full = !departed && (info ? info.remaining <= 0 : schedule.availableSeats <= 0);
    return { info, departed, full, unavailable: departed || full };
  };

  const renderSeats = (schedule: ShuttleSchedule) => {
    const { info, departed, full } = seatState(schedule);
    if (departed) {
      return (
        <span className="inline-flex rounded-md bg-sand-200 px-2 py-0.5 text-xs font-medium text-ink-muted">
          {t('shuttle.schedule.departed')}
        </span>
      );
    }
    if (full) {
      return (
        <span className="inline-flex rounded-md border border-terracotta-100 bg-terracotta-50 px-2 py-0.5 text-xs font-medium text-terracotta-600">
          {t('shuttle.schedule.full')}
        </span>
      );
    }
    return (
      <span className="text-ocean-700">
        {info ? t('booking.form.seatsLeft', { count: info.remaining }) : schedule.availableSeats}
      </span>
    );
  };

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        setLoading(true);
        const schedulesData = await getShuttleSchedulesFromSupabase();
        setSchedules(schedulesData);
        setError(null);
      } catch (err) {
        setError(t('shuttle.loadingError'));
        console.error('Error fetching schedules:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, [t]);

  // Une navette ne doit jamais disparaître : on classe par direction explicite, puis par le nom
  // des lieux (sans accents, FR/EN/IT), et si on ne peut pas trancher elle reste visible dans les deux onglets.
  const isAirport = (place?: string | null) =>
    /a[eé]ro?port|airport|aeroporto/.test(
      (place ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    );

  const filteredSchedules = schedules.filter((schedule) => {
    if (schedule.direction === 'airport-to-city' || schedule.direction === 'city-to-airport') {
      return schedule.direction === direction;
    }
    const fromAirport = isAirport(schedule.from);
    const toAirport = isAirport(schedule.to);
    if (fromAirport === toAirport) return true;
    return direction === 'airport-to-city' ? fromAirport : toAirport;
  });

  const highlights = [
    {
      icon: Clock,
      title: t('shuttle.highlights.reliableSchedule.title'),
      description: t('shuttle.highlights.reliableSchedule.description'),
    },
    {
      icon: MapPin,
      title: t('shuttle.highlights.convenientStops.title'),
      description: t('shuttle.highlights.convenientStops.description'),
    },
    {
      icon: Ticket,
      title: t('shuttle.highlights.easyBooking.title'),
      description: t('shuttle.highlights.easyBooking.description'),
    },
  ];

  return (
    <section id="shuttle" className="section-padding bg-sand-100">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-4">
          <RevealOnScroll className="lg:col-span-6">
            <SectionHeader
              label={t('shuttle.sectionSubtitle')}
              title={t('shuttle.title')}
              description={t('shuttle.sectionDescription')}
            />
          </RevealOnScroll>

          <RevealOnScroll className="lg:col-span-6 lg:flex lg:items-end" delay={80}>
            <div className="inline-flex w-full rounded-lg border border-sand-300 bg-sand-50 p-1">
              {(
                [
                  ['airport-to-city', t('shuttle.direction.airportToCity')],
                  ['city-to-airport', t('shuttle.direction.cityToAirport')],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  className={`flex-1 py-2.5 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                    direction === value
                      ? 'bg-ocean-600 text-sand-50'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  onClick={() => setDirection(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-sand-300 rounded-xl overflow-hidden mb-8 md:mb-10 border border-sand-300">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-sand-50 p-5 md:p-6">
                <Icon size={18} className="text-ocean-600 mb-3" strokeWidth={1.75} />
                <h3 className="font-medium text-ink text-sm mb-1">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <RevealOnScroll className="lg:col-span-5" delay={140}>
          <div>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
              <div className="flex items-center gap-2">
                <Plane size={18} className="text-ocean-600" />
                <h3 className="font-display text-xl font-semibold text-ink">
                  {direction === 'airport-to-city'
                    ? t('shuttle.schedule.title.airportToCity')
                    : t('shuttle.schedule.title.cityToAirport')}
                </h3>
              </div>
              <div>
                <label htmlFor="shuttle-date" className="field-label">
                  {t('booking.form.date')}
                </label>
                <input
                  id="shuttle-date"
                  type="date"
                  min={todayIso()}
                  value={date}
                  onChange={(e) => setDate(e.target.value || todayIso())}
                  className="field-input w-auto py-1.5"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-sand-200/60 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <p className="text-terracotta-600 text-sm">{error}</p>
            ) : filteredSchedules.length === 0 ? (
              <p className="text-ink-muted text-sm">{t('shuttle.schedule.noSchedules')}</p>
            ) : (
              <>
                <div className="md:hidden space-y-3">
                  {filteredSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="rounded-xl border border-sand-300 bg-sand-50 p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs text-ink-light mb-0.5">
                            {t('shuttle.schedule.columns.departure')}
                          </p>
                          <p className="font-medium text-ink text-lg">{schedule.departureTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-ink-light mb-0.5">
                            {t('shuttle.schedule.columns.arrival')}
                          </p>
                          <p className="font-medium text-ink">{schedule.arrivalTime}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-sand-200">
                        <div>
                          <span className="font-display font-semibold text-ocean-700">
                            {schedule.price} {schedule.currency}
                          </span>
                          <span className="ml-2 text-xs text-ink-light">{renderSeats(schedule)}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={seatState(schedule).unavailable}
                          onClick={() => selectForBooking({ service: 'shuttle', id: schedule.id, date })}
                        >
                          {t('shuttle.bookShuttle')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto rounded-xl border border-sand-300 bg-sand-50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sand-300 text-left bg-sand-100/50">
                        <th className="px-4 py-3.5 font-medium text-ink-muted text-xs uppercase tracking-wide">
                          {t('shuttle.schedule.columns.departure')}
                        </th>
                        <th className="px-4 py-3.5 font-medium text-ink-muted text-xs uppercase tracking-wide">
                          {t('shuttle.schedule.columns.arrival')}
                        </th>
                        <th className="px-4 py-3.5 font-medium text-ink-muted text-xs uppercase tracking-wide">
                          {t('shuttle.schedule.columns.price')}
                        </th>
                        <th className="px-4 py-3.5 font-medium text-ink-muted text-xs uppercase tracking-wide">
                          {t('shuttle.schedule.columns.seatsOnDate')}
                        </th>
                        <th className="px-4 py-3.5 font-medium text-ink-muted text-xs uppercase tracking-wide">
                          {t('shuttle.schedule.columns.action')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSchedules.map((schedule) => (
                        <tr
                          key={schedule.id}
                          className="border-b border-sand-200 last:border-0 hover:bg-white/70 transition-colors"
                        >
                          <td className="px-4 py-4 font-medium text-ink tabular-nums">
                            {schedule.departureTime}
                          </td>
                          <td className="px-4 py-4 text-ink-muted tabular-nums">
                            {schedule.arrivalTime}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 font-display text-lg font-semibold text-terracotta-500">
                            {schedule.price} {schedule.currency}
                          </td>
                          <td className="px-4 py-4">
                            {renderSeats(schedule)}
                          </td>
                          <td className="px-4 py-4">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={seatState(schedule).unavailable}
                              onClick={() => selectForBooking({ service: 'shuttle', id: schedule.id, date })}
                            >
                              {t('shuttle.bookShuttle')}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="lg:col-span-7" delay={180}>
          <FlightSchedule />
        </RevealOnScroll>
        </div>

        <RevealOnScroll delay={220}>
          <div className="mt-10 border-t border-sand-300 pt-8">
            <h3 className="font-medium text-ink mb-3">{t('shuttle.importantInfo.title')}</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 text-sm text-ink-muted">
              {(t('shuttle.importantInfo.items', { returnObjects: true }) as string[]).map(
                (item, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ocean-500" aria-hidden="true" />
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
        </RevealOnScroll>
      </Container>
    </section>
  );
}
