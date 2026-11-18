// バックエンドのAPIエンドポイント
const API_URL = "/api/products"; 

// カテゴリ
const CATEGORY_LABELS = {
    POKEMON_CARD: "ポケモンカード",
    ONE_PIECE_CARD: "ワンピースカード",
    BATTLE_SPIRITS: "バトルスピリッツ",
    YU_GI_OH: "遊戯王",
    DUEL_MASTERS: "デュエル・マスターズ"
};

// DOM要素の取得(IDで要素を取得)
const elements = {
    apiStatus: document.getElementById("apiStatus"), // API接続状態表示
    totalProducts: document.getElementById("totalProducts"), // 商品総数
    totalStock: document.getElementById("totalStock"), // 在庫総数
    totalValue: document.getElementById("totalValue"), // 在庫総額
    outOfStock: document.getElementById("outOfStock"), // 在庫切れ商品数
    tableBody: document.getElementById("productTableBody"), // 商品一覧テーブルのtbody
    searchInput: document.getElementById("searchInput"), // 検索入力欄
    categoryFilter: document.getElementById("categoryFilter"), // カテゴリフィルター
    resultCount: document.getElementById("resultCount"), // 結果件数表示
    message: document.getElementById("message"), // メッセージ表示
    formPanel: document.getElementById("productFormPanel"), // 商品登録・編集フォームのパネル
    form: document.getElementById("productForm"), // 商品登録・編集フォーム
    formTitle: document.getElementById("formTitle"), // フォームタイトル
    productId: document.getElementById("productId"), // 商品ID（編集時に使用）
    sku: document.getElementById("sku"), // 商品SKU
    name: document.getElementById("name"), // 商品名
    category: document.getElementById("category"), // 商品カテゴリ
    price: document.getElementById("price"), // 商品価格
    stockQuantity: document.getElementById("stockQuantity"), // 商品在庫数
    saveBtn: document.getElementById("saveBtn") // 保存ボタン
};

let products = []; // 商品データのキャッシュ
let messageTimer; // メッセージ表示のタイマー

// APIエラーを読み取りやすい形にする
async function requestApi(url, options = {}) {
    // APIリクエストを送信
    const response = await fetch(url, {
        ...options,
        headers: { // リクエストヘッダーを設定
            ...(options.body
                ? { "Content-Type": "application/json" }
                : {}),
            ...options.headers
        }
    });

    // HTTPステータスコードが200番台以外の場合はエラーを投げる
    if (!response.ok) {
        let detail = `HTTP ${response.status}`;
        // エラーレスポンスがJSONの場合、詳細メッセージを取得
        try {
            const body = await response.json();
            detail = body.detail || body.message || body.error || detail;
        } catch {
            // エラーレスポンスがJSONではない場合
        }

        throw new Error(detail);
    }
    // HTTPステータスコードが204の場合はnullを返す
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// カテゴリ名を変換
function getCategoryName(category) {
    const categoryNames = {
        POKEMON_CARD: "ポケモンカード",
        ONE_PIECE_CARD: "ワンピースカード",
        BATTLE_SPIRITS: "バトルスピリッツ",
        YU_GI_OH: "遊戯王",
        DUEL_MASTERS: "デュエル・マスターズ"
    };
    return categoryNames[category] || category;
}

// 商品一覧を取得する
async function loadProducts() {
    elements.apiStatus.textContent = "API接続確認中...";
    elements.apiStatus.className = "api-status";

    try {
        const data = await requestApi(API_URL);
        // APIの応答が配列でない場合はエラーを投げる
        if (!Array.isArray(data)) {
            throw new Error("APIの応答形式が正しくありません");
        }

        products = data; // 商品データをキャッシュ

        // デバッグ用に商品データをコンソールに表示
        console.table(products.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category
        })));
        // API接続成功を表示
        elements.apiStatus.textContent = "API接続済み";
        elements.apiStatus.className = "api-status connected";

        renderDashboard();
        renderProducts();
    } catch (error) { // API接続エラー時の処理
        elements.apiStatus.textContent = "API接続エラー";
        elements.apiStatus.className = "api-status disconnected";

        elements.tableBody.replaceChildren(); // 商品一覧テーブルをクリア
        const row = document.createElement("tr"); // エラー表示用の行を作成
        const cell = document.createElement("td"); // エラー表示用のセルを作成

        cell.colSpan = 7; // 7列分のセルを結合
        cell.className = "empty-state"; // エラー表示用のクラスを設定
        cell.textContent =
            `商品データを取得できませんでした：${error.message}`; // エラーメッセージを表示

        row.appendChild(cell); // セルを行に追加
        elements.tableBody.appendChild(row); // 行をテーブルに追加

        // エラー詳細をコンソールに表示
        showMessage(
            "バックエンドが起動しているか、APIのパスを確認してください。",
            true
        );
    }
}

// ダッシュボードの集計
function renderDashboard() {
    // 在庫総数を計算
    const totalStock = products.reduce(
        (sum, product) => sum + Number(product.stockQuantity), 0
    );

    // 在庫総額を計算
    const totalValue = products.reduce(
        (sum, product) =>
            sum + Number(product.price) * Number(product.stockQuantity),
        0
    );

    // 在庫切れ商品数を計算
    const outOfStock = products.filter(
        product => Number(product.stockQuantity) === 0
    ).length;

    // 商品総数を日本語の数値形式で表示
    elements.totalProducts.textContent =
        products.length.toLocaleString("ja-JP");

    // 在庫総数を日本語の数値形式で表示
    elements.totalStock.textContent =
        totalStock.toLocaleString("ja-JP");

    // 在庫総額を日本円形式で表示
    elements.totalValue.textContent =
        formatCurrency(totalValue);
    
    // 在庫切れ商品数を日本語の数値形式で表示
    elements.outOfStock.textContent =
        outOfStock.toLocaleString("ja-JP");
}

// 金額表示
function formatCurrency(value) {
    return new Intl.NumberFormat("ja-JP", {
        style: "currency",
        currency: "JPY",
        maximumFractionDigits: 2
    }).format(value);
}

// 商品一覧の描画
function renderProducts() {
    const keyword = elements.searchInput.value.trim().toLowerCase(); // 検索キーワードを小文字に変換
    const category = elements.categoryFilter.value; // 選択されたカテゴリ

    // 検索キーワードとカテゴリで商品をフィルタリング
    const filteredProducts = products.filter(product => {
        const matchesKeyword =
            String(product.name).toLowerCase().includes(keyword) ||
            String(product.sku).toLowerCase().includes(keyword); // 商品名またはSKUにキーワードが含まれるかをチェック

        // カテゴリが未選択の場合は全てのカテゴリを表示
        const matchesCategory =
            !category || product.category === category;

        return matchesKeyword && matchesCategory; // 商品が検索キーワードとカテゴリの両方に一致するかをチェック
    });

    elements.tableBody.replaceChildren(); // 商品一覧テーブルをクリア

    // フィルタリング結果が0件の場合はメッセージを表示
    if (filteredProducts.length === 0) {
        const row = document.createElement("tr"); // エラー表示用の行を作成
        const cell = document.createElement("td"); // エラー表示用のセルを作成

        cell.colSpan = 7; // 7列分のセルを結合
        cell.className = "empty-state"; // エラー表示用のクラスを設定
        cell.textContent = products.length === 0 // 商品がまだ登録されていない場合と、条件に一致する商品がない場合でメッセージを切り替え
            ? "商品がまだ登録されていません。"
            : "条件に一致する商品がありません。";

        row.appendChild(cell); // セルを行に追加
        elements.tableBody.appendChild(row); // 行をテーブルに追加
    }

    // フィルタリング結果をテーブルに描画
    filteredProducts.forEach(product => {
        const row = document.createElement("tr"); // 商品情報を表示する行を作成

        addCell(row, product.sku, "sku"); // SKUを表示するセルを追加
        addCell(row, product.name, "product-name"); // 商品名を表示するセルを追加
        
        // カテゴリを表示するセルを追加
        addCell(
            row,
            CATEGORY_LABELS[product.category] || product.category,
            "category-badge"
        );
        addCell(row, formatCurrency(Number(product.price)));

        // 在庫数を表示するセルを追加
        addCell(
            row,
            Number(product.stockQuantity).toLocaleString("ja-JP")
        );

        const stockCell = document.createElement("td"); // 在庫状態を表示するセルを作成
        const badge = document.createElement("span"); // 在庫状態を表示するバッジを作成
        const isOutOfStock = Number(product.stockQuantity) === 0; // 在庫切れかどうかを判定

        // 在庫状態に応じてバッジのクラス名とテキストを設定
        badge.className = isOutOfStock
            ? "stock-badge out-of-stock"
            : "stock-badge in-stock";

        badge.textContent = isOutOfStock ? "在庫切れ" : "在庫あり"; // 在庫状態を表示するテキストを設定
        stockCell.appendChild(badge); // バッジをセルに追加
        row.appendChild(stockCell); // セルを行に追加

        const actionsCell = document.createElement("td"); // 編集・削除ボタンを表示するセルを作成
        const actions = document.createElement("div"); // 編集・削除ボタンをまとめるdivを作成
        actions.className = "row-actions"; // 編集・削除ボタンをまとめるdivのクラス名を設定

        // 編集ボタンを作成
        const editButton = createButton("編集", "button-small");
        editButton.addEventListener("click", () => openEditForm(product)); // 編集ボタンをクリックしたときに編集フォームを開くイベントリスナーを追加

        // 削除ボタンを作成
        const deleteButton = createButton(
            "削除", "button-small delete"
        );
        deleteButton.addEventListener( // 削除ボタンをクリックしたときに商品を削除するイベントリスナーを追加
            "click", () => deleteProduct(product)
        );

        actions.append(editButton, deleteButton); // 編集・削除ボタンをまとめるdivに追加
        actionsCell.appendChild(actions); // 編集・削除ボタンを表示するセルに追加
        row.appendChild(actionsCell); // 行に編集・削除ボタンを表示するセルを追加

        elements.tableBody.appendChild(row); // 行を商品一覧テーブルに追加
    });

    // 結果件数を表示
    elements.resultCount.textContent =
        `${filteredProducts.length}件 / 全${products.length}件`;
}

// テキストを安全にセルに追加する
function addCell(row, value, className = "") {
    const cell = document.createElement("td");
    cell.textContent = value ?? "";
    // クラス名が指定されている場合はセルにクラス名を追加
    if (className) {
        cell.className = className;
    }

    row.appendChild(cell); // セルを行に追加
}

// ボタンを作成する
function createButton(label, className) {
    const button = document.createElement("button"); // ボタン要素を作成
    button.type = "button";
    button.className = className;
    button.textContent = label;
    return button;
}

// メッセージ表示
function showMessage(message, isError = false) {
    clearTimeout(messageTimer); // 既存のメッセージ表示タイマーをクリア

    elements.message.textContent = message; // メッセージを表示
    elements.message.className = isError // エラーかどうかでクラス名を切り替え
        ? "message error"
        : "message";

    elements.message.hidden = false; // メッセージを表示

    messageTimer = setTimeout(() => { // 5秒後にメッセージを非表示
        elements.message.hidden = true;
    }, 5000);
}

// 登録フォームを開く
function openNewForm() {
    elements.form.reset();
    elements.productId.value = ""; // 商品IDをクリア（新規登録時はIDなし）
    elements.formTitle.textContent = "商品登録";
    elements.saveBtn.textContent = "商品を登録";
    elements.formPanel.hidden = false;
    elements.formPanel.scrollIntoView({ behavior: "smooth" }); // フォームパネルをスクロールして表示
}

// 編集フォームを開く
function openEditForm(product) {
    elements.productId.value = product.id; // 商品IDを設定（編集時はIDあり）
    elements.sku.value = product.sku; 
    elements.name.value = product.name;
    elements.category.value = product.category;
    elements.price.value = product.price;
    elements.stockQuantity.value = product.stockQuantity;

    elements.formTitle.textContent = "商品情報の編集";
    elements.saveBtn.textContent = "変更を保存";
    elements.formPanel.hidden = false;
    elements.formPanel.scrollIntoView({ behavior: "smooth" });
}

// 商品登録・更新
async function saveProduct(event) {
    event.preventDefault();
    // フォームの入力が無効な場合は処理を中断
    if (!elements.form.reportValidity()) {
        return;
    }

    const id = elements.productId.value; // 商品ID（編集時に使用）

    // フォームの入力値を取得して商品オブジェクトを作成
    const product = {
        sku: elements.sku.value.trim(), // SKUをトリムして取得
        name: elements.name.value.trim(), // 商品名をトリムして取得
        category: elements.category.value, // カテゴリを取得
        price: Number(elements.price.value), // 価格を数値に変換して取得
        stockQuantity: Number(elements.stockQuantity.value) // 在庫数を数値に変換して取得
    };

    // 入力値が不正な場合はエラーメッセージを表示して処理を中断
    if (
        !product.sku ||
        !product.name ||
        !product.category ||
        !Number.isFinite(product.price) ||
        !Number.isFinite(product.stockQuantity) ||
        product.price < 0 ||
        product.price > 9999999999.99 ||
        product.stockQuantity < 0 ||
        !Number.isInteger(product.stockQuantity)
    ) {
        showMessage("入力内容を確認してください。", true);
        return;
    }

    // 価格は小数点以下2桁まで
    if (Math.round(product.price * 100) !==
        product.price * 100) {
        showMessage("価格は小数点以下2桁まで入力できます。", true);
        return;
    }

    elements.saveBtn.disabled = true; // 保存ボタンを無効化して二重送信を防止

    // 商品登録・更新のAPIリクエストを送信
    try {
        await requestApi(
            id ? `${API_URL}/${encodeURIComponent(id)}` : API_URL,
            {
                method: id ? "PUT" : "POST",
                body: JSON.stringify(product)
            }
        );

        elements.formPanel.hidden = true;
        showMessage(id ? "商品を更新しました。" : "商品を登録しました。");

        await loadProducts(); // 商品一覧を再読み込みして更新
    } catch (error) {
        showMessage(`保存に失敗しました：${error.message}`, true);
    } finally {
        elements.saveBtn.disabled = false;
    }
}

// 商品削除
async function deleteProduct(product) {
    const confirmed = window.confirm(
        `「${product.name}」を削除しますか？`
    );
    // ユーザーが削除をキャンセルした場合は処理を中断
    if (!confirmed) {
        return;
    }
    // 商品削除のAPIリクエストを送信
    try {
        await requestApi(
            `${API_URL}/${encodeURIComponent(product.id)}`,
            { method: "DELETE" }
        );

        showMessage("商品を削除しました。");
        await loadProducts(); // 商品一覧を再読み込みして更新
    } catch (error) {
        showMessage(`削除に失敗しました：${error.message}`, true);
    }
}

// イベント登録
document.getElementById("newProductBtn")
    .addEventListener("click", openNewForm); // 新規登録ボタンをクリックしたときに登録フォームを開く

document.getElementById("cancelBtn")
    .addEventListener("click", () => {
        elements.formPanel.hidden = true;
    }); // キャンセルボタンをクリックしたときにフォームパネルを非表示にする

document.getElementById("cancelFormBtn")
    .addEventListener("click", () => {
        elements.formPanel.hidden = true;
    }); // フォームのキャンセルボタンをクリックしたときにフォームパネルを非表示にする

document.getElementById("refreshBtn")
    .addEventListener("click", loadProducts);

elements.searchInput.addEventListener("input", renderProducts); // 検索入力欄の内容が変更されたときに商品一覧を再描画
elements.categoryFilter.addEventListener("change", renderProducts); // カテゴリフィルターの選択が変更されたときに商品一覧を再描画
elements.form.addEventListener("submit", saveProduct); // 商品登録・更新フォームの送信イベントを処理

// 初回読み込み
loadProducts();
