import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function main(){
    try{
        await prisma.$connect();
    } catch(err){
        return Error("DB接続に失敗しました");
    }
}

//レート更新のための関数
export function calculateRate(numBook: number,currRate: number,newRate: number){
    let calculatedRate: number = (numBook * currRate + newRate) / (numBook + 1);
    return calculatedRate;
};


//本をbookとuserbooksに登録する
export const POST = async (req: NextRequest, res: NextResponse) => {
    try {

        await main();

        const { title, author, picture_url, rating, user_name } = await req.json();
        const user = await prisma.user.findFirst({ where: { name: user_name } });

        const userId = user?.id;

        let book = await prisma.book.findFirst({
            where:{
                title: title,
                author: author,
                picture_url: picture_url,
            },
        });

        //  初めてその本が読まれた時
        if(!book){
            book = await prisma.book.create({
                data: {
                    title: title,
                    author: author,
                    picture_url: picture_url,
                    overall_rate: rating,
                    yearly_rate: rating,
                    monthly_rate: rating,
                    read_count: 1,
                    yearly_count: 1,
                    monthly_count: 1,
                },
            });
        }else{
            await prisma.book.update({
                where: {
                    id: book.id,
                },
                data: {
                    read_count: { increment: 1 },
                    yearly_count: { increment: 1 },
                    monthly_count: { increment: 1 },
                    overall_rate: calculateRate(book.read_count,book.overall_rate,rating),
                    yearly_rate: calculateRate(book.yearly_count,book.yearly_rate,rating),
                    monthly_rate: calculateRate(book.monthly_count,book.monthly_rate,rating) },
            });
        }

        // ユーザーが本を読んだ冊数を更新
        await prisma.user.update({
            where: { id: userId },
            data: { number_book: { increment: 1 } },
        });

        //普通の登録ボタンで登録した場合
        const userBook = await prisma.userbooks.create({
            data: {
                user: {
                    connect: { id: userId },
                },
                book: {
                    connect: { id: book?.id, title: title, author: author, picture_url: picture_url }
                },
                user_rate: rating,
                finish: true,
                favorite: false,
                finish_date: new Date(),
            },
        });
        return NextResponse.json({ message: "Success", userBook }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    } finally{
        await prisma.$disconnect();
    }
};