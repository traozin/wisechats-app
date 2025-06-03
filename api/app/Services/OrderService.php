<?php

namespace App\Services;

use App\Data\OrderData;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Exception;

class OrderService {

    public function listOrders(): \Illuminate\Database\Eloquent\Collection {
        return Order::with('items.product')->get();
    }

    public function createOrder(OrderData $data): Order {
        DB::beginTransaction();

        try {
            $order = Order::create([
                'user_id' => $data->user_id,
            ]);

            $productIds = collect($data->items)->pluck('product_id')->all();
            $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

            $orderItems = [];
            $total = 0;

            foreach ($data->items as $item) {
                if (!isset($products[$item->product_id])) {
                    throw new Exception("Produto não encontrado: {$item->product_id}");
                }

                $product = $products[$item->product_id];
                $subtotal = $product->price * $item->quantity;
                $total += $subtotal;

                $orderItems[] = [
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                    'unit_price' => $product->price,
                ];
            }

            OrderItem::insert($orderItems);

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
            $order = Order::findOrFail($id);
            $order->items()->delete();

            $total = 0;

            foreach ($data->items as $item) {
                $product = Product::findOrFail($item->product_id);
                $subtotal = $product->price * $item->quantity;
                $total += $subtotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                    'unit_price' => $product->price,
                ]);
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

            $order->items()->delete();
            $result = $order->delete();

            DB::commit();

            return $result;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
