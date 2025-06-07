<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder {
    public function run(): void {
        $userIds = DB::table('users')->pluck('id')->toArray(); // uuid
        $productIds = range(1, 30);

        for ($i = 0; $i < 15; $i++) {
            $userId = $userIds[array_rand($userIds)];

            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $userId,
                'total' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $itemsCount = rand(1, 3);
            $total = 0;

            for ($j = 0; $j < $itemsCount; $j++) {
                $productId = $productIds[array_rand($productIds)];
                $product = DB::table('products')->find($productId);

                if (!$product)
                    continue;

                $quantity = rand(1, 5);
                $unitPrice = $product->price;
                $subtotal = $unitPrice * $quantity;
                $total += $subtotal;

                DB::table('order_items')->insert([
                    'order_id' => $orderId,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('orders')->where('id', $orderId)->update([
                'total' => $total,
                'updated_at' => now(),
            ]);
        }
    }
}
