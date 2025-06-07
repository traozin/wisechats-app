<?php
namespace App\Observers;

use App\Models\OrderItem;

class OrderItemObserver {
    public function created(OrderItem $item) {
        $item->product->decrement('stock', $item->quantity);
    }

    public function updated(OrderItem $item) {
        $original = $item->getOriginal('quantity');
        $current = $item->quantity;
        $diff = $current - $original;

        if ($diff > 0) {
            $item->product->decrement('stock', $diff);
        } elseif ($diff < 0) {
            $item->product->increment('stock', -$diff);
        }
    }

    public function deleted(OrderItem $item) {
        $item->product->increment('stock', $item->quantity);
    }
}
