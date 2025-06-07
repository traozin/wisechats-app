import { toast } from "react-toastify";

export function handleError(message: string,error: any): void{
  console.error(message, error);

  const errorMsg =
    error.response?.data?.error ||
    error.message ||
    "Erro inesperado. Tente novamente mais tarde.";

  toast.error(errorMsg);
}
