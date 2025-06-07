import { Product } from "@/types/order";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export function ProductViewModal({ product }: { product: Product }) {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Nome do Produto</Label>
          <p className="text-sm font-semibold">{product.name}</p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Descrição</Label>
          <p className="text-sm text-muted-foreground">{product.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Preço</Label>
            <p className="text-lg font-bold text-green-600">
              {product.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Estoque</Label>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">{product.stock} unidades</p>
              <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                {product.stock > 10 ? "Em estoque" : product.stock > 0 ? "Estoque baixo" : "Sem estoque"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Data de Criação</Label>
            <p className="text-sm">{format(product.created_at, "dd/MM/yyyy 'às' HH:mm")}</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Última Atualização</Label>
            <p className="text-sm">{format(product.updated_at, "dd/MM/yyyy 'às' HH:mm")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}