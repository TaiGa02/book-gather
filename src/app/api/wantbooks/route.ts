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

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        
        await main();
        //フロントから情報を受け取る
        const { title, author, picture_url, user_name } = await req.json();
        //userをさがしuserIdを獲得する
        const user = await prisma.user.findFirst({ where: { name: user_name } });
        const userId = user?.id;
        //本を探し、本のIDを獲得する
        const book = await prisma.book.findFirst({ where: { title: title, author: author, picture_url: picture_url} });
        const bookId = book?.id

        //userbookに既にあるか確認する
        const userbook = await prisma.userbooks.findFirst({ where: { user_id: userId, book_id: bookId} });
        
        //気になるリストに既にあるか確認する
        const wantbook = await prisma.wantreadbooks.findFirst({ where: { user_id: userId,title: title, author: author, picture_url: picture_url} });

        //気になるリストにないもしくは、既にその本を読んでいるときのメッセージ
        if(!wantbook || userbook){
            return NextResponse.json({ message: "Book not found or already read" }, { status: 404 });
        }

        //既に気になるリストに入っているか
        const hasData = Boolean(wantbook)
        //既に読んでいるか
        const alreadyRead = Boolean(userbook)
        return NextResponse.json({ message: "Success", hasData,alreadyRead }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    } finally{
        await prisma.$disconnect();
    }
    
};