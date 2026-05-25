import { useState, useEffect } from 'react';
import { Clock, MapPin, Ticket, Plane } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getShuttleSchedulesFromSupabase } from '../../api/supabaseService';
import { ShuttleSchedule } from '../../types';
import Container from '../ui/Container';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import FlightSchedule from '../FlightSchedule';
import RevealOnScroll from '../motion/RevealOnScroll';

export default function ShuttleSection() {
  const { t } = useTranslation();
  const [schedules, setSchedules] = useState<ShuttleSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'airport-to-city' | 'city-to-airport'>(
    'airport-to-city'
  );

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

  const filteredSchedules = schedules.filter((schedule) =>
    direction === 'airport-to-city'
      ? schedule.direction === 'airport-to-city' || (schedule.from?.toLowerCase().includes('airport') && !schedule.to?.toLowerCase().includes('airport'))
      : schedule.direction === 'city-to-airport' || (schedule.to?.toLowerCase().includes('airport') && !schedule.from?.toLowerCase().includes('airport'))
  );

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-sand-300 rounded-xl overflow-hidden mb-12 md:mb-14 border border-sand-300">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-sand-50 p-5 md:p-6">
                <Icon size={18} className="text-ocean-600 mb-3" strokeWidth={1.75} />
                <h3 className="font-medium text-ink text-sm mb-1">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={140}>
          <div className="mb-12 md:mb-14">
            <div className="flex items-center gap-2 mb-6">
              <Plane size={18} className="text-ocean-600" />
              <h3 className="font-display text-xl font-semibold text-ink">
                {direction === 'airport-to-city'
                  ? t('shuttle.schedule.title.airportToCity')
                  : t('shuttle.schedule.title.cityToAirport')}
              </h3>
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
                          <span className="text-xs text-ink-light ml-2">
                            {schedule.availableSeats > 0
                              ? `${schedule.availableSeats} ${t('shuttle.schedule.columns.availableSeats').toLowerCase()}`
                              : t('shuttle.schedule.full')}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={schedule.availableSeats === 0}
                          onClick={() =>
                            document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
                          }
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
                        <th className="px-5 py-3.5 font-medium text-ink-muted text-xs uppercase tracking-wide">
                          {t('shuttle.schedule.columns.departure')}
                        </th>
                        <th className="px-5 py-3.5 font-medium text-ink-muted text-xs uppercase tracking-wide">
                          {t('shuttle.schedule.columns.arrival')}
                        </th>
                        <th className="px-5 py-3.5 font-medium text-ink-muted text-xs uppercase tracking-wide">
                          {t('shuttle.schedule.columns.price')}
                        </th>
                        <th className="px-5 py-3.5 font-medium text-ink-muted text-xs uppercase tracking-wide">
                          {t('shuttle.schedule.columns.availableSeats')}
                        </th>
                        <th className="px-5 py-3.5 font-medium text-ink-muted text-xs uppercase tracking-wide">
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
                          <td className="px-5 py-4 font-medium text-ink tabular-nums">
                            {schedule.departureTime}
                          </td>
                          <td className="px-5 py-4 text-ink-muted tabular-nums">
                            {schedule.arrivalTime}
                          </td>
                          <td className="px-5 py-4 font-medium text-ocean-700">
                            {schedule.price} {schedule.currency}
                          </td>
                          <td className="px-5 py-4">
                            {schedule.availableSeats > 0 ? (
                              <span className="text-ocean-700">{schedule.availableSeats}</span>
                            ) : (
                              <span className="text-terracotta-500">{t('shuttle.schedule.full')}</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={schedule.availableSeats === 0}
                              onClick={() =>
                                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
                              }
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

        <RevealOnScroll delay={180}>
          <div className="mb-12 md:mb-14">
            <FlightSchedule />
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={220}>
          <div className="border-t border-sand-300 pt-8 max-w-2xl">
            <h3 className="font-medium text-ink mb-3">{t('shuttle.importantInfo.title')}</h3>
            <ul className="space-y-2 text-sm text-ink-muted">
              {(t('shuttle.importantInfo.items', { returnObjects: true }) as string[]).map(
                (item, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-ocean-500 shrink-0">—</span>
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
