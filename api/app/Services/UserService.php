<?php

namespace App\Services;

use App\Data\UserData;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Exception;
use Illuminate\Database\Eloquent\Collection;

class UserService {

    /**
     * Retorna todos os usuários.
     *
     * @return Collection
     */
    public function listUsers(): Collection {
        return User::all();
    }

    /**
     * Cria um novo usuário e retorna o modelo criado.
     *
     * @param UserData $data
     * @return User
     * @throws Exception
     */
    public function createUser(UserData $data): Array {
        // Verifica se o email já está em uso
        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);

        $token = $user->createToken('wise_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token
        ];
    }

    /**
     * Retorna um usuário pelo ID (lança se não existir).
     *
     * @param string $id
     * @return User
     * @throws Exception
     */
    public function getUser(string $id): User {
        return User::findOrFail($id);
    }

    /**
     * Atualiza o usuário e gera um novo token.
     *
     * @param UserData $data
     * @param string   $id
     * @return array  Contém ['user' => User, 'token' => string]
     * @throws Exception
     */
    public function updateUser(UserData $data, string $id): array {
        $user = User::findOrFail($id);

        $user->update([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);

        $token = $user->createToken('wise_token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    /**
     * Deleta um usuário pelo ID.
     *
     * @param string $id
     * @return void
     * @throws Exception
     */
    public function deleteUser(string $id): void {
        $user = User::findOrFail($id);
        $user->delete();
    }
}
