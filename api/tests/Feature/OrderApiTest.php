<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderApiTest extends TestCase {
    use RefreshDatabase;

    /**
     * Testa: GET /api/v1/orders (precisa autenticação, retorna lista vazia ou pedidos existentes).
     */
    public function test_it_requires_auth_for_index_and_lists_orders() {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $this->getJson('/api/v1/orders')
            ->assertStatus(200)
            ->assertExactJson([]);

        $product = Product::factory()->create([
            'price' => 10.00,
            'stock' => 100,
        ]);

        $order = Order::create(['user_id' => $user->id]);
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 10.00,
            'subtotal' => 20.00,
        ]);
        $order->total = 20.00;
        $order->save();

        $this->getJson('/api/v1/orders')
            ->assertStatus(200)
            ->assertJsonFragment([
                'id' => $order->id,
                'user_id' => $user->id,
                'total' => 20.00,
            ]);
    }

    /**
     * Testa: POST /api/v1/orders → criação de pedido completo (com checagem de estoque).
     */
    public function test_it_can_create_order_and_decrement_stock() {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $p1 = Product::factory()->create([
            'price' => 5.00,
            'stock' => 10,
        ]);
        $p2 = Product::factory()->create([
            'price' => 3.50,
            'stock' => 5,
        ]);

        $payload = [
            'user_id' => $user->id,
            'items' => [
                ['product_id' => $p1->id, 'quantity' => 2],
                ['product_id' => $p2->id, 'quantity' => 1],
            ],
        ];

        $response = $this->postJson('/api/v1/orders', $payload);

        $response
            ->assertStatus(201)
            ->assertJsonFragment([
                'user_id' => $user->id,
                'total' => 5.00 * 2 + 3.50 * 1,
            ])
            ->assertJsonPath('items.0.product_id', $p1->id);

        $this->assertDatabaseHas('products', [
            'id' => $p1->id,
        ]);
        $this->assertDatabaseHas('products', [
            'id' => $p2->id,
        ]);
    }

    /**
     * Testa: POST /api/v1/orders com estoque insuficiente → 400 e mensagem de erro.
     */
    public function test_it_fails_when_stock_insufficient() {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $p1 = Product::factory()->create([
            'price' => 2.00,
            'stock' => 1,
        ]);

        $payload = [
            'user_id' => $user->id,
            'items' => [
                ['product_id' => $p1->id, 'quantity' => 5],
            ],
        ];

        $response = $this->postJson('/api/v1/orders', $payload);

        $response
            ->assertStatus(400)
            ->assertJsonFragment([
                'error' => "Estoque insuficiente para o produto ID {$p1->id}. Disponível: 1, solicitado: 5."
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $p1->id,
            'stock' => 1,
        ]);
    }

    /**
     * Testa: PUT /api/v1/orders/{id} atualiza o pedido e devolve/redistribui estoque corretamente.
     */
    public function test_it_can_update_order_and_adjust_stock() {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $p1 = Product::factory()->create(['price' => 10.00, 'stock' => 10]);
        $p2 = Product::factory()->create(['price' => 5.00, 'stock' => 5]);

        $order = Order::create(['user_id' => $user->id]);
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $p1->id,
            'quantity' => 2,
            'unit_price' => 10.00,
            'subtotal' => 20.00,
        ]);
        $order->total = 20.00;
        $order->save();

        $p1->refresh();
        $this->assertEquals(8, $p1->stock);

        $payload = [
            'user_id' => $user->id,
            'items' => [
                ['product_id' => $p2->id, 'quantity' => 1],
            ],
        ];

        $response = $this->putJson("/api/v1/orders/{$order->id}", $payload);

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'total' => 5.00 * 1,
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $p1->id,
            'stock' => 10,
        ]);
        $this->assertDatabaseHas('products', [
            'id' => $p2->id,
            'stock' => 4,
        ]);
    }

    /**
     * Testa: DELETE /api/v1/orders/{id} remove o pedido e devolve estoque.
     */
    public function test_it_can_delete_order_and_restore_stock() {
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $product = Product::factory()->create(['price' => 7.50, 'stock' => 3]);

        $order = Order::create(['user_id' => $user->id]);
        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 7.50,
            'subtotal' => 15.00,
        ]);
        $order->total = 15.00;
        $order->save();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 1,
        ]);

        $response = $this->deleteJson("/api/v1/orders/{$order->id}");

        $response
            ->assertStatus(200)
            ->assertJson(['message' => 'Pedido deletado com sucesso.']);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 3,
        ]);

        $this->assertDatabaseMissing('orders', [
            'id' => $order->id,
        ]);
    }
}
