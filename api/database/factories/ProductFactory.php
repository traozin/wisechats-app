<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory {
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array {
        return [
            'name' => fake()->words(fake()->numberBetween(2, 4), true),
            'stock' => fake()->numberBetween(0, 100),
            'price' => fake()->randomFloat(2, 1, 1000),
            'description' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indica que este produto deve vir com estoque zero.
     */
    public function outOfStock(): static {
        return $this->state(fn(array $attributes) => [
            'stock' => 0,
        ]);
    }
}