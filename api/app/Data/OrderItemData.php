<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Rule;

class OrderItemData extends Data {
    public function __construct(
        #[Uuid]
        #[Rule('exists:products,id')]
        public string $product_id,

        #[Min(1)]
        public int $quantity
    ) {
    }
}
