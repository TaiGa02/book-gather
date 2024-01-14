"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";

export default function Finish() {

    const searchParams = useSearchParams();
    let title = searchParams.get("title");
    let author = searchParams.get("author");
    let picture_url = searchParams.get("imgUrl");

    console.log(title);
    console.log(author);
    console.log(picture_url);

    const [error, setError] = useState("");

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

    let rating = 0

    const handleRate = (id: string) => {
        let rate1 = document.getElementById("1");
        let rate2 = document.getElementById("2");
        let rate3 = document.getElementById("3");
        let rate4 = document.getElementById("4");
        let rate5 = document.getElementById("5");

        if(id === "1"){
            rate1?.classList.add("text-yellow-500");
            rate2?.classList.remove("text-yellow-500");
            rate3?.classList.remove("text-yellow-500");
            rate4?.classList.remove("text-yellow-500");
            rate5?.classList.remove("text-yellow-500");
            rating = 1
        }
        else if(id === "2"){
            rate1?.classList.add("text-yellow-500");
            rate2?.classList.add("text-yellow-500");
            rate3?.classList.remove("text-yellow-500");
            rate4?.classList.remove("text-yellow-500");
            rate5?.classList.remove("text-yellow-500");
            rating = 2
        }
        else if(id === "3"){
            rate1?.classList.add("text-yellow-500");
            rate2?.classList.add("text-yellow-500");
            rate3?.classList.add("text-yellow-500");
            rate4?.classList.remove("text-yellow-500");
            rate5?.classList.remove("text-yellow-500");
            rating = 3
        }
        else if(id === "4"){
            rate1?.classList.add("text-yellow-500");
            rate2?.classList.add("text-yellow-500");
            rate3?.classList.add("text-yellow-500");
            rate4?.classList.add("text-yellow-500");
            rate5?.classList.remove("text-yellow-500");
            rating = 4
        }
        else if(id === "5"){
            rate1?.classList.add("text-yellow-500");
            rate2?.classList.add("text-yellow-500");
            rate3?.classList.add("text-yellow-500");
            rate4?.classList.add("text-yellow-500");
            rate5?.classList.add("text-yellow-500");
            rating = 5
        }

        console.log(rating);
    };

    const handleBook = async () => {
        if(rating !== 0){

            try {
                toast.loading("保存中です・・・")
                const response = await fetch('http://localhost:3000/api/finish' , {
                    method: "POST",
                    body: JSON.stringify({ title, author, picture_url, rating, user_name }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
    
    
                if(!response.ok) {
                    setError("登録に失敗しました");
                    return;
                }
    
                toast.success("保存しました！");
    
    
                router.push("/home");
                router.refresh();
    
            } catch (error) {
                console.error("エラーが発生しました:", error);
                setError("登録に失敗しました");
            }
        }else{
            alert("評価がつけられていません\n評価をつけてください");
        }
            
    };

    const handleFavorite = async () => {

        if(rating !== 0){

            try {
                toast.loading("保存中です・・・")
                const response = await fetch('http://localhost:3000/api/favorite' , {
                    method: "POST",
                    body: JSON.stringify({ title, author, picture_url, rating, user_name }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
    
    
                if(!response.ok) {
                    setError("登録に失敗しました");
                    return;
                }
    
                toast.success("保存しました！");
    
    
                router.push("/home");
                router.refresh();
    
            } catch (error) {
                console.error("エラーが発生しました:", error);
                setError("登録に失敗しました");
            }
        }else{
            alert("評価がつけられていません\n評価をつけてください");
        }

    };
    
    return (
        <>
            <Toaster/>
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
                                    <Link href={user_name === "guest" ? "/login": "/"} className="text-slate-100 hover:bg-blue-800 transition-all duration-300 rounded-md px-3 py-2 text-xs font-medium">{user_name === "guest" ? "ログイン": "MyPage"}</Link>
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
                        <Link href={user_name === "guest" ? "/login": "/"} className="text-slate-100 hover:bg-blue-800 transition-all duration-300 rounded-md px-3 py-2 text-xs font-medium">{user_name === "guest" ? "ログイン": "MyPage"}</Link>
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
            <main className="min-h-screen">
                <div className="flex flex-col justify-center items-center">
                    <div className="text-center m-auto py-4 my-4">
                        <h1 className="text-xl font-bold">今回の本はどうでしたか？</h1>
                        <p>※評価の方お願いします</p>
                    </div>
                    <div className="flex sm:flex-row flex-col p-5 m-5 outline outline-green-600 rounded-md">
                        <div className="px-3 mx-2 m-auto flex justify-center">
                            {picture_url && <img src={picture_url} alt={`Cover of ${title}`}/>}
                        </div>
                        <div className="m-2">
                            <p className="py-2 px-2 text-2xl"><strong>タイトル:  </strong>{title}</p>
                            <p className="py-2 px-2 text-2xl"><strong>著者:  </strong>{author}</p>
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <svg className="w-12 h-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" values="1" id="1"
                        onMouseDown={() => handleRate("1")}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="w-12 h-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" values="1" id="2"
                        onMouseDown={() => handleRate("2")}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="w-12 h-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" values="1" id="3"
                        onMouseDown={() => handleRate("3")}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="w-12 h-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" values="1" id="4"
                        onMouseDown={() => handleRate("4")}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <svg className="w-12 h-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" values="1" id="5"
                        onMouseDown={() => handleRate("5")}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    </div>
                    <div className="m-2 pt-3">
                        <button className="p-1 text-slate-100 bg-blue-400 rounded-md px-2 mx-2 hover:bg-blue-800 duration-300 transition-all"
                        onClick={handleBook}>登録</button>
                        <button className="p-1 text-slate-100 bg-blue-400 rounded-md px-2 mx-2 hover:bg-blue-800 duration-300 transition-all"
                        onClick={handleFavorite}>お気に入りとして登録</button>
                    </div>
                </div>
            </main>

            <footer className="text-center py-1 bg-slate-200">
                    <p>@TaiGa02</p>
            </footer>
        </>
    );
};