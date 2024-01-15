"use client";

import Link from "next/link";
import Image from 'next/image';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TabsProps {
    txcolor: string;
    bgcolor: string;
  };

interface Book {
    id: number;
    title: string;
    author: string;
    picture_url: string;
}

interface UserBook {
    id: number;
    book_id: number;
    favorite: boolean;
}

interface WantToReadBook {
    id: number;
    title: string;
    author: string;
    picture_url: string;
}

const Tabs : React.FC<TabsProps> = ({ txcolor,bgcolor }) => {
    let user_name: string = "guest";
    if (typeof window !== 'undefined' && localStorage.getItem("username")) {
        user_name = localStorage.getItem("username") ?? "guest";
    }
    const [openTab, setOpenTab] = useState(1);
    const [readBooks, setReadBooks] = useState<Book[]>([]);
    const [favoriteBooks, setFavoriteBooks] = useState<UserBook[]>([]);
    const [wantToReadBooks, setWantToReadBooks] = useState<WantToReadBook[]>([]);

    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/mypage", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Name": user_name,
            },
        });

            if(response.ok){
                const data = await response.json();
                console.log("Fetched data:", data);
                setReadBooks(data.books);
                setFavoriteBooks(data.userbooks.filter((book: UserBook) => book.favorite));
                console.log(data.userbooks.filter((book: UserBook) => book.favorite));
                setWantToReadBooks(data.wantreadbooks);
            } else {
                console.log("Failed to fetch data");
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBooks();
      }, []);
    
  
    return (
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist">
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
                  openTab === 1 ? `text-white ${bgcolor}` : `${txcolor} bg-white`
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                読んだ本
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
                  openTab === 2 ? `text-white ${bgcolor}` : `${txcolor} bg-white`
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                お気に入り
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={`text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ${
                  openTab === 3 ? `text-white ${bgcolor}` : `${txcolor} bg-white`
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                気になる、読みたい
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                    {/* ここに読んだ本のアイテムを設置　*/}
                    {readBooks.map((book) =>(
                        <div key={book.id}>
                            {book && (
                            <div>
                            <p>{book.title}</p>
                            <p>Author: {book.author}</p>
                            <img src={book.picture_url} alt={book.title} />
                            </div>
                        )}
                        </div>
                    ))}
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  {/* ここにお気に入り本のアイテムを設置　*/}
                  
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  {/* ここに読みたい本のアイテムを設置　*/}
                  {wantToReadBooks.map((wantToReadBook) => (
                    <div key={wantToReadBook.id}>
                        {wantToReadBook && (
                            <div>
                                <p>{wantToReadBook.title}</p>
                                <p>Author: {wantToReadBook.author}</p>
                                <img src={wantToReadBook.picture_url} alt={wantToReadBook.title} />
                                {/* Add other details you want to display */}
                            </div>
                        )}
                    </div>
                ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default function MyPage(){
    let user_name: string = "guest";
    if (typeof window !== 'undefined' && localStorage.getItem("username")) {
        user_name = localStorage.getItem("username") ?? "guest";
    }

    //console.log(user_name);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const router = useRouter();
    const [ keyword, setKeyword ] = useState("")

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/result?keyword=${keyword}`);
    };

    return (
        <>
            <nav className="bg-green-500 sticky top-0 z-50">
                <div className="mx-auto max-w-7xl px-2 md:px-6 lg:px-8">
                    <div className="relative flex h-16 items-center justify-between">
                        <div className="absolute inset-y-0 left-0 flex items-center md:hidden">
                            <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 border-slate-100 text-slate-100 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded={isMenuOpen} onClick={toggleMenu}>
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg className={`block h-6 w-6 ${isMenuOpen ? 'hidden' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                                <svg className={`hidden h-6 w-6 ${isMenuOpen ? '' : 'hidden'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
                            <div className="flex flex-shrink-0 items-center">
                                <Link href={"/"} className="text-slate-100 font-bold">Book Gather</Link>
                            </div>
                            <div className="hidden md:ml-6 md:block">
                                <div className="flex space-x-4">
                                    <Link href={"/home"} className="bg-gray-900 text-white rounded-md px-3 py-2 text-xs md:text-xs font-medium" aria-current="page">ホーム</Link>
                                    <Link href={user_name === "guest" ? "/login": "/mypage"} className="text-slate-100 hover:bg-blue-800 transition-all duration-300 rounded-md px-3 py-2 text-xs font-medium">{user_name === "guest" ? "ログイン": "MyPage"}</Link>
                                    <Link href={user_name === "guest" ? "/signup": "/"} className="text-slate-100 hover:bg-slate-100 transition-all duration-300 hover:text-red-500 rounded-md px-3 py-2 text-xs font-medium">{user_name === "guest" ? "サインアップ": "ログアウト"}</Link>
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div className="hidden md:ml-6 md:block">
                                <form className="text-center" onSubmit={handleSubmit}>
                                    <input
                                        type="search"
                                        name="query"
                                        className="rounded py-2 px-4 text-left border-red-500"
                                        placeholder="キーワードを入力して下さい"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                    />
                                    <button className="ml-2 text-white bg-red-500 rounded py-2 px-6 hover:opacity-75"
                                            type="submit">
                                        Search
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:hidden flex flex-col" id="mobile-menu" style={{ display: isMenuOpen ? 'block' : 'none' }}>
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Link href={"/home"} className="bg-gray-900 text-white rounded-md px-3 py-2 text-base font-medium" aria-current="page">ホーム</Link>
                        <Link href={user_name === "guest" ? "/login": "/mypage"} className="text-slate-100 hover:bg-blue-800 transition-all duration-300 rounded-md px-3 py-2 text-xs font-medium">{user_name === "guest" ? "ログイン": "MyPage"}</Link>
                        <Link href={user_name === "guest" ? "/signup": "/"} className="text-slate-100 hover:bg-slate-100 transition-all duration-300 hover:text-red-500 rounded-md px-3 py-2 text-base font-medium">{user_name === "guest" ? "サインアップ": "ログアウト"}</Link>
                    </div>
                    <div className="px-2 pb-3 pt-2 left-0 justify-start">
                        <form className="text-center" onSubmit={handleSubmit}>
                            <input
                                type="search"
                                name="query"
                                className="rounded py-2 px-4 text-left border-red-500"
                                placeholder="キーワードを入力して下さい"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                            <button className="ml-2 pt-2 mt-2 text-white bg-red-500 rounded py-2 px-6 hover:opacity-75"
                                    type="submit">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
            <main>
                <div className="flex flex-col m-5 p-3">
                    <div className="flex flex-row mb-3 pb-3 justify-center bg-green-500 rounded-2xl">
                        <Image src="/img/stackedBook.png" alt="stackedBook" width={400} height={500} />
                        <div className="flex flex-col items-center justify-evenly">
                            <p className="text-2xl text-slate-100">{user_name}さんが読んだ本は</p>
                            <p className="text-2xl text-right text-slate-100">冊です</p>
                        </div>
                    </div>
                    <div>
                        <Tabs bgcolor="bg-green-600" txcolor ="text-green-600"/>
                    </div>
                </div>
            </main>
            <footer className="text-center py-1 bg-slate-200">
                    <p>@TaiGa02</p>
            </footer>
        </>
    );
};