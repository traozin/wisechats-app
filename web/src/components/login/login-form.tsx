"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useForm } from "react-hook-form";
import { UserData } from "@/types/user";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import { handleError } from "@/helpers/utils";

type LoginFormData = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: LoginFormData) {
    try {
      const response = await api.post<UserData>("/login", data);

      if (!response.data) {
        throw new Error("Erro ao fazer login");
      }

      Cookie.set("token-wisechats", response.data.token);
      router.push("/home");
    } catch (error) {
       handleError("Erro ao fazer login", error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn("flex flex-col gap-6", className)}
      {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Entrar na sua conta</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Digite seu e-mail abaixo para acessar sua conta
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@exemplo.com"
            {...register("email", {
              required: "Email é obrigatório",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Email inválido",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            {...register("password", {
              required: "Senha é obrigatória",
              minLength: {
                value: 6,
                message: "A senha deve ter pelo menos 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </div>
      <div className="text-center text-sm">
        Não tem uma conta?{" "}
        <a href="/register" className="underline underline-offset-4">
          Cadastre-se
        </a>
      </div>
    </form>
  );
}
