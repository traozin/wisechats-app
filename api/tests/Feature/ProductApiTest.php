<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Testa: GET /api/v1/products sem autenticação → 401; com auth → lista produtos.
     */
    public function test_it_requires_auth_for_index_and_lists_products()
    {
        Product::factory()->create(['name' => 'Produto A']);
        Product::factory()->create(['name' => 'Produto B']);

        $this->getJson('/api/v1/products')
            ->assertStatus(401);

        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $this->getJson('/api/v1/products')
            ->assertStatus(200)
            ->assertJsonFragment(['name' => 'Produto A'])
            ->assertJsonFragment(['name' => 'Produto B']);
    }

    /**
     * Testa: POST /api/v1/products cria com validação de ProductData.
     */
    public function test_it_can_create_product()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $payload = [
            'name'        => 'Camiseta Legal',
            'price'       => 99.90,
            'description' => 'Camiseta de algodão',
            'stock'       => 10,
        ];

        $response = $this->postJson('/api/v1/products', $payload);

        $response
            ->assertStatus(201)
            ->assertJsonFragment(['name' => 'Camiseta Legal']);

        $this->assertDatabaseHas('products', [
            'name' => 'Camiseta Legal',
            'price' => 99.90,
        ]);
    }

    /**
     * Testa: GET /api/v1/products/{id} (404 quando não existe; 200 quando existe).
     */
    public function test_it_can_show_product_or_404()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $prod = Product::factory()->create(['name' => 'Produto XYZ']);

        $this->getJson('/api/v1/products/0000')
            ->assertStatus(404);

        $this->getJson("/api/v1/products/{$prod->id}")
            ->assertStatus(200)
            ->assertJsonFragment(['name' => 'Produto XYZ']);
    }

    /**
     * Testa: PUT /api/v1/products/{id} atualiza corretamente.
     */
    public function test_it_can_update_product()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $prod = Product::factory()->create([
            'name'      => 'Original',
            'price'     => 20.00,
            'description' => 'Desc original',
            'stock'     => 5,
        ]);

        $payload = [
            'name'        => 'Novo Nome',
            'price'       => 30.50,
            'description' => 'Nova desc',
            'stock'       => 8,
        ];

        $response = $this->putJson("/api/v1/products/{$prod->id}", $payload);

        $response
            ->assertStatus(200)
            ->assertJsonFragment(['name' => 'Novo Nome']);

        $this->assertDatabaseHas('products', [
            'id'    => $prod->id,
            'name'  => 'Novo Nome',
            'stock' => 8,
        ]);
    }

    /**
     * Testa: DELETE /api/v1/products/{id} remove o produto.
     */
    public function test_it_can_delete_product()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $prod = Product::factory()->create();

        $this->deleteJson("/api/v1/products/{$prod->id}")
            ->assertStatus(200)
            ->assertJson(['message' => 'Produto deletado com sucesso.']);

        $this->assertDatabaseMissing('products', [
            'id' => $prod->id,
        ]);
    }
}