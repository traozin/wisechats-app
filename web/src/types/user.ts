import { CheckCircle2Icon, ClockIcon, PackageIcon, TruckIcon, XCircleIcon } from "lucide-react";

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
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

