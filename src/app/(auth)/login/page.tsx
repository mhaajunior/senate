"use client";

import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Loader } from "@/components/Loader";
import SubmitButton from "@/components/SubmitButton";
import { Form } from "@/components/ui/form";
import { loginUser } from "@/lib/api";
import { LoginValidation, LoginValidationType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Login = () => {
  const { status } = useSession();
  const router = useRouter();

  const form = useForm<LoginValidationType>({
    resolver: zodResolver(LoginValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: loginUser,
    onSuccess: () => {
      router.push("/");
    },
    onError: (error: any) => {
      if (error.message === "CredentialsSignin") {
        toast.error("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      } else {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    },
  });

  const onSubmit = async (values: LoginValidationType) => {
    mutation.mutate(values);
  };

  if (status === "loading") {
    return <Loader variant="full" />;
  }

  if (status === "authenticated") {
    return null;
  }

  return (
    <section className="relative h-screen w-screen">
      <Image
        src="/senate.jpg"
        alt="background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 z-10 flex h-full items-center justify-center opacity-90">
        <div className="border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-8 rounded-md border px-6 py-12 shadow-md">
          <div className="flex items-center gap-2">
            <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <h1 className="text-lg font-semibold">ระบบรับน้องรัฐสภา</h1>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="username"
                label="ชื่อผู้ใช้"
                placeholder="กรอกชื่อผู้ใช้"
                width="w-[240px]"
              />
              <CustomFormField
                fieldType={FormFieldType.PASSWORD}
                control={form.control}
                name="password"
                label="รหัสผ่าน"
                placeholder="กรอกรหัสผ่าน"
                width="w-[240px]"
              />
              <SubmitButton isLoading={mutation.isPending} className="w-full">
                ลงชื่อเข้าใช้
              </SubmitButton>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Login;
