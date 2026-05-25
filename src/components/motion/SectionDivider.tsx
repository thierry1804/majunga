type DividerTone =
  | 'hero-to-sand'
  | 'sand-to-white'
  | 'white-to-sand'
  | 'sand-to-sand-light'
  | 'sand-light-to-white';

interface SectionDividerProps {
  tone: DividerTone;
}

const config: Record<DividerTone, { bg: string; wave: string; waveAlt: string }> = {
  'hero-to-sand': { bg: '#062626', wave: '#faf7f2', waveAlt: '#f5ede0' },
  'sand-to-white': { bg: '#faf7f2', wave: '#ffffff', waveAlt: '#faf7f2' },
  'white-to-sand': { bg: '#ffffff', wave: '#faf7f2', waveAlt: '#ffffff' },
  'sand-to-sand-light': { bg: '#ffffff', wave: '#f5ede0', waveAlt: '#faf7f2' },
  'sand-light-to-white': { bg: '#f5ede0', wave: '#ffffff', waveAlt: '#f5ede0' },
};

export default function SectionDivider({ tone }: SectionDividerProps) {
  const { bg, wave, waveAlt } = config[tone];

  return (
    <div
      aria-hidden="true"
      className="relative h-14 md:h-20 -mt-px pointer-events-none overflow-hidden motion-safe:animate-divider-reveal"
      style={{ backgroundColor: bg }}
    >
      <svg
        className="absolute bottom-0 w-[110%] -left-[5%] h-12 md:h-16 motion-safe:animate-wave-drift-slow"
        viewBox="0 0 1440 56"
        preserveAspectRatio="none"
      >
        <path
          d="M0,32 C360,52 720,16 1080,36 C1260,46 1380,40 1440,34 L1440,56 L0,56 Z"
          fill={waveAlt}
          opacity="0.45"
        />
      </svg>
      <svg
        className="absolute bottom-0 w-full h-10 md:h-14 motion-safe:animate-wave-drift"
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
      >
        <path
          d="M0,28 C480,44 960,12 1440,32 L1440,48 L0,48 Z"
          fill={wave}
        />
      </svg>
    </div>
  );
}
