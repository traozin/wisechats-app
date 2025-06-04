"use client"

import * as React from "react"
import {
  CheckCircle2Icon,
  ClockIcon,
  EyeIcon,
  FilterIcon,
  PackageIcon,
  SearchIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data para pedidos
const ordersData = [
  {
    id: "ORD-001",
    customer: "João Silva",
    email: "joao@email.com",
    status: "delivered",
    total: 299.99,
    items: 3,
    date: new Date("2024-01-15"),
    address: "Rua das Flores, 123 - São Paulo, SP",
    phone: "(11) 99999-9999",
    products: [
      { name: "Produto A", quantity: 2, price: 99.99 },
      { name: "Produto B", quantity: 1, price: 100.01 },
    ],
  },
  {
    id: "ORD-002",
    customer: "Maria Santos",
    email: "maria@email.com",
    status: "processing",
    total: 159.5,
    items: 2,
    date: new Date("2024-01-14"),
    address: "Av. Paulista, 456 - São Paulo, SP",
    phone: "(11) 88888-8888",
    products: [
      { name: "Produto C", quantity: 1, price: 79.75 },
      { name: "Produto D", quantity: 1, price: 79.75 },
    ],
  },
  {
    id: "ORD-003",
    customer: "Pedro Costa",
    email: "pedro@email.com",
    status: "shipped",
    total: 89.9,
    items: 1,
    date: new Date("2024-01-13"),
    address: "Rua do Comércio, 789 - Rio de Janeiro, RJ",
    phone: "(21) 77777-7777",
    products: [{ name: "Produto E", quantity: 1, price: 89.9 }],
  },
  {
    id: "ORD-004",
    customer: "Ana Oliveira",
    email: "ana@email.com",
    status: "cancelled",
    total: 199.99,
    items: 2,
    date: new Date("2024-01-12"),
    address: "Rua das Palmeiras, 321 - Belo Horizonte, MG",
    phone: "(31) 66666-6666",
    products: [{ name: "Produto F", quantity: 2, price: 99.99 }],
  },
  {
    id: "ORD-005",
    customer: "Carlos Ferreira",
    email: "carlos@email.com",
    status: "pending",
    total: 449.99,
    items: 4,
    date: new Date("2024-01-11"),
    address: "Av. Brasil, 654 - Brasília, DF",
    phone: "(61) 55555-5555",
    products: [
      { name: "Produto G", quantity: 2, price: 149.99 },
      { name: "Produto H", quantity: 2, price: 75.0 },
    ],
  },
]

const statusConfig = {
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

export function OrdersList() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [selectedOrder, setSelectedOrder] = React.useState<(typeof ordersData)[0] | null>(null)

  const filteredOrders = ordersData.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalOrders = ordersData.length
  const totalRevenue = ordersData.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = ordersData.filter((order) => order.status === "pending").length
  const deliveredOrders = ordersData.filter((order) => order.status === "delivered").length

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
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
            <p className="text-xs text-muted-foreground">+8% em relação ao mês passado</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Requer atenção</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Entregues</CardTitle>
            <CheckCircle2Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders}</div>
            <p className="text-xs text-muted-foreground">Taxa de entrega: 95%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
          <CardDescription>Gerencie todos os pedidos da sua loja</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="processing">Processando</TabsTrigger>
                <TabsTrigger value="shipped">Enviados</TabsTrigger>
                <TabsTrigger value="delivered">Entregues</TabsTrigger>
              </TabsList>

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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => {
                      const status = statusConfig[order.status as keyof typeof statusConfig]
                      const StatusIcon = status.icon

                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer}</div>
                              <div className="text-sm text-muted-foreground">{order.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant} className="gap-1">
                              <StatusIcon className="h-3 w-3" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(order.date, "dd/MM/yyyy")}</TableCell>
                          <TableCell>{order.items} items</TableCell>
                          <TableCell className="text-right font-medium">
                            {order.total.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </TableCell>
                          <TableCell>
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                  <EyeIcon className="h-4 w-4" />
                                  <span className="sr-only">Ver detalhes</span>
                                </Button>
                              </SheetTrigger>
                              <SheetContent className="w-full sm:max-w-lg">
                                <SheetHeader>
                                  <SheetTitle>Detalhes do Pedido</SheetTitle>
                                  <SheetDescription>Informações completas do pedido {order.id}</SheetDescription>
                                </SheetHeader>

                                {selectedOrder && (
                                  <div className="space-y-6 py-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Status</Label>
                                      <Badge variant={status.variant} className="gap-1">
                                        <StatusIcon className="h-3 w-3" />
                                        {status.label}
                                      </Badge>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Cliente</Label>
                                      <div className="space-y-1">
                                        <p className="text-sm">{selectedOrder.customer}</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                                        <p className="text-sm text-muted-foreground">{selectedOrder.phone}</p>
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Endereço de Entrega</Label>
                                      <p className="text-sm">{selectedOrder.address}</p>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Produtos</Label>
                                      <div className="space-y-2">
                                        {selectedOrder.products.map((product, index) => (
                                          <div key={index} className="flex justify-between text-sm">
                                            <span>
                                              {product.quantity}x {product.name}
                                            </span>
                                            <span>
                                              {product.price.toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                              })}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">Resumo</Label>
                                      <div className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                          <span>Data do pedido:</span>
                                          <span>{format(selectedOrder.date, "dd/MM/yyyy")}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                          <span>Total de items:</span>
                                          <span>{selectedOrder.items}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-medium">
                                          <span>Total:</span>
                                          <span>
                                            {selectedOrder.total.toLocaleString("pt-BR", {
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
                                  <Button>Atualizar Status</Button>
                                </SheetFooter>
                              </SheetContent>
                            </Sheet>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
