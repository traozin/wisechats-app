import { Order } from "@/types/order"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"

export function OrderViewModal({ order }: { order: Order }) {

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Status</Label>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Cliente</Label>
          <div className="space-y-1">
            <p className="text-sm font-semibold">{order.customer_name}</p>
            <p className="text-sm text-muted-foreground">{order.customer_email}</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Items do Pedido</Label>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">{item.product.description}</p>
                  <p className="text-sm">
                    Quantidade: {item.quantity} x{" "}
                    {item.unit_price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {item.subtotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Resumo</Label>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Data do pedido:</span>
              <span>{format(order.created_at, "dd/MM/yyyy 'às' HH:mm")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total de items:</span>
              <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>
                {order.total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
