# DFK Market Hunter

Harmony ONEネットワーク上のDeFi Kingdoms（DFK）マーケットプレイス向けの自動ヒーロースナイピングボットです。このボットはヒーローオークションマーケットプレイスをリアルタイムで監視し、特定の価格条件を満たすヒーローを自動的に購入します。

## 機能

- ペンディングトランザクションスキャンによるリアルタイムオークション監視
- 割安なヒーローへの自動入札
- Gen0ヒーロー（ID <= 2071）の特別処理と個別価格閾値
- ヒーロータイプ別の設定可能な価格閾値
- 設定可能なブースト乗数によるガス価格最適化
- 重複入札の防止
- すべての入札試行と結果の詳細ログ記録

## 前提条件

- Node.js（v14以上）
- YarnまたはNPM
- 入札用のJEWELトークンを持つHarmony ONEウォレット
- HarmonyネットワークへのRPCエンドポイントアクセス

## インストール

```bash
# リポジトリをクローン
git clone <repository-url>
cd dfk-market-hunter

# 依存関係をインストール
yarn install
# または
npm install
```

## 設定

ルートディレクトリに以下の環境変数を含む`.env`ファイルを作成してください：

```env
# 必須
PK=your_private_key_here
RPC=https://api.harmony.one

# オプション
RPC_WSS=wss://ws.api.harmony.one
PROVIDER=http
bidPrice=15
bidPriceGen0=200
GAS_BOOST=10
GAS_LIMIT=500000
```

### 環境変数

| 変数 | 必須 | デフォルト | 説明 |
|----------|----------|---------|-------------|
| `PK` | はい | - | Harmonyウォレットの秘密鍵 |
| `RPC` | はい | - | HTTP RPCエンドポイントURL |
| `RPC_WSS` | いいえ | `''` | WebSocket RPCエンドポイント（オプション） |
| `PROVIDER` | いいえ | `'http'` | プロバイダーモード（`http`または`wss`） |
| `bidPrice` | いいえ | `15` | 通常のヒーローへの自動入札最大価格（JEWEL単位） |
| `bidPriceGen0` | いいえ | `200` | Gen0ヒーローへの自動入札最大価格（JEWEL単位） |
| `GAS_BOOST` | いいえ | `10` | より速いトランザクションのためのガス価格乗数 |
| `GAS_LIMIT` | いいえ | `500000` | トランザクションごとの最大ガスリミット |

## 使用方法

### ボットの起動

```bash
yarn start
# または
npm start
```

### 開発モード

```bash
yarn dev
# または
npm run dev
```

### ビルド

```bash
yarn build
# または
npm run build
```

## 動作の仕組み

1. ボットは設定されたRPCエンドポイント経由でHarmonyネットワークに接続します
2. `createAuction`関数呼び出しのペンディングトランザクションを監視します
3. 新しいヒーローがオークションに出品されると、ボットは以下をチェックします：
   - ヒーローがGen0（ID <= 2071）の場合、価格を`bidPriceGen0`と比較
   - それ以外の場合、価格を`bidPrice`と比較
4. 価格が閾値を下回る場合、ボットは自動的に入札を行います
5. トランザクション確認を保証するために最適化されたガス設定を使用します
6. すべての入札試行と結果を`bid.log`に記録します

## プロジェクト構造

```
dfk-market-hunter/
├── src/
│   ├── main.ts                 # エントリーポイント
│   ├── app/
│   │   ├── marketHunter.ts     # V1マーケットハンター
│   │   └── marketHunterV2.ts   # V2マーケットハンター（アクティブ）
│   ├── contracts/dfk/
│   │   ├── auction.ts          # オークションコントラクト連携
│   │   └── hero.ts             # ヒーローコントラクト連携
│   ├── tokens/
│   │   ├── dfk.ts              # DFK固有のトークン
│   │   └── erc20.ts            # 汎用ERC20ユーティリティ
│   ├── util/
│   │   └── performance.ts      # パフォーマンスユーティリティ
│   └── wallet/
│       └── index.ts            # ウォレット管理
├── package.json
├── tsconfig.json
└── .env                        # 設定ファイル（リポジトリには含まれません）
```

## 主要なコントラクトアドレス

| コントラクト | アドレス |
|----------|---------|
| Hero Auction | `0x13a65B9F8039E2c032Bc022171Dc05B30c3f2892` |
| Hero NFT | `0x5f753dcdf9b1ad9aabc1346614d1f4746fd6ce5c` |
| JEWEL Token | `0x72cb10c6bfa5624dd07ef608027e366bd690048f` |

## 免責事項

このボットは教育および個人使用目的で現状のまま提供されています。使用は自己責任でお願いします。著者はこのソフトウェアの使用中に発生したいかなる損失についても責任を負いません。常に自動取引に関わるリスクを理解し、失っても良い資金のみを使用してください。これは金融アドバイスではありません。

## ライセンス

MIT
