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
            return Error("既に登録されている名前です");
        }

        const user = await prisma.user.create({
            data: {
                name: username,
                password: password,
            }
        });

        return NextResponse.json({ message: "Success", user }, {status: 201});
    } catch (err) {
        return NextResponse.json({ message: "Eroor"}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
};
