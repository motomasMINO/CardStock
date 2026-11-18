package com.example.demo;

// 商品カテゴリ
public enum ProductCategory {
    POKEMON_CARD("ポケモンカード"), 
    ONE_PIECE_CARD("ワンピースカード"), 
    BATTLE_SPRITS("バトルスピリッツ"), 
    YU_GI_OH("遊戯王"), 
    DUEL_MASTERS("デュエル・マスターズ");

    private final String displayName; // 表示名

    // コンストラクタ
    ProductCategory(String displayName) {
        this.displayName = displayName;
    }

    // 表示名を取得するメソッド
    public String getDisplayName() {
        return displayName;
    }
}
