<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Routing\Controller;

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
                'message' => 'Credenciais inválidas',
                'errors' => ['email' => ['As credenciais informadas estão incorretas.']]
            ], 422);
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