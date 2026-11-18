package com.example.demo;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// 在庫数更新リクエストのDTO
public record StockUpdateRequest(
    @NotNull (message = "在庫数は必須です")
    @Min(value = 0, message = "在庫数は0以上にしてください")
    Integer stockQuantity
) {}