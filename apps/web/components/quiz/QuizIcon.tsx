import {
  ArrowUpFromLine,
  BrickWall,
  Building,
  Building2,
  CircleCheck,
  CircleX,
  Crown,
  Award,
  House,
  KeyRound,
  Shapes,
  Star,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

const DOT_COLORS = ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];

function FloorPlan({ dots }: { dots: number }) {
  const positions = [
    [12, 12],
    [28, 12],
    [12, 28],
    [28, 28],
    [20, 20],
    [36, 20],
  ];
  return (
    <svg viewBox="0 0 40 40" className="size-9">
      <rect x="3" y="3" width="34" height="34" rx="2" fill="none" stroke="#64748b" strokeWidth="1.5" />
      <path d="M20 3v12M20 25v12M3 20h10M27 20h10" stroke="#94a3b8" strokeWidth="1.5" />
      {positions.slice(0, dots).map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill={DOT_COLORS[i]} />
      ))}
    </svg>
  );
}

function AreaSquares({ level }: { level: number }) {
  const colors = ['#14532d', '#15803d', '#84cc16', '#facc15'];
  return (
    <svg viewBox="0 0 40 40" className="size-9">
      {Array.from({ length: level }, (_, i) => level - 1 - i).map((i) => {
        const size = 10 + i * 8;
        return <rect key={i} x={36 - size} y={4} width={size} height={size} rx="2" fill={colors[i]} />;
      })}
    </svg>
  );
}

function UnitRoom({ position }: { position: 'wall' | 'ceiling' | 'floor' }) {
  const unit = {
    wall: <rect x="10" y="14" width="14" height="5" rx="1.5" fill="#f97316" />,
    ceiling: <path d="M15 10 L27 10 L24 14 L12 14 Z" fill="#f97316" />,
    floor: <rect x="11" y="25" width="10" height="7" rx="1.5" fill="#f97316" />,
  }[position];
  return (
    <svg viewBox="0 0 40 40" className="size-9">
      <path d="M20 3 L36 11 L36 29 L20 37 L4 29 L4 11 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      <path d="M20 21 L20 37 M20 21 L4 11 M20 21 L36 11" stroke="#cbd5e1" strokeWidth="1.2" />
      {unit}
    </svg>
  );
}

function Unsure() {
  return (
    <svg viewBox="0 0 40 40" className="size-9">
      <path d="M20 3 L36 11 L36 29 L20 37 L4 29 L4 11 Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
      <text x="20" y="27" textAnchor="middle" fontSize="18" fontWeight="800" fill="#ef4444">
        ?
      </text>
    </svg>
  );
}

const NUM_COLORS = ['#f97316', '#84cc16', '#0ea5e9', '#f59e0b', '#7c3aed', '#9333ea'];

function BigNumber({ n }: { n: string }) {
  const idx = n === 'more' ? 5 : Number(n) - 1;
  return (
    <span className="text-3xl font-extrabold leading-none" style={{ color: NUM_COLORS[idx] }}>
      {n === 'more' ? '>5' : n}
    </span>
  );
}

function OutdoorSquares({ count }: { count: 1 | 2 | 3 }) {
  return (
    <svg viewBox="0 0 40 40" className="size-9">
      {count === 1 && <rect x="13" y="13" width="14" height="14" rx="2" fill="#0ea5e9" />}
      {count === 2 && (
        <>
          <rect x="8" y="16" width="14" height="14" rx="2" fill="#a3e635" />
          <rect x="16" y="9" width="14" height="14" rx="2" fill="#16a34a" opacity="0.9" />
        </>
      )}
      {count === 3 && (
        <>
          <rect x="6" y="18" width="14" height="14" rx="2" fill="#f59e0b" />
          <rect x="13" y="12" width="14" height="14" rx="2" fill="#f97316" opacity="0.9" />
          <rect x="20" y="6" width="14" height="14" rx="2" fill="#ef4444" opacity="0.85" />
          <text x="27" y="17" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff">
            ?
          </text>
        </>
      )}
    </svg>
  );
}

const LUCIDE: Record<string, { icon: LucideIcon; color: string }> = {
  yes: { icon: CircleCheck, color: '#f97316' },
  no: { icon: CircleX, color: '#65a30d' },
  owner: { icon: House, color: '#f59e0b' },
  tenant: { icon: KeyRound, color: '#f59e0b' },
  'place-ground': { icon: ArrowUpFromLine, color: '#7c3aed' },
  'place-wall-low': { icon: BrickWall, color: '#dc2626' },
  'place-wall-high': { icon: Building2, color: '#2563eb' },
  'place-pitched': { icon: Warehouse, color: '#0f766e' },
  'place-flat': { icon: Building, color: '#7c3aed' },
  other: { icon: Shapes, color: '#ec4899' },
  'tier-entry': { icon: Star, color: '#f59e0b' },
  'tier-mid': { icon: Award, color: '#16a34a' },
  'tier-premium': { icon: Crown, color: '#4338ca' },
};

export function QuizIcon({ name }: { name: string }) {
  const [group, value] = name.split(/-(.+)/);

  if (group === 'rooms') return <FloorPlan dots={value === 'more' ? 6 : Number(value)} />;
  if (group === 'area') return <AreaSquares level={Number(value)} />;
  if (group === 'unit') return <UnitRoom position={value as 'wall' | 'ceiling' | 'floor'} />;
  if (name === 'unsure') return <Unsure />;
  if (group === 'num') return <BigNumber n={value} />;
  if (group === 'outdoor') return <OutdoorSquares count={value === 'more' ? 3 : (Number(value) as 1 | 2)} />;

  const entry = LUCIDE[name];
  if (!entry) return null;
  const Icon = entry.icon;
  return <Icon className="size-8" style={{ color: entry.color }} strokeWidth={2} />;
}
