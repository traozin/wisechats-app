<?php

namespace App\Http\Controllers\Api;

use App\Data\ProductData;
use App\Http\Controllers\Controller;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Throwable;

class ProductController extends Controller {
    
    protected ProductService $productService;

    public function __construct(ProductService $productService) {
        $this->productService = $productService;
    }

    /**
     * GET /api/products
     */
    public function index(): JsonResponse {
        $products = $this->productService->listProducts();
        return response()->json($products);
    }

    /**
     * POST /api/products
     */
    public function store(ProductData $data): JsonResponse {
        try {
            $product = $this->productService->createProduct($data);
            return response()->json($product, 201);
        } catch (Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * GET /api/products/{id}
     */
    public function show(string $id): JsonResponse {
        try {
            $product = $this->productService->getProduct($id);
            return response()->json($product);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Produto não encontrado.',
            ], 404);
        }
    }

    /**
     * PUT /api/products/{id}
     */
    public function update(ProductData $data, string $id): JsonResponse {
        try {
            $product = $this->productService->updateProduct($data, $id);
            return response()->json($product);
        } catch (Throwable $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * DELETE /api/products/{id}
     */
    public function destroy(string $id): JsonResponse {
        try {
            $this->productService->deleteProduct($id);
            return response()->json([
                'message' => 'Produto deletado com sucesso.',
            ]);
        } catch (Throwable $e) {
            return response()->json([
                'error' => 'Produto não encontrado ou não pôde ser deletado.',
            ], 404);
        }
    }
}