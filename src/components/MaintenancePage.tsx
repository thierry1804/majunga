interface MaintenancePageProps {
  message?: string | null;
}

export default function MaintenancePage({ message }: MaintenancePageProps) {
  const defaultMessage =
    'Le site est en maintenance. Nous serons de retour très bientôt.';

  return (
    <div className="min-h-[100dvh] bg-sand-50 flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <p className="section-label mb-4">Mada Booking</p>
        <h1 className="font-display text-3xl font-semibold text-ink mb-4">
          Maintenance en cours
        </h1>
        <p className="text-ink-muted leading-relaxed">{message || defaultMessage}</p>
      </div>
    </div>
  );
}
