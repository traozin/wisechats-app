"use client";
import {
  EditIcon,
  EyeIcon,
  FilterIcon,
  PackageIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
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
import { toast } from "react-toastify";
import { Product } from "@/types/order";
import { ProductFormData, ProductService } from "@/hooks/product-hook";
import { ProductModal } from "@/components/product/product-form";
import { ProductViewModal } from "./product-view";
import { useEffect, useState } from "react";
import { handleError } from "@/helpers/utils";

export function ProductList() {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await ProductService.getProducts();
        setProductsData(products);
      } catch (error) {
        handleError("Erro ao carregar produtos", error);
      }
    };

    loadProducts();
  }, []);

  
  const handleSaveProduct = async (
    productId: number,
    data: ProductFormData
  ) => {
    setIsLoading(true);

    try {
      
      await ProductService.updateProduct(productId, data);

      
      const updatedProducts = productsData.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            updated_at: new Date(),
          };
        }
        return product;
      });

      setProductsData(updatedProducts);
      toast.success("Produto atualizado com sucesso!");
    } catch (error) {
      handleError("Erro ao atualizar produto", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleCreateProduct = async (data: ProductFormData) => {
    setIsLoading(true);

    try {
      
      const newProduct = await ProductService.createProduct(data);

      
      setProductsData([...productsData, newProduct]);

      toast.success("Produto criado com sucesso!");
      setIsCreateModalOpen(false);
    } catch (error) {
      handleError("Erro ao criar produto", error);
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleDeleteProduct = async (productId: number) => {
    setIsDeleting(true);

    try {
      await ProductService.deleteProduct(productId);

      const updatedProducts = productsData.filter(
        (product) => product.id !== productId
      );

      setProductsData(updatedProducts);

      toast.success("Produto excluído com sucesso!");
    } catch (error) {
      handleError("Erro ao excluir produto", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredProducts = productsData.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "in-stock" && product.stock > 10) ||
      (stockFilter === "low-stock" &&
        product.stock > 0 &&
        product.stock <= 10) ||
      (stockFilter === "out-of-stock" && product.stock === 0);

    return matchesSearch && matchesStock;
  });

  const totalProducts = productsData.length;
  const totalValue = productsData.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );
  const inStockProducts = productsData.filter(
    (product) => product.stock > 0
  ).length;
  const outOfStockProducts = productsData.filter(
    (product) => product.stock === 0
  ).length;

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Produtos
            </CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Total do Estoque
            </CardTitle>
            <div className="text-lg">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalValue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor total em estoque
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos em Estoque
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              {((inStockProducts / totalProducts) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sem Estoque</CardTitle>
            <TrendingDownIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">Requer reposição</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros e busca */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
          <CardDescription>
            Gerencie todos os produtos do seu catálogo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-2">
                <div className="relative flex-1 sm:max-w-sm">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-40">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Estoque" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="in-stock">Em estoque</SelectItem>
                    <SelectItem value="low-stock">Estoque baixo</SelectItem>
                    <SelectItem value="out-of-stock">Sem estoque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Sheet
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}>
                <SheetTrigger asChild>
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Adicionar Produto
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Criar Novo Produto</SheetTitle>
                    <SheetDescription>
                      Preencha as informações para criar um novo produto
                    </SheetDescription>
                  </SheetHeader>

                  <ProductModal
                    onSave={handleCreateProduct}
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
                    <TableHead>Produto</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{product.stock}</span>
                          <span className="text-sm text-muted-foreground">
                            unidades
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.stock > 10
                              ? "default"
                              : product.stock > 0
                              ? "secondary"
                              : "destructive"
                          }>
                          {product.stock > 10
                            ? "Em estoque"
                            : product.stock > 0
                            ? "Estoque baixo"
                            : "Sem estoque"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(product.created_at, "dd/MM/yyyy")}
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
                                <SheetTitle>Detalhes do Produto</SheetTitle>
                                <SheetDescription>
                                  Informações completas do produto
                                </SheetDescription>
                              </SheetHeader>

                              <ProductViewModal product={product} />

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
                                <span className="sr-only">Editar produto</span>
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                              <SheetHeader>
                                <SheetTitle>Editar Produto</SheetTitle>
                                <SheetDescription>
                                  Editando informações do produto
                                </SheetDescription>
                              </SheetHeader>

                              <ProductModal
                                product={product}
                                onSave={(data) =>
                                  handleSaveProduct(product.id, data)
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
                            open={!!productToDelete}>
                            <SheetTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={isDeleting}
                                onClick={() => setProductToDelete(product)}>
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">Excluir produto</span>
                              </Button>
                            </SheetTrigger>
                            <SheetContent className="w-full sm:max-w-md">
                              <SheetHeader>
                                <SheetTitle>Confirmar Exclusão</SheetTitle>
                                <SheetDescription>
                                  Tem certeza que deseja excluir este produto?
                                </SheetDescription>
                              </SheetHeader>

                              {productToDelete && (
                                <div className="py-4 space-y-4">
                                  <div className="p-4 bg-muted rounded-lg">
                                    <div className="space-y-2">
                                      <p>
                                        <strong>Produto:</strong>{" "}
                                        {productToDelete.name}
                                      </p>
                                      <p>
                                        <strong>Preço:</strong>{" "}
                                        {productToDelete.price.toLocaleString(
                                          "pt-BR",
                                          {
                                            style: "currency",
                                            currency: "BRL",
                                          }
                                        )}
                                      </p>
                                      <p>
                                        <strong>Estoque:</strong>{" "}
                                        {productToDelete.stock} unidades
                                      </p>
                                    </div>
                                  </div>

                                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                    <p className="text-sm text-destructive">
                                      ⚠️ Esta ação não pode ser desfeita. O
                                      produto será removido permanentemente do
                                      catálogo.
                                    </p>
                                  </div>
                                </div>
                              )}

                              <SheetFooter className="gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => setProductToDelete(null)}
                                  disabled={isDeleting}>
                                  Cancelar
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    if (productToDelete) {
                                      handleDeleteProduct(productToDelete.id);
                                      setProductToDelete(null);
                                    }
                                  }}
                                  disabled={isDeleting}>
                                  {isDeleting
                                    ? "Excluindo..."
                                    : "Excluir Produto"}
                                </Button>
                              </SheetFooter>
                            </SheetContent>
                          </Sheet>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
