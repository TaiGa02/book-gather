import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        await prisma.$connect();
        const { username, password } = await req.json();

        const isExist = await prisma.user.findFirst({
            where: {
                name: username,
            },
        });

        if (isExist) {
            return NextResponse.json({ message: "その名前は既に登録されています" }, { status: 400 }); // Use a 400 status for client errors
        }

        const user = await prisma.user.create({
            data: {
                name: username,
                password: password,
            },
        });

        return NextResponse.json({ message: "登録に成功しました", user }, { status: 201 });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return NextResponse.json({ message: "エラーが発生しました。後ほどもう一度試してください" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};