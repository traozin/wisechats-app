<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Routing\Controller;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller {

    public function login(Request $request) {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dados inválidos',
                'errors' => $validator->errors()
            ], 422
            );
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Credenciais inválidas',
                'errors' => [
                    'email' => ['As credenciais informadas não são válidas.'],
                ]
            ], 422);
        }

        return response()->json([
            'token' => $user->createToken('wise_token')->plainTextToken,
        ]);
    }

    public function me(Request $request) {
        $tokenString = $request->bearerToken();

        $token = PersonalAccessToken::findToken($tokenString);

        if (!$token) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }

        $user = $token->tokenable;

        return response()->json([
            'user' => $user,
            'token' => $tokenString,
        ]);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Desconectado com sucesso'
        ]);
    }
}