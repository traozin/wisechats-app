<?php

namespace App\Http\Controllers\Api;

use App\Models\Order;
use App\Models\OrderItem;

use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controller;

use App\Data\OrderData;
use App\Models\Product;

class OrderController extends Controller {
    public function index() {
        return Order::with('items.product')->get();
    }

    public function store(OrderData $data) {
        return DB::transaction(function () use ($data) {
            $order = Order::create([
                'user_id' => $data->user_id,
            ]);

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

            return response()->json($order->load('items.product'), 201);
        });
    }

    public function update(OrderData $data, $id) {
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

        return response()->json($order->load('items.product'));
    }


    public function destroy($id) {
        $order = Order::findOrFail($id);
        $order->items()->delete();
        $order->delete();

        return response()->json(['message' => 'Pedido deletado com sucesso.']);
    }
}