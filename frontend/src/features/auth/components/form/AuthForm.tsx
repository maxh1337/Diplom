"use client";

import ReCAPTCHA from "react-google-recaptcha";
import { twMerge } from "tailwind-merge";
import InputField from "../../../../shared/components/ui/InputField";
import { MiniLoader } from "../../../../shared/components/ui/MiniLoader";
import { useAuthForm } from "../../hooks/useAuthForm";

export function AuthForm() {
  const { handleSubmit, isLoading, onSubmit, recaptchaRef, register } =
    useAuthForm();

  return (
    <>
      <h2
        className={twMerge("font-brain mb-4 text-center text-2xl text-white")}
      >
        Sign In
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-sm mx-auto w-full justify-center flex flex-col items-center bg-secondary p-8 rounded-2xl"
      >
        <div className="w-full">
          <div className="mb-4">
            <InputField
              required
              label="Your login"
              placeholder="Введите логин"
              register={register("login", { required: true })}
            />
          </div>
          <div className="mb-6">
            <InputField
              required
              label="Your password"
              type="password"
              placeholder="Enter password"
              {...register("password", { required: true })}
            />
          </div>
        </div>
        <ReCAPTCHA
          ref={recaptchaRef}
          size="normal"
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
          theme="dark"
          className="mb-5 w-[304px] scale-[0.8] sm:scale-[0.95] md:scale-[1] h-full"
        />
        <div className="mb-3 w-full">
          <button
            type="submit"
            className={twMerge(
              "w-full font-semibold rounded transition duration-500 ease-in-out mt-1 px-5 py-2.5 text-white text-[18px]",
              "hover:scale-105",
              "bg-black",
              isLoading && "opacity-75 cursor-not-allowed"
            )}
            disabled={isLoading}
          >
            {isLoading ? <MiniLoader /> : "Sign In"}
          </button>
        </div>
      </form>
    </>
  );
}
