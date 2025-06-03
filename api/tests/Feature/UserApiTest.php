<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class UserApiTest extends TestCase {
    use RefreshDatabase;

    /**
     * Testa: é possível criar um usuário (rota pública POST /api/v1/users).
     */
    public function test_it_can_create_user() {
        $payload = [
            'name' => 'João da Silva',
            'email' => 'joao@example.com',
            'password' => 'senha1234',
        ];

        $response = $this->postJson('/api/v1/users', $payload);

        $response
            ->assertStatus(201)
            ->assertJsonFragment([
                'name' => 'João da Silva',
                'email' => 'joao@example.com',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'joao@example.com',
        ]);
    }

    /**
     * Testa: rota GET /api/v1/users requer autenticação e retorna lista.
     */
    public function test_it_requires_auth_for_index_and_returns_users() {
        User::factory()->create(['email' => 'a@a.com']);
        User::factory()->create(['email' => 'b@b.com']);

        $this->getJson('/api/v1/users')
            ->assertStatus(401);

        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);

        $this->getJson('/api/v1/users')
            ->assertStatus(200)
            ->assertJsonFragment(['email' => 'a@a.com'])
            ->assertJsonFragment(['email' => 'b@b.com']);
    }

    /**
     * Testa: GET /api/v1/users/{id} retorna 404 se não existir e retorna o usuário se existir.
     */
    public function test_it_can_show_user_or_return_404() {
        $someUser = User::factory()->create();

        $this->getJson("/api/v1/users/{$someUser->id}")
            ->assertStatus(401);

        Sanctum::actingAs($someUser, ['*']);

        $this->getJson('/api/v1/users/00000000-0000-0000-0000-000000000000')
            ->assertStatus(404);

        $this->getJson("/api/v1/users/{$someUser->id}")
            ->assertStatus(200)
            ->assertJsonFragment([
                'email' => $someUser->email,
                'name' => $someUser->name,
            ]);
    }

    /**
     * Testa: PUT /api/v1/users/{id} atualiza e retorna token novo.
     */
    public function test_it_can_update_user_and_returns_token() {
        $user = User::factory()->create([
            'name' => 'Usuário Antigo',
            'email' => 'old@example.com',
            'password' => bcrypt('oldpassword'),
        ]);

        Sanctum::actingAs($user, ['*']);

        $payload = [
            'name' => 'Usuário Novo',
            'email' => 'new@example.com',
            'password' => 'novasenha123',
        ];

        $response = $this->putJson("/api/v1/users/{$user->id}", $payload);

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'updated_at', 'created_at'],
                'token',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'email' => 'new@example.com',
            'name' => 'Usuário Novo',
        ]);
    }

    /**
     * Testa: DELETE /api/v1/users/{id} remove o usuário.
     */
    public function test_it_can_delete_user() {
        $user = User::factory()->create();
        $other = User::factory()->create();

        $this->deleteJson("/api/v1/users/{$other->id}")
            ->assertStatus(401);

        Sanctum::actingAs($user, ['*']);

        $this->deleteJson('/api/v1/users/00000000-0000-0000-0000-000000000000')
            ->assertStatus(404);

        $this->deleteJson("/api/v1/users/{$other->id}")
            ->assertStatus(200)
            ->assertJson(['message' => 'Usuário deletado com sucesso.']);

        $this->assertDatabaseMissing('users', [
            'id' => $other->id,
        ]);
    }
}