# Project LLMeta サーバー

Project LLMeta のバックエンドを担う Colyseus サーバーです。プレイヤーの位置や回転など、メタバースのリアルタイムな状態同期を管理します。

## 技術スタック

- **フレームワーク:** [Colyseus](https://www.colyseus.io/)
- **言語:** [TypeScript](https://www.typescriptlang.org/)

## 実行方法

1.  依存関係をインストールします。
    ```bash
    npm install
    ```

2.  サーバーを起動します。
    ```bash
    npm start
    ```

サーバーはデフォルトで `ws://localhost:2567` でリクエストを待ち受けます。

## ディレクトリ構成

- **`src/index.ts`**: メインエントリポイント。ルームハンドラの登録などを行います。
- **`src/rooms/MyRoom.ts`**: ゲームロジックを実装するルームハンドラ。
- **`src/rooms/schema/MyRoomState.ts`**: ルームの状態を定義するスキーマ。
- **`loadtest/example.ts`**: 負荷テスト用のクライアントスクリプト。