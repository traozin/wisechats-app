<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Routing\Controller;

class AuthController extends Controller {

    public function login(Request $request) {
        if (!$request->all()) {
            return response()->json(['error' => 'Dados não enviados.'], 400);
        }

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais estão incorretas.'],
            ]);
        }

        return response()->json([
            'token' => $user->createToken('wise_token')->plainTextToken,
        ]);
    }

    public function logout(Request $request) {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Desconectado com sucesso']);
    }

    public function me(Request $request) {
        $user = $request->user();
        $token = $request->bearerToken();

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }
}