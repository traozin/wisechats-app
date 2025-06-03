<?php

namespace App\Http\Controllers\Api;

use App\Data\UserData;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller {
    public function index() {
        return User::all();
    }

    public function store(UserData $data) {
        $user = User::create([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);

        return response()->json($user, 201);
    }

    public function show(string $id) {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function update(UserData $data, string $id) {
        $user = User::findOrFail($id);

        $user->update([
            'name' => $data->name,
            'email' => $data->email,
            'password' => Hash::make($data->password),
        ]);

        $token = $user->createToken('wise_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function destroy(string $id) {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Usuário deletado com sucesso.']);
    }
}
