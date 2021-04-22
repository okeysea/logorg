# LogOrg

## 概要

 マークダウンで投稿できるメディアサービスです

## デモ

  AWSにて構築しました

  - [www.logorg.work](https://www.logorg.work/)

### インフラの構成

![logorg_infra](https://user-images.githubusercontent.com/67820904/115724943-5f1f5480-a3bc-11eb-80bf-779631d5ab18.png)

※ メールリレーは、ドメインを取得したところでメールアドレスがタダでもらえて、提供されているSMTPサーバーをお高いNAT Gatewayを回避しつつ使うために追加しました


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
  - postfix (NATGatewayを使わずに外部SMTPサーバへのメールリレー用)

- 開発環境
  - Windows Subsystem Linux 2 (Ubuntu)
  - Docker
  - docker-compose

- デモ環境
  - インフラ(主要なもの)
    - APP
      - AWS ECS (Fargate)
      - AWS RDS (MySQL)
    - CDN
      - AWS CloudFront
      - AWS S3

## 工夫した点

### 2ペインリアルタイムプレビュー機能付きエディタの実装
  
  ![iwe](https://user-images.githubusercontent.com/67820904/115322669-8958f280-a1c1-11eb-9a22-dd5b62a261c0.gif)

  
  React, エディタ部分にはCodemirrorを利用して実装しています。なお、Codemirrorは装飾できるTextareaみたいな立ち位置での実装になっており
  ほとんどの機能を活用できていないので、今後の課題です。

### Reactの導入(gem react-rails)

  エディタを作るにあたって生DOMを操作するのは辛いのでReactを導入しました。
  使っていくうちに、これは便利だということでUIの一部をReact化しました。
  
### ちょっとリッチな検索機能の実装(gem ransack)

  ![search](https://user-images.githubusercontent.com/67820904/115323896-e5247b00-a1c3-11eb-93b6-6da559e52592.gif)

  ransackによる検索機能の実装のほか、検索結果のハイライト機能(正規表現、rails highligter)を実装しました。
  検索フォームはReactで、検索結果はRails viewによる実装です。

### ページネーション(gem kaminari)

 ![pagenation](https://user-images.githubusercontent.com/67820904/115324115-46e4e500-a1c4-11eb-829d-c7daf02e8e1a.gif)

  ページネーションはgem kaminariにて実装しています。
  
### アバターピッカーUIの実装

  ![avatar_picker](https://user-images.githubusercontent.com/67820904/115270748-9a7d1180-a177-11eb-99ec-3e86c6f28ce4.gif)

  よくみかけるアバターのクロップUIをつけてみたかったので、Canvasにより実装しました。
  サーバーへはDataURLによりPostしているので、バリデーション前に変換を行い、gem CarrierWaveへ渡しています。

### APIの導入

  Reactを導入したものの、Railsの各コントローラのCURDを叩くのが辛かったので一部の機能のAPIを用意しました。
  設計はRESTを参考にして、外部に公開する予定はないのでログイン機構は通常のクッキー&セッション方式を流用しています。

### フロントAPIクラスの作成

  Fetch APIを各箇所で直接呼ぶのは仕様変更時にめんどくさいので、APIを一元処理するラッパーを作って比較的楽に拡張等ができるようにしました。
  Railsのmodel単位で扱えるようにしています。

### フロントAPI ユーザーのキャッシュの実装

  リスト表示等で同じユーザーの情報が多数必要な場合、各コンポーネントでキャッシュを実装するのは煩雑なので、
  APIのラッパーにおいて透過的なキャッシュ機構を実装してサーバーの負荷低減を図っています。
  TurbolinksにのっかっていることによりSPA化しているので、ページ遷移後でもキャッシュが効ききます。

### パーサをWebAssemblyにする(gem wasmer)

  サーバーサイドでフロントでのマークダウンプレビューと出力結果を同じにするために、WebAssemblyを使っています。
  そのWebAssemblyへのコンパイルが簡単そうだったRustも導入しました。WebAssembly化は簡単だけど、Rust自体は超重量級だったので苦労しました。
  なお、パーサーは別のプロジェクトとして切り出して、こちらではnpm packageとしてインストールする運用にしています。
  - [orgmd_parser](https://github.com/okeysea/orgmd_parser)


### Terraform によるインフラのコード管理

  マネジメントコンソールでぽちぽち頑張っていましたが、トライ&エラーが重なると辛かったので、
  Terraformを導入しました。非常に楽チンです。

### CDNを導入

  画像等のリソースを配信するためのサーバーをCloudFront + S3にて構築しました。
  S3へのアップロードはfog_awsとCarrierWave gemで行っています。


## 苦労したこと

### Markdown パーサを自作したこと(失敗)

  開発時間の半分以上はRustとの取っ組み合いに消費してしまいました。ポートフォリオという点では全く本質的ではない箇所に
  注力してしまったので、反省しています。出発点は自分で使いたいという理由なので、今後もオレオレ構文&機能を目指して開発は継続する予定です。

### Docker Volumeのパーミッション問題

  開発環境はWSL2上のUbuntu内でDockerを使用しています。Docker内で生成されたvolume上のファイルをホスト側(Ubuntu)で編集するために
  パーミッションをごちゃごちゃ操作しているのですが、それが原因と思われる数々のよくわからないエラーに悩まされました。
