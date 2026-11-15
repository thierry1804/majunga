/**
 * Allée de baobabs au crépuscule, Mahajanga.
 * Illustration en aplats par bandes (façon gravure de gazette), uniquement dans la palette
 * du système : ocean-900/800/700/600, terracotta, sand. Aucun dégradé, aucune photo.
 */

const TRUNK =
  'M -76 0 C -52 -16 -44 -70 -40 -150 C -36 -230 -33 -300 -31 -332 C -30 -352 -40 -366 -54 -382 L 54 -382 C 40 -366 30 -352 31 -332 C 33 -300 36 -230 40 -150 C 44 -70 52 -16 76 0 Z';

const BRANCHES = [
  'M -50 -380 C -80 -392 -112 -414 -128 -450',
  'M -22 -384 C -34 -420 -44 -450 -40 -490',
  'M 0 -384 C 0 -430 4 -470 -4 -520',
  'M 20 -384 C 30 -424 52 -452 62 -496',
  'M 50 -380 C 84 -392 118 -410 142 -446',
];

const TUFTS: Array<[number, number, number, number]> = [
  [-128, -452, 26, 12],
  [-40, -492, 24, 11],
  [-4, -522, 22, 10],
  [62, -498, 28, 12],
  [142, -448, 26, 12],
];

function Baobab({ x, y, scale, fill }: { x: number; y: number; scale: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill}>
      <path d={TRUNK} />
      <g fill="none" stroke={fill} strokeWidth="12" strokeLinecap="round">
        {BRANCHES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {TUFTS.map(([cx, cy, rx, ry]) => (
        <ellipse key={`${cx}${cy}`} cx={cx} cy={cy} rx={rx} ry={ry} />
      ))}
    </g>
  );
}

const REFLECTIONS: Array<[number, number, number]> = [
  [612, 280, 9],
  [632, 220, 8],
  [652, 160, 8],
  [674, 110, 7],
  [698, 64, 6],
];

interface BaobabSceneProps {
  className?: string;
  /** Texte alternatif : si absent, l'illustration est décorative. */
  label?: string;
}

export default function BaobabScene({ className = '', label }: BaobabSceneProps) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMaxYMax slice"
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {/* Ciel par bandes */}
      <rect width="1600" height="900" fill="#062626" />
      <rect y="240" width="1600" height="140" fill="#0a3333" />
      <rect y="380" width="1600" height="100" fill="#0f4444" />
      <rect y="480" width="1600" height="65" fill="#145555" />
      <rect y="545" width="1600" height="55" fill="#a84d34" />

      {/* Soleil, coupé par l'horizon */}
      <circle cx="1010" cy="600" r="170" fill="#d4704f" />
      <rect y="600" width="1600" height="170" fill="#0f4444" />

      {/* Reflets sur la mer */}
      {REFLECTIONS.map(([y, w, h]) => (
        <rect key={y} x={1010 - w / 2} y={y} width={w} height={h} fill="#d4704f" />
      ))}
      <rect x="120" y="640" width="190" height="4" fill="#1a6b6b" />
      <rect x="330" y="690" width="260" height="4" fill="#1a6b6b" />
      <rect x="1240" y="650" width="220" height="4" fill="#1a6b6b" />
      <rect x="1360" y="710" width="160" height="4" fill="#1a6b6b" />

      {/* Pirogue à voile latine */}
      <g fill="#062626">
        <path d="M 868 628 Q 918 650 986 628 L 972 640 Q 922 656 882 640 Z" />
        <path d="M 922 628 L 922 566 L 968 624 Z" />
      </g>

      {/* Baobabs lointains */}
      <Baobab x={880} y={768} scale={0.34} fill="#0a3333" />
      <Baobab x={940} y={766} scale={0.28} fill="#0a3333" />

      {/* Sol */}
      <path
        d="M 0 790 C 260 768 560 800 880 774 S 1380 752 1600 778 L 1600 900 L 0 900 Z"
        fill="#062626"
      />

      {/* Baobabs proches */}
      <Baobab x={1130} y={790} scale={0.8} fill="#062626" />
      <Baobab x={1340} y={800} scale={1.02} fill="#062626" />
      <Baobab x={1530} y={790} scale={0.62} fill="#062626" />
    </svg>
  );
}
