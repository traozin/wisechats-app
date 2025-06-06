import { api } from "@/lib/api";
import z from "zod";
import Cookie from "js-cookie";
import { User } from "@/types/user";

export const editUserSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
});

export type UserFormData = z.infer<typeof editUserSchema>;

export const UserService = {
    async getUsers(): Promise<User[]> {
        const { data } = await api.get<User[]>("/users", {
            headers: {
                Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
            },
        });
        return data;
    },

    async updateUser(userId: string, data: UserFormData): Promise<User> {
        const { data: updatedUser } = await api.put<User>(
            `/users/${userId}`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
                },
            }
        );
        return updatedUser;
    },

    async deleteUser(userId: string): Promise<void> {
        await api.delete(`/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
            },
        });
    },

    async createUser(data: UserFormData): Promise<User> {
        const { data: newUser } = await api.post<User>("/users", data, {
            headers: {
                Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
            },
        });
        return newUser;
    },
};
