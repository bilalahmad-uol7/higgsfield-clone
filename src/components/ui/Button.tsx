import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "white" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "bg-rec text-ink hover:bg-paper",
  white: "bg-paper text-ink hover:bg-rec",
  outline: "bg-transparent text-paper border border-white-24 hover:border-paper hover:bg-white-6",
  ghost: "bg-transparent text-white-80 hover:text-paper hover:bg-white-6",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-[11px]",
  md: "h-10 px-4 text-xs",
  lg: "h-13 px-6 text-[13px]",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { href?: undefined };

type ButtonAsLink = BaseProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof BaseProps | "href"
  >;

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "white", size = "md", className, children, ...rest } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-mono font-medium uppercase tracking-[0.12em] whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rec disabled:opacity-40 disabled:pointer-events-none",
    variantClass[variant],
    sizeClass[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, ...linkRest } = rest as Omit<ButtonAsLink, keyof BaseProps>;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as Omit<ButtonAsButton, keyof BaseProps>)}>
      {children}
    </button>
  );
}
