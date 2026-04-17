import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

const colors = {
  primary: "bg-green-700 hover:bg-green-600 text-white",
  secondary: "bg-brown-500 hover:bg-brown-400 text-white",
  danger: "bg-red-700 hover:bg-red-600 text-white",
};

export function PixelButton({ variant = "primary", className = "", children, ...rest }: Props) {
  return (
    <button
      className={`font-game text-[8px] px-3 py-2 border-2 border-black
        shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
        disabled:opacity-40 disabled:cursor-not-allowed
        ${colors[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
