import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "first" | "second";
  size?: "sm" | "md" | "lg";
}

const Button: FC<PropsWithChildren<IButton>> = ({
  children,
  className,
  variant,
  size = "md",
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={twMerge(
        "btn font-unbound cursor-pointer transition duration-300 ease-in-out rounded-xl",
        variant === "first"
          ? "text-white bg-secondary border border-secondary hover:bg-third hover:text-white hover:border-white"
          : "text-fourth bg-third border border-third hover:bg-black hover:text-white",
        size === "md" ? "py-2.5 px-8" : size === "sm" ? "" : "",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
