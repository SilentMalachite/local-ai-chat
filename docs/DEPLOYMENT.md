# デプロイメントガイド

## 概要

このドキュメントでは、ローカルAIチャットアプリケーションのデプロイメント方法について説明します。

## デプロイメント環境

### 開発環境
- **用途**: 機能開発・テスト
- **URL**: `http://localhost:5000`
- **起動**: `npm run dev`

### 本番環境
- **用途**: 実際の利用
- **ビルド**: `npm run build`
- **起動**: `npm run start`

## Replitでのデプロイ

### 自動デプロイ
Replitでは以下が自動的に設定されます：
- ポート5000での自動公開
- 環境変数の管理
- HTTPS証明書の自動取得
- カスタムドメインの設定

### 手動デプロイ手順
1. **ビルド実行**
   ```bash
   npm run build
   ```

2. **本番モード起動**
   ```bash
   npm run start
   ```

3. **デプロイ確認**
   - アプリケーションの動作確認
   - APIエンドポイントのテスト
   - フロントエンド機能のテスト

## 環境変数

### 必須環境変数
```bash
NODE_ENV=production
PORT=5000
```

### オプション環境変数
```bash
# AI サービス URL（デフォルト値使用可能）
OLLAMA_URL=http://localhost:11434
LMSTUDIO_URL=http://localhost:1234
```

## データベース設定

### 開発環境
- インメモリストレージを使用
- データは一時的で再起動時にリセット

### 本番環境（将来実装予定）
- PostgreSQL データベース
- データの永続化
- バックアップとリストア

## セキュリティ設定

### HTTPS設定
本番環境では必須：
```javascript
// server/index.ts での設定例
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || false,
    credentials: true
  }));
}
```

### CORS設定
```javascript
app.use(cors({
  origin: ['https://your-domain.com'],
  credentials: true,
  optionsSuccessStatus: 200
}));
```

## パフォーマンス最適化

### フロントエンド最適化
```bash
# バンドルサイズの確認
npm run build -- --mode=analyze

# 最適化ビルド
npm run build
```

### バックエンド最適化
- Express.js の圧縮ミドルウェア
- 静的ファイルのキャッシュ設定
- APIレスポンスの最適化

## 監視とログ

### アプリケーション監視
```javascript
// ヘルスチェックエンドポイント
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### ログ設定
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## バックアップとリストア

### データバックアップ（将来実装）
```bash
# データベースバックアップ
pg_dump $DATABASE_URL > backup.sql

# ファイルバックアップ
tar -czf backup.tar.gz ./data/
```

### リストア手順
```bash
# データベースリストア
psql $DATABASE_URL < backup.sql

# ファイルリストア
tar -xzf backup.tar.gz
```

## トラブルシューティング

### 一般的な問題

**ポート競合**
```bash
# ポート使用状況確認
lsof -i :5000

# プロセス終了
kill -9 <PID>
```

**依存関係の問題**
```bash
# キャッシュクリア
npm cache clean --force

# 再インストール
rm -rf node_modules package-lock.json
npm install
```

**AI サービス接続エラー**
```bash
# Ollama 起動確認
curl http://localhost:11434/api/tags

# LM Studio 起動確認
curl http://localhost:1234/v1/models
```

### ログの確認
```bash
# アプリケーションログ
tail -f combined.log

# エラーログ
tail -f error.log

# システムログ
journalctl -f -u your-app-name
```

## CI/CD パイプライン

### GitHub Actions 設定例
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Replit
        run: |
          # デプロイスクリプト実行
          ./deploy.sh
```

## スケーリング

### 水平スケーリング
- 複数インスタンスでの実行
- ロードバランサーの設定
- セッション管理の共有

### 垂直スケーリング
- CPUとメモリの増強
- データベース性能の向上
- ストレージ容量の拡張

## 災害復旧

### バックアップ戦略
- 日次自動バックアップ
- 異なる地域への複製
- 定期的なリストアテスト

### 復旧手順
1. システム状態の確認
2. バックアップからのリストア
3. サービスの段階的復旧
4. 動作確認とテスト

---

このガイドは継続的に更新され、新しいデプロイメント要件や最適化に対応していきます。