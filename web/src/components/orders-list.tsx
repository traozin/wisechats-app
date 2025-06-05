"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useState, useEffect } from "react";
import { EditIcon, EyeIcon, PackageIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { Orders } from "@/types/order";
import Cookie from "js-cookie";
import { OrderForm } from "@/components/order-form";

export function OrdersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
  const [orders, setOrders] = useState<Orders[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState<Orders | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<Orders[]>("/orders", {
        headers: {
          Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrder = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditOrder = (order: Orders) => {
    setOrderToEdit(order);
    setIsEditModalOpen(true);
  };

  const handleOrderSaved = () => {
    fetchOrders();
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setOrderToEdit(null);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.user_id).toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
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
              {Number(totalRevenue).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Pedidos</CardTitle>
            <CardDescription>
              Gerencie todos os pedidos da sua loja
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar pedidos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleCreateOrder} className="gap-2">
              <PlusIcon className="h-4 w-4" />
              Novo Pedido
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-10"></TableHead>
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
                              <div className="font-medium">{order.user_id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(order.created_at, "dd/MM/yyyy")}
                          </TableCell>
                          <TableCell>
                            {order.items.length}{" "}
                            {order.items.length > 1 ? "itens" : "item"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {Number(order.total).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setSelectedOrder(order)}>
                                  <EyeIcon className="h-4 w-4" />
                                  <span className="sr-only">Ver detalhes</span>
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-full sm:max-w-lg">
                                <SheetHeader>
                                  <SheetTitle>Detalhes do Pedido</SheetTitle>
                                  <SheetDescription>
                                    Informações completas do pedido {order.id}
                                  </SheetDescription>
                                </SheetHeader>

                                {selectedOrder && (
                                  <div className="space-y-6 py-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">
                                        Cliente
                                      </Label>
                                      <div className="space-y-1">
                                        <p className="text-sm">
                                          {selectedOrder.user_id}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">
                                        Produtos
                                      </Label>
                                      <div className="space-y-2">
                                        {selectedOrder.items.map(
                                          (item, index) => (
                                            <div
                                              key={index}
                                              className="flex justify-between text-sm">
                                              <span>
                                                {item.quantity}x{" "}
                                                {item.product.name}
                                              </span>
                                              <span>
                                                {item.unit_price.toLocaleString(
                                                  "pt-BR",
                                                  {
                                                    style: "currency",
                                                    currency: "BRL",
                                                  }
                                                )}
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">
                                        Resumo
                                      </Label>
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                          <span>Data do pedido:</span>
                                          <span>
                                            {format(
                                              selectedOrder.created_at,
                                              "dd/MM/yyyy"
                                            )}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span>Total de items:</span>
                                          <span>
                                            {selectedOrder.items.length}
                                          </span>
                                        </div>
                                        <div className="flex justify-between text-sm font-medium">
                                          <span>Total:</span>
                                          <span>
                                            {Number(
                                              selectedOrder.total
                                            ).toLocaleString("pt-BR", {
                                              style: "currency",
                                              currency: "BRL",
                                            })}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <SheetFooter>
                                  <SheetClose asChild>
                                    <Button variant="outline">Fechar</Button>
                                  </SheetClose>
                                </SheetFooter>
                              </SheetContent>
                            </Sheet>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditOrder(order)}>
                              <EditIcon className="h-4 w-4" />
                              <span className="sr-only">Editar pedido</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal de Criar Pedido */}
      <Sheet open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Novo Pedido</SheetTitle>
            <SheetDescription>
              Preencha os dados para criar um novo pedido
            </SheetDescription>
          </SheetHeader>
          <OrderForm
            onSave={handleOrderSaved}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Modal de Editar Pedido */}
      <Sheet open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Editar Pedido</SheetTitle>
            <SheetDescription>
              Edite as informações do pedido {orderToEdit?.id}
            </SheetDescription>
          </SheetHeader>
          <OrderForm
            order={orderToEdit}
            onSave={handleOrderSaved}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
