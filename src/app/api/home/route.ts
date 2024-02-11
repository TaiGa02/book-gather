import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET =async (req: Request, res: NextResponse) => {
    try {
        await prisma.$connect();
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();

        const allBooks = await prisma.book.findMany();

        return NextResponse.json({ message: "Success", allBooks }, {status: 200});
        
    } catch(err){
        return NextResponse.json({ message: "Error", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
    
}