"use client";

import {
  CheckCircle2Icon,
  ClockIcon,
  EditIcon,
  EyeIcon,
  FilterIcon,
  PlusIcon,
  SearchIcon,
  ShoppingCartIcon,
  TrashIcon,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer, statusConfig } from "@/types/user";
import { Order } from "@/types/order";
import { toast } from "react-toastify";
import { OrderFormData, OrderService } from "@/hooks/order-hooks";
import { OrderViewModal } from "@/components/orders/order-view";
import { useEffect, useState } from "react";
import { OrderModal } from "@/components/orders/order-form";

export function OrdersList() {
  const [ordersData, setOrdersData] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [orders, customersData] = await Promise.all([
          OrderService.getOrders(),
          OrderService.getCustomers(),
        ]);

        const customerMap = customersData.reduce<Record<string, Customer>>(
          (acc, customer) => {
            acc[customer.id] = customer;
            return acc;
          },
          {}
        );

        const ordersWithCustomerInfo = orders.map((order) => {
          const customer = customerMap[order.user_id];
          return {
            ...order,
            customer_name: customer?.name ?? "",
            customer_email: customer?.email ?? "",
          };
        });

        setOrdersData(ordersWithCustomerInfo);
        setCustomers(customersData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados");
      }
    };

    loadData();
  }, []);

  const handleSaveOrder = async (orderId: string, data: OrderFormData) => {
    setIsLoading(true);

    try {
      await OrderService.updateOrder(orderId, data);

      const updatedOrders = ordersData.map((order) => {
        if (order.id === orderId) {
          const customer = customers.find((c) => c.id === data.customer_id);
          return {
            ...order,
            user_id: data.customer_id,
            customer_name: customer?.name || order.customer_name,
            customer_email: customer?.email || order.customer_email,
            updated_at: new Date(),
          };
        }
        return order;
      });

      setOrdersData(updatedOrders);
      toast.success("Pedido atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar pedido:", error);
      toast.error("Erro ao atualizar pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrder = async (data: OrderFormData) => {
    setIsLoading(true);

    try {
      const newOrder = await OrderService.createOrder(data);

      setOrdersData([...ordersData, newOrder]);

      toast.success("Pedido criado com sucesso!");
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      toast.error("Erro ao criar pedido. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setIsDeleting(orderId);

    try {
      await OrderService.deleteOrder(orderId);

      const updatedOrders = ordersData.filter((order) => order.id !== orderId);
      setOrdersData(updatedOrders);

      toast.success("Pedido excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar pedido:", error);
      toast.error("Erro ao excluir pedido. Tente novamente.");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      (order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);

    return matchesSearch;
  });

  const totalOrders = ordersData.length;
  const totalRevenue = ordersData.reduce(
    (sum, order) => sum + Number(order.total),
    0
  );

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
            <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <div className="text-lg">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>
            Gerencie todos os pedidos da sua loja
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <div className="relative flex-1 sm:max-w-sm">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar pedidos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Sheet
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}>
                <SheetTrigger asChild>
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Adicionar Pedido
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Criar Novo Pedido</SheetTitle>
                    <SheetDescription>
                      Preencha as informações para criar um novo pedido
                    </SheetDescription>
                  </SheetHeader>

                  <OrderModal
                    onSave={handleCreateOrder}
                    isLoading={isLoading}
                    isCreating={true}
                  />

                  <SheetFooter className="gap-2">
                    <SheetClose asChild>
                      <Button variant="outline" disabled={isLoading}>
                        Cancelar
                      </Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.customer_name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {order.customer_email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.items.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}{" "}
                          items
                        </TableCell>
                        <TableCell>
                          {format(order.created_at, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {order.total.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {/* Modal de Visualização */}
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <EyeIcon className="h-4 w-4" />
                                  <span className="sr-only">Ver detalhes</span>
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                                <SheetHeader>
                                  <SheetTitle>Detalhes do Pedido</SheetTitle>
                                  <SheetDescription>
                                    Informações completas do pedido {order.id}
                                  </SheetDescription>
                                </SheetHeader>

                                <OrderViewModal order={order} />

                                <SheetFooter>
                                  <SheetClose asChild>
                                    <Button variant="outline">Fechar</Button>
                                  </SheetClose>
                                </SheetFooter>
                              </SheetContent>
                            </Sheet>

                            {/* Modal de Edição */}
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <EditIcon className="h-4 w-4" />
                                  <span className="sr-only">Editar pedido</span>
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                                <SheetHeader>
                                  <SheetTitle>Editar Pedido</SheetTitle>
                                  <SheetDescription>
                                    Editando informações do pedido {order.id}
                                  </SheetDescription>
                                </SheetHeader>

                                <OrderModal
                                  order={order}
                                  onSave={(data) =>
                                    handleSaveOrder(order.id, data)
                                  }
                                  isLoading={isLoading}
                                />

                                <SheetFooter className="gap-2">
                                  <SheetClose asChild>
                                    <Button
                                      variant="outline"
                                      disabled={isLoading}>
                                      Cancelar
                                    </Button>
                                  </SheetClose>
                                </SheetFooter>
                              </SheetContent>
                            </Sheet>

                            {/* Modal de Confirmação de Exclusão */}
                            <Sheet
                              open={!!orderToDelete}
                              onOpenChange={() => setOrderToDelete(null)}>
                              <SheetTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  disabled={isDeleting === order.id}
                                  onClick={() => setOrderToDelete(order)}>
                                  <TrashIcon className="h-4 w-4" />
                                  <span className="sr-only">
                                    Excluir pedido
                                  </span>
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-full sm:max-w-md">
                                <SheetHeader>
                                  <SheetTitle>Confirmar Exclusão</SheetTitle>
                                  <SheetDescription>
                                    Tem certeza que deseja excluir este pedido?
                                  </SheetDescription>
                                </SheetHeader>

                                {orderToDelete && (
                                  <div className="py-4 space-y-4">
                                    <div className="p-4 bg-muted rounded-lg">
                                      <div className="space-y-2">
                                        <p>
                                          <strong>Pedido:</strong>{" "}
                                          {orderToDelete.id}
                                        </p>
                                        <p>
                                          <strong>Cliente:</strong>{" "}
                                          {orderToDelete.customer_name}
                                        </p>
                                        <p>
                                          <strong>Total:</strong>{" "}
                                          {orderToDelete.total.toLocaleString(
                                            "pt-BR",
                                            {
                                              style: "currency",
                                              currency: "BRL",
                                            }
                                          )}
                                        </p>
                                      </div>
                                    </div>

                                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                      <p className="text-sm text-destructive">
                                        ⚠️ Esta ação não pode ser desfeita. O
                                        pedido será removido permanentemente do
                                        sistema.
                                      </p>
                                    </div>
                                  </div>
                                )}

                                <SheetFooter className="gap-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setOrderToDelete(null)}
                                    disabled={isDeleting === orderToDelete?.id}>
                                    Cancelar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      if (orderToDelete) {
                                        handleDeleteOrder(orderToDelete.id);
                                        setOrderToDelete(null);
                                      }
                                    }}
                                    disabled={isDeleting === orderToDelete?.id}>
                                    {isDeleting === orderToDelete?.id
                                      ? "Excluindo..."
                                      : "Excluir Pedido"}
                                  </Button>
                                </SheetFooter>
                              </SheetContent>
                            </Sheet>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
