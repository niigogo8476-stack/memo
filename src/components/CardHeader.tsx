import { IconChevronRight, IconPin } from "./icons";

// Card/Header 컴포넌트: pin을 켜면 고정 표시, action을 켜면 오른쪽에 전체 보기가 붙는다.
type CardHeaderProps = {
  title: string;
  pin?: boolean;
  action?: string;
};

export function CardHeader({ title, pin = false, action }: CardHeaderProps) {
  return (
    <div className="flex h-10 items-center gap-(--space-4) pt-(--space-12) pr-(--space-16) pb-(--space-4) pl-(--space-20)">
      {pin && <IconPin className="shrink-0 text-primary" />}
      <h2 className="flex-1 text-label-md text-text-primary">{title}</h2>
      {action && (
        <button type="button" className="flex items-center gap-(--space-4) text-caption-md text-text-muted">
          <span className="whitespace-nowrap">{action}</span>
          <IconChevronRight className="shrink-0" />
        </button>
      )}
    </div>
  );
}
