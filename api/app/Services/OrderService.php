<?php

namespace App\Services;

use App\Data\OrderData;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Spatie\LaravelData\DataCollection;
use Illuminate\Database\Eloquent\Collection;

use Exception;

class OrderService {

    public function listOrders(): Collection {
        return Order::with('items.product')->get();
    }

    public function createOrder(OrderData $data): Order {
        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $data->user_id,
            ]);

            [$orderItems, $total] = $this->processNewItems($data->items, $order);

            foreach ($orderItems as $itemData) {
                OrderItem::create($itemData);
            }

            $order->total = $total;
            $order->save();

            DB::commit();

            return $order->load('items.product');
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function updateOrder(OrderData $data, int $id): Order {
        DB::beginTransaction();

        try {
            $order = Order::with('items')->findOrFail($id);

            $this->restoreStockFromOldItems($order);

            $order->items()->delete();

            [$orderItems, $total] = $this->processNewItems($data->items, $order);

            foreach ($orderItems as $itemData) {
                OrderItem::create($itemData);
            }

            $order->total = $total;
            $order->save();

            DB::commit();

            return $order->load('items.product');
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function deleteOrder(int $id): bool {
        DB::beginTransaction();

        try {
            $order = Order::find($id);

            if (!$order) {
                throw new Exception("Pedido não encontrado: {$id}");
            }

            foreach ($order->items as $item) {
                $item->delete();
            }

            $result = $order->delete();

            DB::commit();

            return $result;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Verifica estoque, decrementa stock do produto, calcula subtotais e
     * monta o array de dados para inserir em order_items.
     *
     * @param DataCollection $itemsData  Coleção de OrderItemData
     * @param Order $order                          Instância do pedido (já criada ou existente)
     * @return array{0: array<int, array<string, mixed>>, 1: float}  Array com [dadosParaInsert, totalCalculado]
     * @throws Exception                                Se algum produto não existir ou falta de estoque
     */
    private function processNewItems($itemsData, Order $order): array {
        $productIds = collect($itemsData)->pluck('product_id')->all();
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        $orderItems = [];
        $total = 0;

        foreach ($itemsData as $item) {
            if (!isset($products[$item->product_id])) {
                throw new Exception("Produto não encontrado: {$item->product_id}");
            }

            $product = $products[$item->product_id];

            if ($product->stock < $item->quantity) {
                throw new Exception(
                    "Estoque insuficiente para o produto ID {$product->id}. " .
                    "Disponível: {$product->stock}, solicitado: {$item->quantity}."
                );
            }

            $subtotal = $product->price * $item->quantity;
            $total += $subtotal;

            $orderItems[] = [
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $item->quantity,
                'unit_price' => $product->price,
                'subtotal' => $subtotal,
            ];

        }

        return [$orderItems, $total];
    }

    /**
     * Restaura o estoque dos produtos com base nos itens atuais de um pedido.
     *
     * @param Order $order  Pedido cujos itens precisam ter o estoque devolvido.
     * @return void
     */
    private function restoreStockFromOldItems(Order $order): void {
        foreach ($order->items as $oldItem) {
            $oldProduct = Product::find($oldItem->product_id);
            if ($oldProduct) {
                $oldProduct->stock += $oldItem->quantity;
                $oldProduct->save();
            }
        }
    }
}
