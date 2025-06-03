<?php

namespace App\Http\Controllers\Api;

use App\Data\ProductData;
use App\Http\Controllers\Controller;
use App\Models\Product;

class ProductController extends Controller {
    public function index() {
        return Product::all();
    }

    public function store(ProductData $data) {
        $product = Product::create($data->toArray());
        return response()->json($product, 201);
    }

    public function show(string $id) {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    public function update(ProductData $data, string $id) {
        $product = Product::findOrFail($id);
        $product->update($data->toArray());
        return response()->json($product);
    }

    public function destroy(string $id) {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Produto deletado com sucesso.']);
    }
}
