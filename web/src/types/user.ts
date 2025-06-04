export interface User {
    id: string;
    govId: string;
    email: string;
    cpf: string;
    role: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    processId: string | null;
}

export interface UserData {
    data: {
    user: Partial<User>;
    token: string;
  }
}