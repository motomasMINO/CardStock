package com.example.demo;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

// 商品エンティティクラス
@Entity
@Table(name = "products",
       uniqueConstraints = @UniqueConstraint(
        name = "uk_products_sku",
        columnNames = "sku"
       )
)
// 商品テーブルの定義
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 商品ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProductCategory category;

    @Column(nullable = false, length = 50)
    private String sku;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private int stockQuantity;

    protected Product() {
        // JPA用のコンストラクタ
    }

    // 商品を作成するコンストラクタ
    public Product(ProductCategory category, String sku, String name, BigDecimal price, int stockQuantity) {
        this.category = category;
        this.sku = sku;
        this.name = name;
        this.price = price;
        this.stockQuantity = stockQuantity;
    }

    // 商品情報を更新するメソッド
    public void update(ProductCategory category, String sku, String name, BigDecimal price) {
        this.category = category;
        this.sku = sku;
        this.name = name;
        this.price = price;
    }

    // 在庫数を更新するメソッド
    public void updateStock(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    // ゲッター
    public Long getId() {
        return id;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public String getSku() {
        return sku;
    }

    public String getName() {
        return name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }
}
