# API仕様書

ローカルAIチャットアプリケーションで利用可能なREST APIエンドポイントを説明します。

## ベースURL
```
http://localhost:5000/api
```

## エンドポイント

### メッセージ

#### メッセージ取得
時系列順でチャットメッセージを全て取得します。

```http
GET /api/messages
```

**レスポンス:**
```json
[
  {
    "id": 1,
    "content": "こんにちは、元気ですか？",
    "sender": "user",
    "timestamp": "2025-06-14T21:30:00Z",
    "model": "llama3",
    "mode": "ollama"
  },
  {
    "id": 2,
    "content": "元気です、ありがとうございます！今日はどんなお手伝いができますか？",
    "sender": "ai",
    "timestamp": "2025-06-14T21:30:05Z",
    "model": "llama3",
    "mode": "ollama"
  }
]
```

#### メッセージ送信
AIにメッセージを送信してレスポンスを受信します。

```http
POST /api/chat
```

**リクエストボディ:**
```json
{
  "content": "プログラミングについて教えてください",
  "mode": "ollama",
  "model": "llama3"
}
```

**レスポンス:**
```json
{
  "message": {
    "id": 3,
    "content": "プログラミングは創造的で論理的な活動です。まず、どの言語から始めたいですか？",
    "sender": "ai",
    "timestamp": "2025-06-14T21:31:00Z",
    "model": "llama3",
    "mode": "ollama"
  }
}
```

### モデル

#### 利用可能モデル取得
指定されたAIランタイムで利用可能なモデルを一覧表示します。

```http
GET /api/models/{mode}
```

**パラメータ:**
- `mode`: `ollama` または `lmstudio`

**Ollamaの場合:**
```json
{
  "models": ["llama3", "mistral", "codellama", "gemma"],
  "connected": true
}
```

**LM Studioの場合:**
```json
{
  "models": ["mistral-7b-instruct", "llama3-8b-chat"],
  "connected": true
}
```

**接続失敗時:**
```json
{
  "models": [],
  "connected": false,
  "error": "Ollama not available"
}
```

### 設定

#### 設定取得
現在のアプリケーション設定を取得します。

```http
GET /api/settings
```

**レスポンス:**
```json
{
  "id": 1,
  "selectedMode": "ollama",
  "selectedModel": "llama3",
  "isConnected": true,
  "selectedFont": "Noto Sans JP"
}
```

#### 設定更新
アプリケーション設定を更新します。

```http
POST /api/settings
```

**リクエストボディ:**
```json
{
  "selectedMode": "lmstudio",
  "selectedModel": "mistral-7b-instruct",
  "isConnected": true,
  "selectedFont": "Inter"
}
```

**レスポンス:**
```json
{
  "id": 1,
  "selectedMode": "lmstudio",
  "selectedModel": "mistral-7b-instruct",
  "isConnected": true,
  "selectedFont": "Inter"
}
```

## エラーハンドリング

### 標準エラーレスポンス
```json
{
  "error": "詳細なエラーメッセージ",
  "status": 400
}
```

### HTTPステータスコード
- `200` - 成功
- `400` - 不正なリクエスト
- `404` - 見つからない
- `500` - サーバーエラー

## 外部API統合

### Ollama統合
```
POST http://localhost:11434/api/generate
```

**リクエスト形式:**
```json
{
  "model": "llama3",
  "prompt": "ユーザーメッセージ",
  "stream": false
}
```

### LM Studio統合
```
POST http://localhost:1234/v1/chat/completions
```

**リクエスト形式:**
```json
{
  "model": "mistral-7b-instruct",
  "messages": [
    {"role": "user", "content": "ユーザーメッセージ"}
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

## 利用例

### 基本的な会話フロー
1. 設定確認: `GET /api/settings`
2. モデル一覧取得: `GET /api/models/ollama`
3. メッセージ送信: `POST /api/chat`
4. 履歴確認: `GET /api/messages`

### curlを使った動作確認
```bash
# 設定確認
curl http://localhost:5000/api/settings

# メッセージ送信
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"content":"こんにちは","mode":"ollama","model":"llama3"}'

# 履歴確認
curl http://localhost:5000/api/messages
```