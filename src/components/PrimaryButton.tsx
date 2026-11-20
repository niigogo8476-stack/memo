import Link from "next/link";
import type { ReactNode } from "react";

// Button/Primary 컴포넌트: 화면마다 하나, 아래쪽에 가로로 꽉 차게 둔다. icon을 주면 글자 앞에 붙는다.
// href를 주면 다른 화면으로 가는 링크가 되고, onClick을 주면 누를 때 실행된다.
const className =
  "flex h-14 w-full items-center justify-center gap-(--space-8) rounded-md bg-primary px-(--space-24) text-button-md text-text-on-primary";

type PrimaryButtonProps = {
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  children: ReactNode;
};

export function PrimaryButton({ icon, href, onClick, children }: PrimaryButtonProps) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {icon}
      {children}
    </button>
  );
}
