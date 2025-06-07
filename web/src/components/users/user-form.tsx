"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserFormData, UserService, editUserSchema } from "@/hooks/user-hook";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useState } from "react";
import { handleError } from "@/helpers/utils";

interface UserFormProps {
  user?: User | null;
  onSave: () => void;
}

export function UserModal({ user, onSave }: UserFormProps) {
  const form = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const isCreating = !user;

  const onSubmit = async (data: UserFormData) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password
      };

      if (isCreating) {
        await UserService.createUser(userData);
        toast.success("Usuário criado com sucesso!");
      } else {
        await UserService.updateUser(user.id, userData);
        toast.success("Usuário atualizado com sucesso!");
      }

      onSave();
    } catch (error: any) {
      handleError("Erro ao salvar o usuário", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* User */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                type="email"
                placeholder="usuario@exemplo.com"
                {...field}
                />
              </FormControl>
              <FormMessage />
              </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input
                type="password"
                placeholder="Digite a senha"
                required
                {...field}
                />
              </FormControl>
              <FormMessage />
              </FormItem>
            )}
            />

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? "Salvando..."
                : isCreating
                ? "Atualizar Pedido"
                : "Criar Pedido"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
