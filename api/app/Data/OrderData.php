<?php

namespace App\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Attributes\Validation\Uuid;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\DataCollection;

use App\Data\OrderItemData;

class OrderData extends Data {
    public function __construct(
        #[Uuid]
        #[Rule('exists:users,id')]
        public string $user_id,

        #[Required]
        #[Min(1)]
        #[DataCollectionOf(OrderItemData::class)]
        public DataCollection $items
    ) {
    }
}