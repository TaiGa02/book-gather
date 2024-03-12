import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();


export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        
        await prisma.$connect();
        const { title, author, picture_url, user_name } = await req.json();
        const user = await prisma.user.findFirst({ where: { name: user_name } });
        const userId = user?.id;
        const book = await prisma.book.findFirst({ where: { title: title, author: author, picture_url: picture_url} });
        const bookId = book?.id
        if (!book) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }
        const userBook = await prisma.userbooks.findFirst({ where: { user_id: userId, book_id: bookId } });
        if (userBook?.favorite){
            await prisma.userbooks.update({
                data: {favorite: false},
                where: { id:userBook.id }
            });
        }
        else{
            await prisma.userbooks.update({
                data: {favorite: true},
                where: { id:userBook?.id }
            });
        }
        return NextResponse.json({ message: "Success" }, { status: 201 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Error" }, { status: 500 });
    } finally{
        await prisma.$disconnect();
    }
    
};

export const revalidate = 0;