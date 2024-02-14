"use client";

import Link from "next/link";
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
  overall_rate: number;
  yearly_rate: number;
  monthly_rate: number;
};

const Tabs : React.FC<TabsProps> = ({ txcolor,bgcolor }) => {
    const [openTab, setOpenTab] = useState(1);
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [yearlyBooks, setYearlyBooks] = useState<Book[]>([]);
    const [monthlyBooks, setMonthlyBooks] = useState<Book[]>([]);
    const [error, setError] = useState("");

    const router = useRouter();

    let user_name: string = "guest";
    if (typeof window !== 'undefined' && localStorage.getItem("username")) {
        user_name = localStorage.getItem("username") ?? "guest";
    }

    const handleFinish = async (book: Book) => {
      if (user_name === "guest") {
          alert("ゲストとして入場しています。\nログインまたはサインアップをしてください");
      } else {
          const { title, author, picture_url } = book;
          const response = await fetch('http://localhost:3000/api/userbooks' , {
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
      }
  };

  const handleWant = async (book: Book) => {
      if (user_name === "guest") {
          alert("ゲストとして入場しています。\nログインまたはサインアップしてください");
      } else {
          const { title, author, picture_url } = book;
  
          try {
              // 既に読まれているか確認
              const userbookResponse = await fetch('http://localhost:3000/api/userbooks', {
                  method: 'POST',
                  body: JSON.stringify({ title, author, picture_url, user_name }),
                  headers: {
                      'Content-Type': 'application/json',
                  },
              });
  
              const userbookData = await userbookResponse.json();
  
              // 既に読まれている場合はアラート表示
              if (userbookData.hasData) {
                  alert("この本は既に読み終えています");
              } else {
                  // 「読みたい」リストに既に含まれているか確認
                  const wantbookResponse = await fetch('http://localhost:3000/api/wantbooks', {
                      method: 'POST',
                      body: JSON.stringify({ title, author, picture_url, user_name }),
                      headers: {
                          'Content-Type': 'application/json',
                      },
                  });
  
                  const wantbookData = await wantbookResponse.json();
  
                  // 既に「読みたい」リストに含まれている場合はアラート表示
                  if (wantbookData.alreadyRead || wantbookData.hasData) {
                      alert("気になるに追加されています");
                  } else {
                      // 上記のいずれでもない場合は「読みたい」リストに追加
  
                      const addToWantListResponse = await fetch('http://localhost:3000/api/want', {
                          method: "POST",
                          body: JSON.stringify({ title, author, picture_url, user_name }),
                          headers: {
                              'Content-Type': 'application/json'
                          },
                      });
  
                      if (!addToWantListResponse.ok) {
                          setError("登録に失敗しました");
                          return;
                      }
                      router.refresh();
                  }
              }
          } catch (err) {
              console.error("データの取得中にエラーが発生しました:", err);
          }
      }
  };

    const fetchBooks = async() => {
      try {

        const response = await fetch("http://localhost:3000/api/home", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",}
            });
        
        if (response.ok) {
          const data = await response.json();
          const sortedAllBooks = data.allBooks.sort((a:Book, b:Book) => b.overall_rate - a.overall_rate);
          const sortedYearlyBooks = data.yearlyBooks.sort((a:Book, b:Book) => b.yearly_rate - a.yearly_rate);
          const sortedMonthlyBooks = data.monthlyBooks.sort((a:Book, b:Book) => b.monthly_rate - a.monthly_rate);

          setAllBooks(sortedAllBooks);
          setYearlyBooks(sortedYearlyBooks);
          setMonthlyBooks(sortedMonthlyBooks);
        }
        
      } catch (err) {
        console.log(err);
      }
    };

    useEffect(() => {
      fetchBooks();
    }, []);

    const reset = async () => {
      await fetch("/api/reset", { method: "POST" });
    };

    useEffect(() => {
      reset();
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
                全期間
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
                年間
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
                月間
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                    {/* ここに全期間の本のアイテムを設置　*/}
                    {allBooks.map((book) =>(
                      <div key={book.id}>
                        {book && (
                            <div className="m-auto flex sm:flex-row flex-col py-5 my-5 outline outline-green-600 rounded-md">
                              <div className="px-3 mx-2 m-auto flex justify-center">
                                <img src={book.picture_url} alt={book.title} />
                              </div>
                              <div className="m-2">
                                      <p className="py-2 px-2 text-xl"><strong>タイトル:  </strong>{book.title}</p>
                                      <p className="py-1 px-2 text-xl"><strong>著者:  </strong>{book.author}</p>
                                      <button onClick={() => handleFinish(book)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 my-4 hover:bg-blue-800 duration-300 transition-all">読んだ</button>
                                      <button onClick={() => handleWant(book)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 hover:bg-blue-800 duration-300 transition-all">気になる、読みたい</button>
                              </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  {/* ここに年間の本のアイテムを設置　*/}
                  {yearlyBooks.map((book) =>(
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
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  {/* ここに月間の本のアイテムを設置　*/}
                  {monthlyBooks.map((book) =>(
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


export default function Home(){


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
                <Tabs bgcolor="bg-green-600" txcolor ="text-green-600"/>
            </main>
            <footer className="text-center py-1 bg-slate-200">
                    <p>@TaiGa02</p>
            </footer>
        </>
    );
};
