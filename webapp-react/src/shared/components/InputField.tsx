import { twMerge } from "tailwind-merge";

interface InputProps {
  label: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<any>>;
}

export default function InputField(props: InputProps) {
  return (
    <>
      <label htmlFor="name" className="mb-2 text-sm font-brain font-bold">
        {props.label}
      </label>
      <input
        id="name"
        type="text"
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
        placeholder="Например, Олег"
        className={twMerge(
          "bg-secondary text-white font-unbound font-extralight p-4 rounded-lg focus:outline-none",
          " placeholder:text-fourth focus:bg-black border-2 focus:border-white border-secondary"
        )}
        required
      />
    </>
  );
}
