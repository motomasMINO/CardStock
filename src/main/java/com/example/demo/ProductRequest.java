package com.example.demo;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

// 商品登録・更新リクエストのDTO
public record ProductRequest(
    @NotNull(message = "カテゴリは必須です")
    ProductCategory category,

    @NotBlank(message = "SKUは必須です")
    @Size(max = 50, message = "SKUは50文字以内で入力してください")
    String sku,

    @NotBlank(message = "商品名は必須です")
    @Size(max = 100, message = "商品名は100文字以内で入力してください")
    String name,

    @NotNull(message = "価格は必須です")
    @DecimalMin(value = "0.00", inclusive = false, message = "価格は0以上にしてください")
    @Digits(integer = 10, fraction = 2, message = "価格は整数部10桁、小数部2桁以内で入力してください")
    BigDecimal price,

    @NotNull(message = "在庫数は必須です")
    @Min(value = 0, message = "在庫数は0以上にしてください")
    Integer stockQuantity
   ) {}
