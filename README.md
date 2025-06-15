# 🌸 ローカルAIチャット

<div align="center">

![Logo](https://img.shields.io/badge/🤖-Local%20AI%20Chat-ff69b4?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

**プライベート・オフライン対応のローカルAIチャットアプリケーション**

</div>

## ✨ 特徴

- 🏠 **完全ローカル**: プライベートかつオフライン対応の環境でAIと会話
- 🤖 **マルチAIサポート**: OllamaとLM Studioの両方に対応
- 🎨 **可愛いUI**: パステルカラーと楽しいアニメーションで親しみやすいデザイン
- 📝 **フォント選択**: 6種類のフォントから好みに合わせて選択可能
- 💬 **リアルタイムチャット**: スムーズなメッセージ送受信と履歴表示
- 📱 **レスポンシブ**: モバイルからデスクトップまで対応

## 🚀 クイックスタート

### 前提条件

- Node.js 20.x以上
- 以下のいずれかのAIランタイム:
  - [Ollama](https://ollama.ai/) (ポート11434)
  - [LM Studio](https://lmstudio.ai/) (ポート1234)

### インストール

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/yourusername/local-ai-chat.git
   cd local-ai-chat
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

4. **ブラウザでアクセス**
   ```
   http://localhost:5000
   ```

## 🔧 使い方

### AIランタイムの設定

#### Ollama使用時
```bash
# Ollamaをインストール
curl -fsSL https://ollama.ai/install.sh | sh

# モデルをダウンロード（例：llama3）
ollama pull llama3
```

#### LM Studio使用時
1. [LM Studio](https://lmstudio.ai/)をダウンロード・インストール
2. お好みのモデルをダウンロード
3. ローカルサーバーを起動（ポート1234）

### アプリケーションの使用方法

1. **モード選択**: ヘッダーでOllamaまたはLM Studioを選択
2. **モデル選択**: 利用可能なモデルから選択
3. **フォント選択**: お好みのフォントを選択
4. **チャット開始**: メッセージを入力して会話開始

## 🎨 カスタマイズ

### フォント設定
以下のフォントから選択可能:
- Inter
- Noto Sans JP
- Roboto
- Lato
- Open Sans
- Source Code Pro

### テーマカラー
可愛らしいパステルカラーテーマ:
- メインカラー: ピンク系
- アクセント: パープル、ブルー、イエロー
- グラデーション効果とアニメーション

## 🛠️ 技術スタック

### フロントエンド
- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite** - 高速ビルドツール
- **Tailwind CSS** - ユーティリティファーストCSS
- **Radix UI** - アクセシブルUIコンポーネント
- **TanStack Query** - サーバーステート管理
- **Wouter** - 軽量ルーティング

### バックエンド
- **Node.js** - ランタイム
- **Express.js** - Webフレームワーク
- **TypeScript** - 型安全性
- **Drizzle ORM** - 型安全なORM
- **PostgreSQL** - データベース

### 開発・テストツール
- **Vitest** - テストフレームワーク
- **React Testing Library** - コンポーネントテスト
- **ESLint** - コード品質
- **Prettier** - コードフォーマット
- **Vite HMR** - ホットリロード

## 📁 プロジェクト構成

```
local-ai-chat/
├── client/                 # フロントエンドアプリケーション
│   ├── src/
│   │   ├── components/     # UIコンポーネント
│   │   ├── pages/          # ページコンポーネント
│   │   ├── hooks/          # カスタムフック
│   │   ├── lib/            # ユーティリティ
│   │   └── test/           # フロントエンドテスト
├── server/                 # バックエンドアプリケーション
│   ├── index.ts           # サーバーエントリーポイント
│   ├── routes.ts          # APIルート
│   ├── storage.ts         # データストレージ
│   └── test/              # バックエンドテスト
├── shared/                 # 共有型定義
│   └── schema.ts          # データベーススキーマ
├── docs/                   # プロジェクト文書
│   ├── API.md             # API仕様書
│   └── TESTING.md         # テスト文書
├── vitest.config.ts       # テスト設定
└── components.json        # shadcn/ui設定
```

## 🧪 テスト

### テストの実行
```bash
# 全テストを実行
npx vitest run

# ウォッチモードでテスト実行
npx vitest

# UIモードでテスト実行
npx vitest --ui
```

### テストカバレッジ
- **フロントエンド**: ChatMessage、ChatInput、FontSelectorコンポーネント
- **バックエンド**: 全APIエンドポイントとエラーハンドリング
- **データ**: ストレージのCRUD操作
- **統合**: AI API連携テスト

## 🔌 API仕様

### チャットAPI
- `GET /api/messages` - メッセージ履歴取得
- `POST /api/chat` - メッセージ送信
- `GET /api/models/:mode` - 利用可能モデル取得
- `GET /api/settings` - 設定取得
- `POST /api/settings` - 設定更新

### 対応AIランタイム
- **Ollama API**: `http://localhost:11434`
- **LM Studio API**: `http://localhost:1234`

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📝 ライセンス

このプロジェクトは [MIT License](LICENSE) の下で公開されています。

## 🙏 謝辞

- [Ollama](https://ollama.ai/) - ローカルAIランタイム
- [LM Studio](https://lmstudio.ai/) - ローカルAIランタイム
- [Radix UI](https://www.radix-ui.com/) - アクセシブルUIコンポーネント
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
