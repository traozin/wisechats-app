<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use App\Data\OrderItemData;

class OrderData extends Data {
    public function __construct(
        public string $user_id,
        /** @var OrderItemData[] */
        public array $items
    ) {
    }
}
