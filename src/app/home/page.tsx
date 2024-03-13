"use client";

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
      }
  };

  const handleWant = async (book: Book) => {
      if (user_name === "guest") {
          alert("ゲストとして入場しています。\nログインまたはサインアップしてください");
      } else {
          const { title, author, picture_url } = book;
  
          try {
              // 既に読まれているか確認
              const userbookResponse = await fetch('/api/userbooks', {
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
                  const wantbookResponse = await fetch('/api/wantbooks', {
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
  
                      const addToWantListResponse = await fetch('/api/want', {
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

        const response = await fetch("/api/home", {
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
                                      <div className="flex items-center">
                                        <div className="w-8 h-8 mr-1">
                                          <svg className="w-full h-full text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                        </div>
                                        <span>{book.overall_rate}</span>
                                      </div>
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
                          <div className="m-auto flex sm:flex-row flex-col py-5 my-5 outline outline-green-600 rounded-md">
                            <div className="px-3 mx-2 m-auto flex justify-center">
                              <img src={book.picture_url} alt={book.title} />
                            </div>
                            <div className="m-2">
                                    <p className="py-2 px-2 text-xl"><strong>タイトル:  </strong>{book.title}</p>
                                    <p className="py-1 px-2 text-xl"><strong>著者:  </strong>{book.author}</p>
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 mr-1">
                                        <svg className="w-full h-full text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      </div>
                                      <span>{book.overall_rate}</span>
                                    </div>
                                    <button onClick={() => handleFinish(book)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 my-4 hover:bg-blue-800 duration-300 transition-all">読んだ</button>
                                    <button onClick={() => handleWant(book)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 hover:bg-blue-800 duration-300 transition-all">気になる、読みたい</button>
                            </div>
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
                          <div className="m-auto flex sm:flex-row flex-col py-5 my-5 outline outline-green-600 rounded-md">
                            <div className="px-3 mx-2 m-auto flex justify-center">
                              <img src={book.picture_url} alt={book.title} />
                            </div>
                            <div className="m-2">
                                    <p className="py-2 px-2 text-xl"><strong>タイトル:  </strong>{book.title}</p>
                                    <p className="py-1 px-2 text-xl"><strong>著者:  </strong>{book.author}</p>
                                    <div className="flex items-center">
                                      <div className="w-8 h-8 mr-1">
                                        <svg className="w-full h-full text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      </div>
                                      <span>{book.overall_rate}</span>
                                    </div>
                                    <button onClick={() => handleFinish(book)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 my-4 hover:bg-blue-800 duration-300 transition-all">読んだ</button>
                                    <button onClick={() => handleWant(book)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 hover:bg-blue-800 duration-300 transition-all">気になる、読みたい</button>
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


export default function Home(){
    return (
        <>
            <Nav /> 
            <main>
                <div className="flex flex-col m-5 p-3">
                  <div className="my-2 py-4 font-bold text-2xl text-center">
                    <h1>\\全ユーザーのランキング//</h1>
                  </div>
                  <Tabs bgcolor="bg-green-600" txcolor ="text-green-600"/>
                </div>
            </main>
            <footer className="text-center py-1 bg-slate-200">
                    <p>@TaiGa02</p>
            </footer>
        </>
    );
};
