export interface User {
    id: string;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export interface UserData {
    data: {
    user: Partial<User>;
    token: string;
  }
}