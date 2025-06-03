<?php
namespace App\Observers;

use App\Models\OrderItem;

class OrderItemObserver {

    public function created(OrderItem $item) {
        $product = $item->product;
        $product->decrement('stock', $item->quantity);
    }

    public function deleted(OrderItem $item) {
        $product = $item->product;
        $product->increment('stock', $item->quantity);
    }

    public function updating(OrderItem $item) {
        $originalQuantity = $item->getOriginal('quantity');
        $newQuantity = $item->quantity;

        if ($newQuantity != $originalQuantity) {
            $difference = $newQuantity - $originalQuantity;

            if ($difference > 0) {
                $item->product->decrement('stock', $difference);
            } else {
                $item->product->increment('stock', abs($difference));
            }
        }
    }
}
