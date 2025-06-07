import { User } from "@/types/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@radix-ui/react-label";
import { format } from "date-fns";

export function UserViewModal({ user }: { user: User }) {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={"/placeholder.svg"} alt={user.name} />
          <AvatarFallback>
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Data de Entrada</Label>
          <p className="text-sm">
            {format(new Date(user.created_at), "dd/MM/yyyy")}
          </p>
        </div>
      </div>
    </div>
  );
}