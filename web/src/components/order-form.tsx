"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { PlusIcon, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/lib/api";
import type { Orders, Product } from "@/types/order";
import { User } from "@/types/user";
import Cookie from "js-cookie";
import { useEffect, useState } from "react";

interface OrderFormProps {
  order?: Orders | null;
  onSave: () => void;
  onCancel: () => void;
}

type OrderFormData = {
  user_id: string;
  items: {
    product_id: string;
    quantity: number;
    unit_price: number;
  }[];
};

export function OrderForm({ order, onSave, onCancel }: OrderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!order;

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await api.get("/products", {
          headers: {
            Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
          },
        });
        setProducts(productsRes.data as Product[]);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }

      try {
        const usersRes = await api.get("/users", {
          headers: {
            Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
          },
        });
        setUsers(usersRes.data as User[]);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchData();
  }, []);

  const form = useForm<OrderFormData>({
    defaultValues: {
      user_id: order?.user_id || "",
      items: order?.items?.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })) || [{ product_id: "", quantity: 1, unit_price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (data: OrderFormData) => {
    setIsLoading(true);
    try {
      const orderData = {
        user_id: data.user_id,
        items: data.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
      };

      if (isEditing) {
        await api.put(`/orders/${order.id}`, orderData, {
          headers: {
            Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
          },
        });
      } else {
        await api.post("/orders", orderData, {
          headers: {
            Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
          },
        });
      }

      onSave();
    } catch (error) {
      console.error("Erro ao salvar pedido:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    append({ product_id: "", quantity: 1, unit_price: 0 });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.unit_price`, product.price);
    }
  };

  const calculateTotal = () => {
    const items = form.watch("items");
    return items.reduce(
      (total, item) => total + item.quantity * item.unit_price,
      0
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Cliente */}
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Cliente
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Itens do Pedido */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Itens do Pedido</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="flex items-center gap-1">
                <PlusIcon className="h-4 w-4" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="border border-gray-200">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Item {index + 1}
                      </CardTitle>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(index)}
                          className="text-red-500 hover:bg-red-50">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.product_id`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Produto</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                handleProductChange(index, value);
                              }}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem
                                    key={product.id}
                                    value={product.id}>
                                    {product.name} -{" "}
                                    {product.price.toLocaleString("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    })}
                                    {` (${product.stock} em estoque)`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantidade</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-full"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.unit_price`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preço Unitário</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-full"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold text-green-600">
              {calculateTotal().toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>

          {/* Ações */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Salvando..."
                : isEditing
                ? "Atualizar Pedido"
                : "Criar Pedido"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
