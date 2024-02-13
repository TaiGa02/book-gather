import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET =async (req: Request, res: NextResponse) => {
    try {
        await prisma.$connect();

        const allBooks = await prisma.book.findMany();
        const monthlyBooks = await prisma.book.findMany({
            where: {
                monthly_count:{
                    gt:0
                }
            }
        });

        const yearlyBooks = await prisma.book.findMany({
            where: {
                yearly_count: {
                    gt: 0
                }
            }
        });

        return NextResponse.json({ message: "Success", allBooks, monthlyBooks, yearlyBooks }, {status: 200});
        
    } catch(err){
        return NextResponse.json({ message: "Error", err}, {status: 500});
    } finally {
        await prisma.$disconnect();
    }
    
}