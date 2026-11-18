package com.example.demo;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

// 商品サービスクラス
@Service
public class ProductService {

    private final ProductRepository repository;

    // コンストラクタ
    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    // カテゴリで商品を検索するメソッド
    @Transactional(readOnly = true)
    public List<Product> findAll() {
        return repository.findAll();
    }

    // カテゴリで商品を検索するメソッド
    @Transactional
    public Product findById(Long id) {
        return getProduct(id);
    }

    @Transactional
    public Product create(ProductRequest request) {
        // SKUの重複チェック
        if (repository.existsBySku(request.sku())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "このSKUは既に登録されています");
        }

        // 商品を作成して保存する
        Product product = new Product(request.category(), request.sku(), request.name(), request.price(), request.stockQuantity());
        return repository.save(product);
    }

    // 商品情報を更新するメソッド
    @Transactional
    public Product update(Long id, ProductRequest request) {
        Product product = getProduct(id);

        // SKUの重複チェック
        if (repository.existsBySkuAndIdNot(request.sku(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "このSKUは既に登録されています");
        }

        product.update(request.category(), request.sku(), request.name(), request.price()); // 商品情報を更新
        product.updateStock(request.stockQuantity()); // 在庫数を更新
        return repository.save(product);
    }

    // 在庫数を更新するメソッド
    @Transactional
    public Product updateStock(Long id, StockUpdateRequest request) {
        Product product = getProduct(id); // 商品を取得
        product.updateStock(request.stockQuantity()); // 在庫数を更新
        return repository.save(product);
    }

    // 商品を削除するメソッド
    @Transactional
    public void delete(Long id) {
        Product product = getProduct(id);
        repository.delete(product);
    }

    // 商品を取得するヘルパーメソッド
    private Product getProduct(Long id) {
        // 商品が存在しない場合は404エラーを返す
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "商品が見つかりません"));
    }
}
