<?php

namespace App\Services;

use App\Data\ProductData;
use App\Models\Product;
use Exception;

use Illuminate\Database\Eloquent\Collection;

class ProductService {

    /**
     * Retorna todos os produtos.
     *
     * @return Collection
     */
    public function listProducts(): Collection {
        return Product::all();
    }

    /**
     * Cria um novo produto.
     *
     * @param ProductData $data
     * @return Product
     * @throws Exception
     */
    public function createProduct(ProductData $data): Product {
        return Product::create($data->toArray());
    }

    /**
     * Retorna um produto pelo ID (lança ModelNotFoundException se não achar).
     *
     * @param string $id
     * @return Product
     * @throws Exception
     */
    public function getProduct(string $id): Product {
        return Product::findOrFail($id);
    }

    /**
     * Atualiza um produto existente.
     *
     * @param ProductData $data
     * @param string      $id
     * @return Product
     * @throws Exception
     */
    public function updateProduct(ProductData $data, string $id): Product {
        $product = Product::findOrFail($id);
        $product->update($data->toArray());
        return $product;
    }

    /**
     * Deleta um produto pelo ID.
     *
     * @param string $id
     * @return void
     * @throws Exception
     */
    public function deleteProduct(string $id): void {
        $product = Product::findOrFail($id);
        $product->delete();
    }
}
