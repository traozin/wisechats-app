import { api, authHeader } from "@/lib/api";
import { Product } from "@/types/order";
import z from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  price: z.number().min(0.01, "Preço deve ser maior que zero"),
  stock: z.number().int().min(0, "Estoque deve ser um número inteiro não negativo"),
})

export type ProductFormData = z.infer<typeof productSchema>

export const ProductService = {
    async getProducts(): Promise<Product[]> {
        const { data } = await api.get<Product[]>("/products", {
            headers: authHeader(),
        });
        return data;
    },

    async createProduct(data: ProductFormData): Promise<Product> {
        const { data: product } = await api.post<Product>("/products", data, {
            headers: authHeader(),
        });
        return product;
    },

    async updateProduct(productId: string, data: ProductFormData): Promise<Product> {
        const { data: product } = await api.put<Product>(`/products/${productId}`, data, {
            headers: authHeader(),
        });
        return product;
    },

    async deleteProduct(productId: string): Promise<void> {
        await api.delete(`/products/${productId}`, {
            headers: authHeader(),
        });
    },
};
