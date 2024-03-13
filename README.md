# 読書管理サイト

https://book-gather.vercel.app/

# 仕様
- ログイン機能
- 本を検索(楽天のapiを使う)
- 読んだ本、読みたい本に追加
- 読み終わった際はレーティングする
- 全ユーザーの読んだ、読みたい本の注目度で全期間、年間、月間でのランキングを出す
- ログインせずゲスト状態だとランキングだけ見れる

### 初期画面
<img width="1127" alt="スクリーンショット 2024-03-12 212233" src="https://github.com/TaiGa02/book-gather/assets/135023031/bd78cee3-fedd-4060-9dd2-987843581a6e">
<img width="1128" alt="スクリーンショット 2024-03-12 212251" src="https://github.com/TaiGa02/book-gather/assets/135023031/5fd76d93-a89f-4efd-9159-ce61c82deba0">
<img width="1128" alt="スクリーンショット 2024-03-12 212305" src="https://github.com/TaiGa02/book-gather/assets/135023031/5d75875b-b95d-47b3-aefd-d67fa29347ef">

- ログイン、サインアップで新規登録もしくはゲストとしてホームに入場可能
- ゲストで入ると一部機能の制限あり
- 本の登録やマイページへの入場が出来ない

### ホーム
<img width="1101" alt="スクリーンショット 2024-03-12 212346" src="https://github.com/TaiGa02/book-gather/assets/135023031/e719b72d-ea12-43fc-b214-d5f1bff6a5f6">
<img width="1109" alt="スクリーンショット 2024-03-12 212358" src="https://github.com/TaiGa02/book-gather/assets/135023031/a3fab08f-b1d6-4acc-88d9-786ebb8747d3">

- ホームでは全ユーザーの期間別の本のランキングを見ることが出来る。
- この画面から参考に読みたい本を探して登録することが可能

### マイページ
<img width="1094" alt="スクリーンショット 2024-03-12 212420" src="https://github.com/TaiGa02/book-gather/assets/135023031/433edc5c-12a6-488e-9a47-ba13a1b03965">

- マイページでは自分が読んだ本、お気に入り、気になる本を見ることが出来る

### 検索
<img width="1127" alt="スクリーンショット 2024-03-12 212453" src="https://github.com/TaiGa02/book-gather/assets/135023031/5ce88916-853b-457d-b664-f43e79d0f1b4">

- 検索欄に本の名前を打ち検索することで本の検索が可能
- 楽天apiの仕様により30冊まで表示可能

### 本登録
<img width="1112" alt="スクリーンショット 2024-03-12 212511" src="https://github.com/TaiGa02/book-gather/assets/135023031/54b40819-e131-42dc-b8d3-115fe4f236e6">
<img width="1112" alt="スクリーンショット 2024-03-12 212542" src="https://github.com/TaiGa02/book-gather/assets/135023031/52f563ae-fdd1-4d1b-ba8f-e66e200d5964">

- レートを設定して本をお気に入りか普通に読んだか登録が可能
- 登録が終わるとホームに戻りランキングの更新を見ることが出来る


# 仕様予定技術
- next.js
- Supabase
- prisma
- typescript　　

# スキーマ設定
```
model User {
  id Int @id @default(autoincrement()) //ユーザーのID
  name String @unique //ユーザーネーム（重複は無いようにunique、ログイン時に使用、サインアップ時に登録してもらう）
  password String //パスワード（ログイン時に使用、サインアップ時に登録してもらう）
  number_book Int @default(0)//各ユーザーのそれぞれの本の読んだ冊数

  books Userbooks[]//各ユーザーの読んだ本の情報
  wantbooks Wantreadbooks[]//各ユーザーの気になる本
}

model Book {
  id Int @id @default(autoincrement())//本のID（誰かに検索されて、wantかfinishに登録された際に本のデータ作成が発生）
  title String// 本のタイトル
  author String//本の著者
  picture_url String//本の画像
  overall_rate Float//全期間の評価の平均
  yearly_rate Float//年間のレート（年が変わるとクリーン、０となる）
  monthly_rate Float//月間のレート（月が替わるとクリーン、０となる）
  read_count Int//全期間で読まれた数
  yearly_count Int//年間の読まれた数
  monthly_count Int//月間の読まれた数

  users Userbooks[]
}

model Userbooks {
  id Int @id @default(autoincrement())//主キー
  user User @relation(fields: [user_id], references: [id])
  user_id Int //あるユーザーに関してのデータ

  book Book @relation(fields: [book_id], references: [id])
  book_id Int//ある本に関してのデータ

  user_rate Int//１ユーザーのつけた評価
  finish Boolean//本を読み終えたかどうか
  favorite Boolean//お気に入り
  finish_date DateTime? //読み終わった日付（全ユーザーのfinishから全期間、年間、月間のランキングをつける際に利用する）
}

model Wantreadbooks {
  id Int @id @default(autoincrement())//主キー
  user User @relation(fields: [user_id], references: [id])
  user_id Int//あるユーザーに関してのデータ
  

  title String// 本のタイトル
  author String//本の著者
  picture_url String//本の画像
}
```
