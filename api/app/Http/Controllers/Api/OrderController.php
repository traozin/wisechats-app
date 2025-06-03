<?php

namespace App\Http\Controllers\Api;

use App\Data\OrderData;
use App\Services\OrderService;
use Illuminate\Routing\Controller;
use Illuminate\Http\JsonResponse;
use Throwable;

class OrderController extends Controller {
    protected OrderService $orderService;

    public function __construct(OrderService $orderService) {
        $this->orderService = $orderService;
    }

    public function index(): JsonResponse {
        return response()->json($this->orderService->listOrders());
    }

    public function store(OrderData $data): JsonResponse {
        try {
            $order = $this->orderService->createOrder($data);
            return response()->json($order, 201);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function update(OrderData $data, int $id): JsonResponse {
        try {
            $order = $this->orderService->updateOrder($data, $id);
            return response()->json($order);
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    public function destroy(int $id): JsonResponse {
        try {
            $deleted = $this->orderService->deleteOrder($id);
            if ($deleted) {
                return response()->json(['message' => 'Pedido deletado com sucesso.']);
            } else {
                return response()->json(['error' => 'Pedido não encontrado ou não pôde ser deletado.'], 404);
            }
        } catch (Throwable $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
