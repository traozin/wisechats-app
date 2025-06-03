<?php

namespace App\Http\Controllers\Api;

use App\Data\UserData;
use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Throwable;

class UserController extends Controller {

    protected UserService $userService;

    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    /**
     * GET /api/users
     */
    public function index(): JsonResponse {
        $users = $this->userService->listUsers();
        return response()->json($users);
    }

    /**
     * POST /api/users
     */
    public function store(UserData $data): JsonResponse {
        try {
            $user = $this->userService->createUser($data);
            return response()->json($user, 201);
        } catch (Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * GET /api/users/{id}
     */
    public function show(string $id): JsonResponse {
        try {
            $user = $this->userService->getUser($id);
            return response()->json($user);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Usuário não encontrado.',
            ], 404);
        }
    }

    /**
     * PUT /api/users/{id}
     */
    public function update(UserData $data, string $id): JsonResponse {
        try {
            $result = $this->userService->updateUser($data, $id);
            return response()->json([
                'user' => $result['user'],
                'token' => $result['token'],
            ], 200);
        } catch (Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * DELETE /api/users/{id}
     */
    public function destroy(string $id): JsonResponse {
        try {
            $this->userService->deleteUser($id);
            return response()->json([
                'message' => 'Usuário deletado com sucesso.',
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Usuário não encontrado ou não pôde ser deletado.',
            ], 404);
        }
    }
}