export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserData {
    data: {
    user: Partial<User>;
    token: string;
  }
}