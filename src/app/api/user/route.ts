import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();


export const POST = async (req: Request, res: NextResponse) => {
    try {
        const { username, password } = await req.json();

        await prisma.$connect();

        const user = await prisma.user.findFirst({
            where: {
                name: username,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "登録されていない名前です" }, { status: 400 });
        }

        const validPassword = user.password === password;

        if (!validPassword) {
            return NextResponse.json({ message: "パスワードが違います" }, { status: 400 });
        }

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: "Eroor" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};
