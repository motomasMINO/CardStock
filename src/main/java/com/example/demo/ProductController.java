package com.example.demo;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 商品コントローラークラス
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    private final ProductService service; // 商品サービスクラスのインスタンス

    // コンストラクタ
    public ProductController(ProductService service) {
        this.service = service;
    }

    // 商品一覧
    @GetMapping
    public List<Product> findAll() {
        return service.findAll();
    }

    // 商品詳細
    @GetMapping("/{id}")
    public Product findById(@PathVariable Long id) {
        return service.findById(id);
    }

    // 商品登録
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Product create(@Valid @RequestBody ProductRequest request) {
        return service.create(request);
    }

    // 商品情報更新
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return service.update(id, request);
    }

    // 在庫数更新
    @PatchMapping("/{id}/stock")
    public Product updateStock(@PathVariable Long id, @Valid @RequestBody StockUpdateRequest request) {
        return service.updateStock(id, request);
    }

    // 商品削除
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
