<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthApiTest extends TestCase {
    use RefreshDatabase;

    public function test_it_requires_email_and_password_to_login() {
        $response = $this->postJson('/api/v1/login', []);

        $response->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_it_fails_with_wrong_credentials() {
        $user = User::factory()->create(['password' => bcrypt('correct-password')]);

        $response = $this->postJson('/api/v1/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_it_returns_token_with_valid_credentials() {
        $user = User::factory()->create(['password' => bcrypt('secret123')]);

        $response = $this->postJson('/api/v1/login', [
            'email' => $user->email,
            'password' => 'secret123',
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token']);
    }

    public function test_it_returns_user_info_on_me_endpoint() {
        $user = User::factory()->create();
        $token = $user->createToken('wise_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/me');

        $response->assertStatus(200);
        $response->assertJson([
            'user' => ['email' => $user->email],
            'token' => $token,
        ]);
    }

    public function test_it_logs_out_and_invalidates_tokens() {
        $user = User::factory()->create();
        $plainText = $user->createToken('wise_token')->plainTextToken;

        $tokenInstance = $user->tokens()->latest()->first();
        $tokenId = $tokenInstance->id;

        $this->withHeader('Authorization', "Bearer {$plainText}")
            ->postJson('/api/v1/logout')
            ->assertStatus(200)
            ->assertJson(['message' => 'Desconectado com sucesso']);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $tokenId,
        ]);

        $this->withHeader('Authorization', "Bearer {$plainText}")
            ->getJson('/api/v1/me')
            ->assertStatus(401);
    }
}
