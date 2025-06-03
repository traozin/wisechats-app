<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class ProductData extends Data {
    public function __construct(
        #[Required, Min(1)]
        public string $name,

        public string $description,

        #[Required, Min(0)]
        public float $price,

        #[Required, Min(0)]
        public int $stock,
    ) {
    }
}
