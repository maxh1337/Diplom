import { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  value?: string;
  setValue?: React.Dispatch<React.SetStateAction<any>>;
  register?: ReturnType<any>; // from react-hook-form's register()
}

export default function InputField({
  label,
  value,
  setValue,
  register,
  className,
  ...rest
}: InputProps) {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={rest.id || rest.name || "input"}
          className="mb-2 text-sm font-brain font-bold text-white"
        >
          {label}
        </label>
      )}
      <input
        id={rest.id || rest.name || "input"}
        value={setValue ? value : undefined}
        onChange={setValue ? (e) => setValue(e.target.value) : undefined}
        {...(register ? register : {})}
        {...rest}
        className={twMerge(
          "bg-secondary text-white font-unbound font-extralight p-3 rounded-lg focus:outline-none border border-fourth",
          "placeholder:text-fourth focus:bg-black focus:border-white",
          className
        )}
      />
    </div>
  );
}
