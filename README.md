# SAUNA BASE

「あなたのととのいを点数化するアプリ」。サウナ体験を記録・可視化・最適化するライフログWebアプリ。

## 基本情報

| 項目 | 値 |
|------|----|
| ローカルパス | `/Users/yukiota/Desktop/Clans Quest Project/sauna-base` |
| デプロイ | 未設定（Vercel連携予定） |

## 技術スタック

- Next.js 16 (App Router + TypeScript)
- Tailwind CSS v4
- recharts（グラフ）
- lucide-react（アイコン）
- Supabase（将来連携予定）

## ローカル起動

```bash
cd sauna-base
npm install
npm run dev
# http://localhost:3000
```

## ページ構成

| パス | 概要 |
|------|------|
| `/` | ダッシュボード（スコア・統計・カレンダー・AI） |
| `/record` | サウナ記録フォーム |
| `/calendar` | カレンダー |
| `/stats` | 統計・記録一覧 |
| `/ai` | AIレコメンド（ルールベース） |
| `/profile` | サウナプロファイル |

## ととのいスコア仕様

最大50点（各項目1〜5点 × 重み2）

| 項目 | 基準 |
|------|------|
| セット数 | 1セット=1pt〜5セット以上=5pt |
| サウナ温度 | 80℃=1pt〜100℃以上=5pt |
| 水風呂温度 | 20℃以上=1pt〜14℃以下=5pt |
| 休憩スタイル | なし=1pt〜外気浴=5pt |
| 主観評価 | 1〜5pt（そのまま） |

## コンポーネント

| コンポーネント | 役割 |
|---|---|
| `GlassCard` | Glassmorphism基盤カード |
| `ScoreCircle` | ととのいスコア円形ゲージ |
| `StatCard` | 統計カード |
| `Sidebar` | PC左ナビ |
| `BottomNavigation` | スマホ下部ナビ |
| `SaunaCalendar` | 月別カレンダー |
| `SaunaRecordCard` | 記録リスト |
| `ScoreTrendChart` | スコア推移グラフ（recharts） |
| `AIRecommendCard` | AIレコメンドカード |
| `SaunaProfileCard` | プロファイルレーダーチャート |
| `RecordForm` | 記録入力フォーム |

## デザインテーマ

- 深いフォレストグリーン背景（#0a1a08）
- Glassmorphism（backdrop-blur + 半透明ボーダー）
- ウグイス色アクセント（#7cb342 / #a5d63a）
- 柔らかいグロー・影・奥行き

## 残タスク（MVP後）

- [ ] Supabase 連携（記録の永続化）
- [ ] ログイン・認証
- [ ] PWA化（manifest + Service Worker）
- [ ] サウナ検索ページ
- [ ] 設定ページ
- [ ] Vercelデプロイ
