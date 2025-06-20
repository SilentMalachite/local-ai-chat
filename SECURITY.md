# セキュリティポリシー

## サポートされているバージョン

現在、以下のバージョンがセキュリティアップデートでサポートされています：

| バージョン | サポート状況 |
| ------- | ---------- |
| 1.0.x   | ✅ |
| < 1.0   | ❌ |

## 脆弱性の報告

セキュリティ脆弱性を発見した場合は、公開のissueではなく、以下の方法で責任ある開示をお願いします：

### 報告方法

1. **メール**: [security@yourproject.com] までご連絡ください
2. **暗号化**: GPGキーを使用した暗号化メッセージを推奨します

### 報告に含める情報

- 脆弱性の詳細な説明
- 再現手順
- 影響の範囲
- 提案される修正（可能な場合）

### レスポンス時間

- **初期確認**: 48時間以内
- **詳細な評価**: 7日以内
- **修正予定の連絡**: 14日以内

## セキュリティ対策

### 現在の実装

- **入力検証**: 全APIエンドポイントでのデータ検証
- **型安全性**: TypeScriptによる厳密な型チェック
- **依存関係管理**: 定期的な脆弱性スキャン
- **ローカル実行**: 外部サーバーへのデータ送信なし

### 推奨設定

#### 開発環境
```bash
# 依存関係の脆弱性チェック
npm audit

# 自動修正
npm audit fix
```

#### 本番環境
- HTTPS通信の強制
- 適切なCORSポリシー設定
- レート制限の実装
- ログ監視の設定

## 既知の制限事項

### ローカルAI統合
- OllamaやLM Studioとの通信は暗号化されていません
- ローカルネットワーク内でのHTTP通信を使用

### データストレージ
- 現在はメモリ内ストレージのみ
- データは永続化されません
- セッション間でのデータ保持なし

## セキュリティベストプラクティス

### 開発者向け

1. **コード審査**: 全ての変更に対してピアレビューを実施
2. **依存関係更新**: 定期的なパッケージ更新
3. **静的解析**: ESLintとTypeScriptによるコード品質チェック
4. **テスト**: セキュリティテストケースの追加

### ユーザー向け

1. **AI モデル**: 信頼できるソースからのモデルのみ使用
2. **ネットワーク**: ローカルネットワーク環境での使用を推奨
3. **アップデート**: 最新バージョンへの定期的な更新
4. **機密データ**: 機密情報を含む会話は避ける

## インシデント対応

### 重大度分類

- **Critical**: システム全体に影響する脆弱性
- **High**: データ漏洩の可能性がある脆弱性
- **Medium**: 機能に影響する脆弱性
- **Low**: 軽微な影響の脆弱性

### 対応手順

1. **検証**: 報告された脆弱性の確認
2. **評価**: 影響範囲とリスクレベルの評価
3. **修正**: パッチの開発とテスト
4. **リリース**: 緊急リリースまたは次期バージョンでの修正
5. **通知**: ユーザーおよびコミュニティへの通知

## コンプライアンス

### データプライバシー

- ユーザーデータはローカルに保持
- 外部サーバーへの送信なし
- GDPRおよび各国のプライバシー法に準拠

### オープンソースライセンス

- MITライセンスに基づく
- 全依存関係のライセンス確認済み
- 著作権とライセンス情報の適切な表示


---

私たちは責任ある脆弱性開示をサポートし、セキュリティ研究者の貢献に感謝しています。
