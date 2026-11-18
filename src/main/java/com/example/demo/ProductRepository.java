package com.example.demo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

// 商品リポジトリのインターフェース
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsBySku(String sku); // SKUの重複チェック
    boolean existsBySkuAndIdNot(String sku, Long id); // 更新時のSKUの重複チェック
    List<Product> findByCategory(ProductCategory category); // カテゴリで商品を検索するメソッド
}
