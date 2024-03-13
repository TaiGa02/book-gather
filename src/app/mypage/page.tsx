"use client";

import Image from 'next/image';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/Nav";

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

interface WantToReadBook {
    id: number;
    title: string;
    author: string;
    picture_url: string;
}

interface User {
    id: number;
    number_book: number;
}

const Tabs : React.FC<TabsProps> = ({ txcolor,bgcolor }) => {
    const router = useRouter();
    let user_name: string = "guest";
    if (typeof window !== 'undefined' && localStorage.getItem("username")) {
        user_name = localStorage.getItem("username") ?? "guest";
    }
    const [openTab, setOpenTab] = useState(1);
    const [readBooks, setReadBooks] = useState<Book[]>([]);
    const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([]);
    const [wantToReadBooks, setWantToReadBooks] = useState<WantToReadBook[]>([]);

    const fetchBooks = async () => {
        try {
            const response = await fetch("/api/mypage", {
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
                setFavoriteBooks(data.favBooks);
                console.log(data.favBooks);
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
    
      const handleFinish = async (book: Book) => {
            let user_name: string = "guest";
            if (typeof window !== 'undefined' && localStorage.getItem("username")) {
                user_name = localStorage.getItem("username") ?? "guest";
            }
            const { title, author, picture_url } = book
            const response = await fetch('/api/userbooks' , {
                method: 'POST',
                body: JSON.stringify({ title, author, picture_url, user_name }),
                headers:{ 
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if(data.hasData){
                alert("この本は既に読み終えています")
            } else{
                router.push(`/finish?title=${book.title}&author=${book.author}&imgUrl=${book.picture_url}`);
            }
    };

    const handlefav = async (book: Book) => {
        let user_name: string = "guest";
            if (typeof window !== 'undefined' && localStorage.getItem("username")) {
                user_name = localStorage.getItem("username") ?? "guest";
            }
            const { title, author, picture_url } = book;
            const response = await fetch('/api/checkFavorite' , {
                method: 'POST',
                body: JSON.stringify({ title, author, picture_url, user_name }),
                headers:{ 
                    'Content-Type': 'application/json',
                },
            });
        
        router.push('/mypage');
        router.refresh();
    };
    
  
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
                            <div className="m-auto flex sm:flex-row flex-col py-5 my-5 outline outline-green-600 rounded-md">
                                <div className="px-3 mx-2 m-auto flex justify-center">
                                <img src={book.picture_url} alt={book.title} />
                                </div>
                                <div className="m-2">
                                    <p className="py-2 px-2 text-xl"><strong>タイトル:  </strong>{book.title}</p>
                                    <p className="py-1 px-2 text-xl"><strong>著者:  </strong>{book.author}</p>
                                    <button onClick={() => handlefav(book)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 my-4 hover:bg-blue-800 duration-300 transition-all">お気に入りに追加</button>
                                </div>
                            </div>
                        )}
                        </div>
                    ))}
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  {/* ここにお気に入り本のアイテムを設置　*/}
                  {favoriteBooks.map((book) =>(
                        <div key={book.id}>
                            {book && (
                            <div className="m-auto flex sm:flex-row flex-col py-5 my-5 outline outline-green-600 rounded-md">
                            <div className="px-3 mx-2 m-auto flex justify-center">
                            <img src={book.picture_url} alt={book.title} />
                            </div>
                            <div className="m-2">
                                <p className="py-2 px-2 text-xl"><strong>タイトル:  </strong>{book.title}</p>
                                <p className="py-1 px-2 text-xl"><strong>著者:  </strong>{book.author}</p>
                                <button onClick={() => handlefav(book)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 my-4 hover:bg-blue-800 duration-300 transition-all">お気に入りから削除</button>
                            </div>
                        </div>
                        )}
                        </div>
                    ))}
                  
                </div>
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  {/* ここに読みたい本のアイテムを設置　*/}
                  {wantToReadBooks.map((wantToReadBook) => (
                    <div key={wantToReadBook.id}>
                        {wantToReadBook && (
                            <div className="m-auto flex sm:flex-row flex-col py-5 my-5 outline outline-green-600 rounded-md">
                            <div className="px-3 mx-2 m-auto flex justify-center">
                            <img src={wantToReadBook.picture_url} alt={wantToReadBook.title} />
                            </div>
                            <div className="m-2">
                                <p className="py-2 px-2 text-xl"><strong>タイトル:  </strong>{wantToReadBook.title}</p>
                                <p className="py-1 px-2 text-xl"><strong>著者:  </strong>{wantToReadBook.author}</p>
                                <button onClick={() => handleFinish(wantToReadBook)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 my-4 hover:bg-blue-800 duration-300 transition-all">読んだ</button>
                            </div>
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

    const [user, setUser] = useState<User>();

    const fetchUser = async () => {
        try {
            const response = await fetch("/api/mypage", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "User-Name": user_name,
            },
        });

            if(response.ok){
                const data = await response.json();
                console.log("Fetched data:", data);
                setUser(data.user)
            } else {
                console.log("Failed to fetch data");
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchUser();
      }, []);


    return (
        <>
            <Nav />
            <main>
                <div className="m-5 p-3">
                    <div className="mb-3 pb-3 bg-green-500 rounded-2xl">
                        <div className="flex flex-col md:flex-row items-center justify-center">
                            <Image src="/img/stackedBook.png" alt="stackedBook" width={400} height={500} />
                            <div className="flex flex-col items-center justify-evenly">
                                <p className="text-2xl text-center text-slate-100 mb-3">{user_name}さんが読んだ本は</p>
                                <p className="text-2xl text-center text-slate-100">{user?.number_book}冊です</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Tabs bgcolor="bg-green-600" txcolor="text-green-600" />
                    </div>
                </div>
            </main>
            <footer className="text-center py-1 bg-slate-200">
                    <p>@TaiGa02</p>
            </footer>
        </>
    );
};