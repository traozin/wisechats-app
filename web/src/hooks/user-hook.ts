import { api, authHeader } from "@/lib/api";
import z from "zod";
import { User, UserData } from "@/types/user";

export const editUserSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").nonempty("Senha é obrigatória"),
});

export type UserFormData = z.infer<typeof editUserSchema>;

export const UserService = {
  async getUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>("/users", {
      headers: authHeader(),
    });
    return data;
  },

  async updateUser(userId: string, data: UserFormData): Promise<User> {
    const { data: updatedUser } = await api.put<User>(
      `/users/${userId}`,
      data,
      {
        headers: authHeader(),
      }
    );
    return updatedUser;
  },

  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`, {
      headers: authHeader(),
    });
  },

  async createUser(data: UserFormData): Promise<User> {
    const { data: newUser } = await api.post<User>("/users", data, {
      headers: authHeader(),
    });
    return newUser;
  },

  async getMe(): Promise<UserData> {
    const { data } = await api.get<UserData>("/me", {
      headers: authHeader(),
    });
    return data;
  }
};
