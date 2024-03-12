import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST =async (req: Request, res: NextResponse) => {
    try {
        await prisma.$connect();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentDayOfMonth = currentDate.getDate();

        if(currentMonth === 0 && currentDayOfMonth === 1){
            await prisma.book.updateMany({
                data:{
                    yearly_count:0,
                    yearly_rate:0
                }
            });

            console.log("Yearly count reset successfully!");
        }

        if(currentDayOfMonth === 1){
            await prisma.book.updateMany({
                data:{
                    monthly_count:0,
                    monthly_rate:0
                }
            });

            console.log("Monthly count reset successfully!");
        }


        return NextResponse.json({ message: "Success" }, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};

export const revalidate = 0;