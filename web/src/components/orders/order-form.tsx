import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { OrderFormData, orderSchema, OrderService } from "@/hooks/order-hooks";
import { Order, Product } from "@/types/order";
import { Customer } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { handleError } from "@/helpers/utils";
import { toast } from "react-toastify";

interface OrderModalProps {
  order?: Order | null;
  onSave: () => void;
}

export function OrderModal({ order, onSave }: OrderModalProps) {
    const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      user_id: order?.user_id || "",
      items: order?.items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })) || [{ product_id: 0, quantity: 1 }],
    },
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [productOpens, setProductOpens] = useState<{ [key: number]: boolean }>(
    {}
  );

  const [isLoading, setIsLoading] = useState(false);
  const isCreating = !order;

  const onSubmit = async (data: OrderFormData) => {
    try {
      const orders = {
        user_id: data.user_id,
        items: data.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      if (isCreating) {
        OrderService.createOrder(orders);
        toast.success("Pedido criado com sucesso!");
      } else {
        OrderService.updateOrder(order.id, orders);
        toast.success("Pedido atualizado com sucesso!");
      }

      onSave();
    } catch (error) {
      handleError("Erro ao atualizar pedido", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([
          OrderService.getCustomers(),
          OrderService.getProducts(),
        ]);
        setCustomers(customersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    loadData();
  }, []);

  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [...currentItems, { product_id: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    const newItems = currentItems.filter((_, i) => i !== index);
    form.setValue("items", newItems);
  };

  const toggleProductOpen = (index: number) => {
    setProductOpens((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="user_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Cliente</FormLabel>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}>
                        {field.value
                          ? customers.find(
                              (customer) => customer.id === field.value
                            )?.name
                          : "Selecione um cliente"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar cliente..." />
                      <CommandList>
                        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                        <CommandGroup>
                          {customers.map((customer) => (
                            <CommandItem
                              value={customer.name}
                              key={customer.id}
                              onSelect={() => {
                                form.setValue("user_id", customer.id);
                                setCustomerOpen(false);
                              }}>
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  customer.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div>
                                <div className="font-medium">
                                  {customer.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {customer.email}
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Items do Pedido</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}>
                Adicionar Item
              </Button>
            </div>

            {form.watch("items").map((_, index) => (
              <div key={index} className="space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}>
                    Remover
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`items.${index}.product_id`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Produto</FormLabel>
                      <Popover
                        open={productOpens[index]}
                        onOpenChange={() => toggleProductOpen(index)}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}>
                              {field.value
                                ? products.find(
                                    (product) => product.id === field.value
                                  )?.name
                                : "Selecione um produto"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Buscar produto..." />
                            <CommandList>
                              <CommandEmpty>
                                Nenhum produto encontrado.
                              </CommandEmpty>
                              <CommandGroup>
                                {products
                                  .filter((product) => product.stock > 0)
                                  .map((product) => (
                                    <CommandItem
                                      value={product.name}
                                      key={product.id}
                                      onSelect={() => {
                                        form.setValue(
                                          `items.${index}.product_id`,
                                          product.id
                                        );
                                        toggleProductOpen(index);
                                      }}>
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          product.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          {product.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                          {product.price.toLocaleString(
                                            "pt-BR",
                                            {
                                              style: "currency",
                                              currency: "BRL",
                                            }
                                          )}{" "}
                                          - Estoque: {product.stock}
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? isCreating
                  ? "Criando..."
                  : "Salvando..."
                : isCreating
                ? "Criar Pedido"
                : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
