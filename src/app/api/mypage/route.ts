import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function main(){
    try {
        await prisma.$connect();
    } catch(err) {
        return Error("DB接続に失敗しました");
    }
}

export const GET = async (req: Request, res: NextResponse) => {
    try {
        await main();
        const user_name = req.headers.get("User-Name");
        if (!user_name) {
            return NextResponse.json({ message: "Error", err: "User name is missing" }, { status: 400 });
        }
        const user = await prisma.user.findFirst({ where: { name: user_name } });

        const userId = user?.id;

        const userbooks = await prisma.userbooks.findMany({ where: { user_id: userId } });
        const books = await prisma.book.findMany({ 
            where: { 
                users: {
                    some: {
                        user_id: userId,
                    },
                },
            },
        });
        const wantreadbooks = await prisma.wantreadbooks.findMany({ where: { user_id: userId } });
        return NextResponse.json({ message: "Success", books,userbooks,wantreadbooks }, {status: 200});


    } catch(err){
        return NextResponse.json({ message: "Error", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
};