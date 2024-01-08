# 読書管理サイト

# 仕様
・ログイン機能　　
・本を検索(楽天のapiを使う)　　
・読んだ本、読みたい本に追加　　
・読み終わった際はレーティングする　　
・全ユーザーの読んだ、読みたい本の注目度で全期間、年間、月間でのランキングを出す　　
・ログインせずゲスト状態だとランキングだけ見れる　　

# 仕様予定技術
・next.js　　
・Supabase　　
・prisma　　
・typescript　　

# スキーマ設定
```
model User {
  id Int @id @default(autoincrement()) //ユーザーのID
  name String @unique //ユーザーネーム（重複は無いようにunique、ログイン時に使用、サインアップ時に登録してもらう）
  password String //パスワード（ログイン時に使用、サインアップ時に登録してもらう）
  number_book Int @default(0)//各ユーザーのそれぞれの本の読んだ冊数

  books Userbooks[]//各ユーザーの読んだ本の情報
}

model Book {
  id Int @id @default(autoincrement())//本のID（誰かに検索されて、wantかfinishに登録された際に本のデータ作成が発生）
  title String// 本のタイトル
  author String//本の著者
  picture_url String//本の画像
  overall_rate Float @default(0)//全期間の評価の平均
  yearly_rate Float @default(0)//年間のレート（年が変わるとクリーン、０となる）
  monthly_rate Float @default(0)//月間のレート（月が替わるとクリーン、０となる）
  read_count Int @default(0)//全期間で読まれた数
  yearly_count Int @default(0)//年間の読まれた数
  monthly_count Int @default(0)//月間の読まれた数

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
  want Boolean//今後読みたいかどうか
  favorite Boolean//お気に入り
  finish_date DateTime//読み終わった日付（全ユーザーのfinishから全期間、年間、月間のランキングをつける際に利用する）
}
```
