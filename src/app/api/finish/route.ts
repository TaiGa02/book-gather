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
        }

        // ユーザーが本を読んだ冊数を更新
        await prisma.user.update({
            where: { id: userId },
            data: { number_book: { increment: 1 } },
        });

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