# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

StudyTrack Frontend — Next.js 16、React 19、TypeScript、Tailwind CSS v4 で構築された学習進捗管理Webアプリ。API仕様は `docs/openapi.yaml` を参照。

## コマンド

- `npm run dev` — 開発サーバー起動
- `npm run build` — 本番ビルド
- `npm run lint` — ESLint実行（未使用importチェック含む）
- `npx prettier --check .` — フォーマットチェック
- `npx prettier --write .` — 自動フォーマット

- `npm test` — テスト実行（Vitest）
- `npm run test:watch` — テストをウォッチモードで実行
- `npm run test:coverage` — カバレッジ付きテスト実行

## アーキテクチャ

- **Next.js App Router** — ページ・レイアウトは `src/app/` 配下
- **React Compiler** が `next.config.ts` で有効化済み（`reactCompiler: true`）
- **パスエイリアス**: `@/*` は `./src/*` に対応

## コードスタイル・規約

- **セミコロンなし**、シングルクォート、末尾カンマあり、1行90文字（`.prettierrc`）
- **import順序**（Prettierプラグインで自動ソート）: `react` → `next` → サードパーティ → `@/` エイリアス → 相対パス
- **未使用import** はエラー（`eslint-plugin-unused-imports` で自動修正）、`_` 始まりの未使用変数は許可
- **CSSユーティリティ**: 条件付きクラスには `clsx`、Tailwindクラスのマージには `twMerge` を使用（どちらもPrettier設定で `tailwindFunctions` に登録済み）
- **Tailwind CSS v4**（PostCSS経由）— ダークモードは `prefers-color-scheme` を使用
- **フォント**: Geist (sans) と Geist Mono を `next/font/google` で読み込み、CSS変数 `--font-geist-sans` / `--font-geist-mono` として適用

## コミット規約

- **Conventional Commits** 形式: `<type>: <説明>` （日本語で記述）
- 使用可能なプリフィックス:
    - `feat`: 新機能
    - `fix`: バグ修正
    - `docs`: ドキュメントのみの変更
    - `style`: コードの意味に影響しない変更（空白、フォーマット等）
    - `refactor`: バグ修正でも機能追加でもないコード変更
    - `perf`: パフォーマンス改善
    - `test`: テストの追加・修正
    - `build`: ビルドシステムや外部依存に関する変更
    - `ci`: CI設定ファイルやスクリプトの変更
    - `chore`: その他の雑務（src・testに影響しない変更）
    - `revert`: 以前のコミットの取り消し

## テスト規約

- **Vitest + React Testing Library** を使用
- テストファイルはソースと同じディレクトリに `*.test.tsx` として配置（コロケーション）
- `globals: true` により `describe`/`it`/`expect`/`vi` はインポート不要
- `screen` クエリを優先使用
