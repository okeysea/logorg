# LogOrg

## 概要

 マークダウンで投稿できるメディアサービスです

## デモ

 現在デプロイの準備中です

## 制作した動機

 エンジニアになるにあたって、日々の細々としたメモから研究、はては文芸まで多彩にこなせるエディタ実装がほしいな、
と思って探してみたものの、コレ！というものが見付からず自分で作ってみるかというのが動機です。

## 使用した技術など

- バックエンド
  - Ruby on Rails 6
    - Ruby
      - wasmer
    - テスト
      - RSpec
- フロントエンド
  - Typescript
  - WebAssembly
  - Fetch API
  - React
  - テスト
    - jest
    - enzyme
    - React Testing Library
  - マークアップ/スタイリング
    - slim
    - sass
- 共通(Markdown Parser)
  - WebAssembly
    - Rust
      - nom
- アプリケーション
  - nginx
  - mysql

- 開発環境
  - Windows Subsystem Linux 2 (Ubuntu)
  - Docker
  - docker-compose

- デモ環境
  - インフラ(予定)
    - AWS ECS (Fargate)
    - AWS RDS (MySQL)

## 工夫した点

### Reactの導入

  エディタを作るにあたって生DOMを操作するのは辛いのでReactを導入しました。
  使っていくうちに、これは便利だということでUIの一部をReact化しました。

### APIの導入

  Reactを導入したものの、Railsの各コントローラのCURDを叩くのが辛かったので別途APIを用意してFetch APIで操作できるように
途中で方針を変更しました。

### フロントAPIクラスの作成

  Fetch APIを各箇所で直接呼ぶのは仕様変更時にめんどくさいので、APIを一元処理するラッパーを作って比較的楽に拡張等ができるようにしました。
  Railsのmodel単位で扱えるようにしています。

### パーサをWebAssemblyにする

  サーバーサイドでフロントでのマークダウンプレビューと出力結果を同じにするために、WebAssemblyを使っています。
  そのWebAssemblyへのコンパイルが簡単そうだったRustも導入しました。WebAssembly化は簡単だけど、Rust自体は超重量級だったので苦労しました。
  なお、パーサーは別のプロジェクトとして切り出して、こちらではnpm packageとしてインストールする運用にしています。
  - [orgmd_parser](https://github.com/okeysea/orgmd_parser)
