import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "lime" | "white" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  lime: "bg-lime text-black hover:brightness-95",
  white:
    "bg-white text-black shadow-[0_9px_22px_rgba(0,0,0,0.25),inset_0_-3px_0_rgba(0,0,0,0.12)] hover:brightness-95",
  outline: "bg-transparent text-white-90 border border-white-16 hover:bg-white-6",
  ghost: "bg-transparent text-white-90 hover:bg-white-6",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
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
    "inline-flex items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none",
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
