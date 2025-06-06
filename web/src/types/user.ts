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

export const statusConfig = {
  pending: {
    label: "Pendente",
    icon: ClockIcon,
    variant: "secondary" as const,
    color: "text-yellow-600",
  },
  processing: {
    label: "Processando",
    icon: PackageIcon,
    variant: "default" as const,
    color: "text-blue-600",
  },
  shipped: {
    label: "Enviado",
    icon: TruckIcon,
    variant: "outline" as const,
    color: "text-purple-600",
  },
  delivered: {
    label: "Entregue",
    icon: CheckCircle2Icon,
    variant: "default" as const,
    color: "text-green-600",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircleIcon,
    variant: "destructive" as const,
    color: "text-red-600",
  },
}

