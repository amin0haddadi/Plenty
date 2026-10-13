"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button, TextLink } from "@/components/ui/button";
import { isValidIranPhone, normalizeIranPhone } from "@/lib/phone";

import { AuthForm, authInputClass } from "./auth-form";

type PhoneFormValues = {
  name: string;
  phone: string;
};

export function PhoneForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PhoneFormValues>({
    defaultValues: { name: "", phone: "" },
  });

  async function onSubmit(values: PhoneFormValues) {
    const response = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: normalizeIranPhone(values.phone),
        name: isRegister ? values.name.trim() : undefined,
      }),
    });
    if (!response.ok) {
      const body = (await response.json()) as { message?: string };
      setError("root", { message: body.message ?? "ارسال کد ممکن نشد" });
      return;
    }
    router.push("/otp");
  }

  const phoneInvalid = Boolean(errors.phone || errors.root);

  return (
    <AuthForm
      title={isRegister ? "ساخت حساب" : "ورود"}
      description={
        isRegister ? "برای دسترسی به اپ ثبت‌نام کن" : "برای دسترسی به اپ وارد شو"
      }
      onSubmit={handleSubmit(onSubmit)}
    >
      {isRegister ? (
        <label className="mt-6 block text-sm text-black">
          نام
          <input
            {...register("name", {
              validate: (value) => value.trim().length >= 2 || "نام را وارد کنید",
            })}
            className={`mt-2 h-12 w-full px-4 ${authInputClass} ${
              errors.name ? "border-danger" : "border-white"
            }`}
          />
        </label>
      ) : null}
      {errors.name ? (
        <p className="mt-2 text-xs text-danger">{errors.name.message}</p>
      ) : null}

      <label className="mt-4 block text-sm text-black">
        شماره موبایل
        <input
          inputMode="numeric"
          placeholder="09121234567"
          maxLength={11}
          {...register("phone", {
            validate: (value) =>
              isValidIranPhone(value) || "شماره موبایل معتبر وارد کنید",
          })}
          className={`mt-2 h-12 w-full px-4 ${authInputClass} ${
            phoneInvalid ? "border-danger" : "border-white"
          }`}
        />
      </label>
      {errors.phone ? (
        <p className="mt-2 text-xs text-danger">{errors.phone.message}</p>
      ) : null}
      {errors.root ? (
        <p className="mt-2 text-xs text-danger">{errors.root.message}</p>
      ) : null}
      <p className="mt-4 text-center text-xs text-black/70">
        کد تأیید پیامک می‌شود. کد آزمایشی ۱۲۳۴
      </p>
      <Button type="submit" variant="block" disabled={isSubmitting} className="mt-4">
        {isSubmitting ? "در حال ارسال…" : "دریافت کد"}
      </Button>
      <p className="mt-4 text-center text-sm text-black/70">
        {isRegister ? "قبلاً حساب داری؟" : "حساب نداری؟"}{" "}
        <TextLink href={isRegister ? "/login" : "/register"} tone="black">
          {isRegister ? "ورود" : "ثبت‌نام"}
        </TextLink>
      </p>
    </AuthForm>
  );
}
