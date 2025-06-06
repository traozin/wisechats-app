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
import { SheetClose } from "@/components/ui/sheet";

interface UserFormProps {
  user?: User | null;
  onSave: () => void;
}

export function UserEditModal({ user, onSave }: UserFormProps) {
  const form = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const isCreating = !user;

  const onSubmit = async (data: UserFormData) => {
    try {
      const userData = {
        name: data.name,
        email: data.email,
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
      console.error("Erro ao salvar o usuário:", error);

      if (error.response && error.response.data) {
        const apiError = error.response.data;

        toast.error(apiError.error || "Erro desconhecido ao salvar o usuário.");
      } else {
        toast.error("Erro inesperado. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          {/* Ações */}
          <div className="flex gap-3 justify-end">
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </SheetClose>
            <Button type="submit" disabled={isLoading}>
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
