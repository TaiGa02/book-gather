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
        const { title, author, picture_url, user_name } = await req.json();
        const user = await prisma.user.findFirst({ where: { name: user_name } });
        const userId = user?.id;

        const wantReadBook =  await prisma.wantreadbooks.create({
            data: {
                user: {
                    connect: { id: userId },
                },
                title: title,
                author: author,
                picture_url: picture_url,
            },
        });
        return NextResponse.json({ message: "Success", wantReadBook }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    } finally{
        await prisma.$disconnect();
    }
    
};