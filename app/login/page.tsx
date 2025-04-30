"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { InputOtp } from "@heroui/input-otp";
import { addToast } from "@heroui/toast";
import { PiEyeSlash, PiEye } from "react-icons/pi";
import Image from "next/image";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/actions";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [verifyAction, setVerifyAction] = useState<
    "register" | "reset-password"
  >("register");
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [step, setStep] = useState<
    "index" | "login" | "verify" | "register" | "reset-password"
  >("index");

  const router = useRouter();

  const validatePhone = (p: string) => {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(p);
  };

  const convertToEnglishNumbers = (num: string) => {
    return num.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
  };

  async function saveAuthInfo(token: string) {
    localStorage.setItem("authToken", token);
    await setAuthToken(token);
    router.push("/");
  }

  async function index() {
    if (!validatePhone(phone)) {
      addToast({
        title: "خطا",
        description: "لطفا شماره موبایل خود را درست وارد کنید",
        color: "danger",
      });
      return;
    }
    setLoading(true);
    const response = await api("/auth", "POST", { phone });
    if (response.ok) {
      if (response.data.action === "login") {
        setStep("login");
      } else {
        setVerifyAction("register");
        setStep("verify");
      }
    }
    setLoading(false);
  }

  async function login() {
    setLoading(true);
    const response = await api("/login", "POST", { phone, password });
    if (response.ok) {
      await saveAuthInfo(response.data.token.token);
    } else {
      setLoading(false);
    }
  }

  async function verify() {
    setLoading(true);
    const response = await api("/verify", "POST", { phone, code });
    if (response.ok) {
      setStep(verifyAction);
    }
    setLoading(false);
  }

  async function register() {
    setLoading(true);
    const response = await api("/register", "POST", {
      phone,
      password,
      name,
      code,
    });
    if (response.ok) {
      await saveAuthInfo(response.data.token.token);
    } else {
      setLoading(false);
    }
  }

  async function forgotPassword() {
    setLoading(true);
    const response = await api("/forgot-password", "POST", { phone });
    if (response.ok) {
      setPassword("");
      setVerifyAction("reset-password");
      setStep("verify");
    }
    setLoading(false);
  }

  async function resetPassword() {
    setLoading(true);
    const response = await api("/reset-password", "POST", {
      phone,
      code,
      password,
    });
    if (response.ok) {
      await saveAuthInfo(response.data.token.token);
    } else {
      setLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    if (step === "index") return await index();
    if (step === "login") return await login();
    if (step === "verify") return await verify();
    if (step === "register") return await register();
    return await resetPassword();
  }

  function formTitle() {
    if (step === "index") return "خوش آمدید";
    if (step === "login") return "رمز خود را وارد کنید";
    if (step === "verify") return "کد ارسالی را وارد کنید";
    if (step === "register") return "تکمیل ثبت نام";
    return "رمز جدید خود را وارد کنید";
  }

  function submitButtonText() {
    if (step === "index" || step === "login") return "ورود";
    if (step === "verify") return "بررسی";
    if (step === "register") return "ثبت نام";
    return "بازنشانی رمز";
  }

  function formComponents() {
    if (step === "index") {
      return (
        <Input
          isRequired
          label="شماره موبایل"
          placeholder="09120000000"
          type="text"
          value={phone}
          onValueChange={(val) => setPhone(convertToEnglishNumbers(val))}
        />
      );
    }
    if (step === "login") {
      return (
        <>
          <Input
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <PiEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <PiEye className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            isRequired
            label="رمز"
            type={isVisible ? "text" : "password"}
            value={password}
            onValueChange={(val) => setPassword(val)}
          />
          <div
            className="text-primary text-sm cursor-pointer"
            onClick={forgotPassword}
          >
            رمز خود را فراموش کردید؟
          </div>
        </>
      );
    }
    if (step === "verify") {
      return (
        <div className="w-max mx-auto" dir="ltr">
          <InputOtp
            isRequired
            label="کد تایید"
            type="text"
            value={code}
            onValueChange={(val) => setCode(val)}
            length={4}
            size="lg"
            errorMessage="کد باید ۴ رقم باشد"
          />
        </div>
      );
    }
    if (step === "register") {
      return (
        <>
          <Input
            isRequired
            label="نام"
            type="text"
            value={name}
            onValueChange={(val) => setName(val)}
          />
          <Input
            isRequired
            label="رمز"
            type="password"
            value={password}
            onValueChange={(val) => setPassword(val)}
          />
        </>
      );
    }
    return (
      <Input
        isRequired
        label="رمز"
        type="password"
        value={password}
        onValueChange={(val) => setPassword(val)}
      />
    );
  }

  return (
    <div className="bg-default-50 flex min-h-screen items-center justify-center p-4">
      <div className="bg-content1 flex w-full max-w-sm flex-col gap-4 rounded-lg p-6 shadow-md">
        <Image
          src="/assets/logo.webp"
          alt="logo"
          className="mx-auto rounded-2xl"
          width={80}
          height={80}
        />
        <h2 className="text-xl font-medium text-center">{formTitle()}</h2>
        <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {formComponents()}
          <Button
            className="w-full"
            color="primary"
            type="submit"
            isLoading={loading}
          >
            {submitButtonText()}
          </Button>
        </Form>
        <Divider />
        <p dir="ltr" className="text-xs text-center text-gray-600">
          ©2025 Hube
        </p>
      </div>
    </div>
  );
}
