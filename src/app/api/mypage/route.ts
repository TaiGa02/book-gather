import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export const GET = async (req: Request, res: NextResponse) => {
    try {
        await prisma.$connect();
        const user_name = req.headers.get("User-Name");
        if (!user_name) {
            return NextResponse.json({ message: "Error", err: "User name is missing" }, { status: 400 });
        }
        const user = await prisma.user.findFirst({ where: { name: user_name } });

        const userId = user?.id;
        const books = await prisma.book.findMany({ 
            where: { 
                users: {
                    some: {
                        user_id: userId,
                    },
                },
            },
        });
        const favBooks = await prisma.book.findMany({
            where: {
                users: {
                    some: {
                        user_id: userId,
                        favorite: true,
                    }
                }
            }
        });

        const wantreadbooks = await prisma.wantreadbooks.findMany({ where: { user_id: userId } });
        return NextResponse.json({ message: "Success", books,favBooks,wantreadbooks,user }, {status: 200});


    } catch(err){
        return NextResponse.json({ message: "Error", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
};