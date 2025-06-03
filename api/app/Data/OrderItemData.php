<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Rule;

class OrderItemData extends Data {
    public function __construct(
        #[Rule('exists:products,id')]
        public int $product_id,

        #[Min(1)]
        public int $quantity
    ) {
    }
}
