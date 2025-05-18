import { useState } from "react";
import { twMerge } from "tailwind-merge";
import type { UserCategoryType } from "../../../lib/modules/user/user.types";
import InputField from "../../../shared/components/InputField";
import ReactSelect from "../../../shared/components/ReactSelect";
import { useContinueRegistration } from "../hooks/useContinueRegistration";

export interface Category {
  value: UserCategoryType;
  label: string;
}

export default function ContrinueRegistrationForm() {
  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState<number>();
  const [category, setCategory] = useState<Category>({
    value: "SchoolBefore9",
    label: "Школа до 9 класса",
  });
  const { continueRegistration, isSuccess } = useContinueRegistration();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    continueRegistration({
      nickname,
      userCategory: category.value,
      yearOfBirth: birthYear ? birthYear : 2003,
    });

    if (isSuccess) {
      setNickname("");
      setCategory({
        value: "SchoolBefore9",
        label: "Школа до 9 класса",
      });
    }
  };

  return (
    <div className="text-white font-brain">
      <h2 className=" text-2xl font-geist-mono my-4 text-center">
        Для продолжения необходимо заполнить эту форму
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto pt-4"
      >
        <div className="flex flex-col">
          <InputField
            label="Представьтесь"
            value={nickname}
            setValue={setNickname}
          />
        </div>
        <div className="flex flex-col">
          <ReactSelect category={category} setCategory={setCategory} />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="birthYear"
            className="mb-2 text-sm font-brain font-bold"
          >
            Год рождения
          </label>
          <input
            id="birthYear"
            type="number"
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
            placeholder="Например, 2003"
            min="1900"
            max={new Date().getFullYear()}
            className={twMerge(
              "bg-secondary text-white font-unbound font-extralight p-4 rounded-lg focus:outline-none",
              " placeholder:text-third focus:bg-black border-2 focus:border-white border-secondary"
            )}
            required
          />
        </div>
        <button
          type="submit"
          className={twMerge(
            "bg-secondary text-white font-brain py-3 px-4 rounded-lg transition-colors mt-4 border-2 border-black",
            "hover:bg-black hover:border-white curp"
          )}
        >
          Продолжить
        </button>
      </form>
    </div>
  );
}
