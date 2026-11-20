// Chip 컴포넌트: 분류 칩. 고른 칩은 selected.
type ChipProps = {
  selected: boolean;
  onClick: () => void;
  children: string;
};

export function Chip({ selected, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`h-9 shrink-0 rounded-full px-(--space-16) text-label-md whitespace-nowrap ${
        selected ? "bg-primary text-text-on-primary" : "bg-surface-card text-text-secondary"
      }`}
    >
      {children}
    </button>
  );
}
