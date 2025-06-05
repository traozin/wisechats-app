"use client";

import React, { useState, useCallback, useEffect } from "react";
import { EyeIcon, PackageIcon, SearchIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { Orders } from "@/types/orders";
import Cookie from "js-cookie";

export function OrdersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
  const [orders, setOrders] = useState<Orders[]>([]);

  const fetchOrders = useCallback(async () => {
    try {
      const { data } = await api.get<Orders[]>("/orders", {
        headers: {
          Authorization: `Bearer ${Cookie.get("jwt-wisecharts")}`,
        },
      });
      setOrders(data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

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
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
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
            <p className="text-xs text-muted-foreground">
              +8% em relação ao mês passado
            </p>
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
          <div className="relative flex-1 max-w-xs">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
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
                          <TableCell>{order.items.length} items</TableCell>
                          <TableCell className="text-right font-medium">
                            {order.total.toLocaleString("pt-BR", {
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
                                            {selectedOrder.total.toLocaleString(
                                              "pt-BR",
                                              {
                                                style: "currency",
                                                currency: "BRL",
                                              }
                                            )}
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
                                  <Button>Atualizar Status</Button>
                                </SheetFooter>
                              </SheetContent>
                            </Sheet>
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
    </div>
  );
}
