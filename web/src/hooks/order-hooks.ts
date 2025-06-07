import { api, authHeader } from "@/lib/api";
import { Order, Product } from "@/types/order";
import { Customer } from "@/types/user";
import z from "zod";
import { UserService } from "./user-hook";
import { ProductService } from "./product-hook";

export const orderSchema = z.object({
  user_id: z.string().min(1, "Cliente é obrigatório"),
  items: z
    .array(
      z.object({
        product_id: z.number().min(1, "Produto é obrigatório"),
        quantity: z.number().min(1, "Quantidade deve ser pelo menos 1"),
      })
    )
    .min(1, "Deve ter pelo menos um item"),
});

export type OrderFormData = z.infer<typeof orderSchema>;

export const OrderService = {
  async getOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>("/orders", {
      headers: authHeader(),
    });
    return data;
  },

  async createOrder(data: OrderFormData): Promise<Order> {
    const response = await api.post<Order>("/orders", data, {
      headers: authHeader(),
    });
    return response.data;
  },

  async updateOrder(orderId: string, data: OrderFormData): Promise<Order> {
    const response = await api.put<Order>(`/orders/${orderId}`, data, {
      headers: authHeader(),
    });
    return response.data;
  },

  async deleteOrder(orderId: string): Promise<void> {
    await api.delete(`/orders/${orderId}`, {
      headers: authHeader(),
    });
  },

  async getCustomers(): Promise<Customer[]> {
    return UserService.getUsers();
  },

  async getProducts(): Promise<Product[]> {
    return ProductService.getProducts();
  },
};
