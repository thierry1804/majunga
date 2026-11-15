import { useEffect, useState } from 'react';
import { ArrowRight, Plane } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getShuttleSchedulesFromSupabase } from '../../api/supabaseService';
import { ShuttleSchedule } from '../../types';
import HeroEntrance from '../motion/HeroEntrance';

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

/** Les trois prochains départs de la navette, lus depuis l'API : le visiteur voit tout de suite l'offre. */
export default function NextDepartures() {
  const { t } = useTranslation();
  const [next, setNext] = useState<ShuttleSchedule[]>([]);

  useEffect(() => {
    let active = true;
    getShuttleSchedulesFromSupabase()
      .then((schedules) => {
        if (!active) return;
        const now = new Date();
        const nowMin = now.getHours() * 60 + now.getMinutes();
        const sorted = [...schedules].sort((a, b) => toMinutes(a.departureTime) - toMinutes(b.departureTime));
        const upcoming = sorted.filter((s) => toMinutes(s.departureTime) >= nowMin);
        // Passé le dernier départ du jour, on montre les premiers du lendemain.
        setNext([...upcoming, ...sorted.filter((s) => !upcoming.includes(s))].slice(0, 3));
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  if (next.length === 0) return null;

  const goToShuttle = () => document.querySelector('#shuttle')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <HeroEntrance delay={320} className="hidden lg:block lg:col-span-4 lg:col-start-9">
      <aside
        aria-label={t('hero.nextShuttles')}
        className="rounded-xl bg-sand-50 text-ink shadow-elevated overflow-hidden"
      >
        <div className="flex items-center gap-2 bg-ocean-700 px-5 py-3 text-sand-50">
          <Plane size={16} strokeWidth={1.75} aria-hidden="true" />
          <h2 className="text-sm font-medium">{t('hero.nextShuttles')}</h2>
        </div>
        <ul className="divide-y divide-sand-200">
          {next.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <div className="min-w-0">
                <p className="font-display text-3xl font-semibold leading-none text-ocean-800 tabular-nums">
                  {s.departureTime}
                </p>
                <p className="mt-1.5 truncate text-xs text-ink-muted">
                  {s.from} <span aria-hidden="true">→</span> {s.to}
                </p>
              </div>
              <p className="shrink-0 font-display text-xl font-semibold text-terracotta-500">
                {s.price} {s.currency}
              </p>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={goToShuttle}
          className="flex w-full items-center justify-between bg-terracotta-500 px-5 py-3.5 text-sm font-medium text-sand-50 transition-colors duration-200 hover:bg-terracotta-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sand-50"
        >
          {t('shuttle.bookShuttle')}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </aside>
    </HeroEntrance>
  );
}
