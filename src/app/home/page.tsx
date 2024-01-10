"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Home(){

    const [ isLinkDisabled, setIsLinkDisabled ] = useState(false);

    let user_name: string = "guest";
    if (typeof window !== 'undefined' && localStorage.getItem("username")) {
        user_name = localStorage.getItem("username") ?? "guest";
    }

    console.log(user_name);

    useEffect (() => {
        if (user_name === "guest") {
            setIsLinkDisabled(true);
        } else {
            setIsLinkDisabled(false);
        }
    }, [user_name]);

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            // 画面の幅が一定サイズ以上になったら、モバイルメニューを閉じる
            if (window.innerWidth > 768) {
                closeMenu();
            }
        };

        // ウィンドウのリサイズイベントを監視
        window.addEventListener("resize", handleResize);

        // コンポーネントがアンマウントされたときにイベントリスナーをクリーンアップする
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <nav className="bg-green-500 sticky">
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
                                <h3 className="text-slate-100 font-bold">Book Gather</h3>
                            </div>
                            <div className="hidden md:ml-6 md:block">
                                <div className="flex space-x-4">
                                    <Link href={"/home"} className="bg-gray-900 text-white rounded-md px-3 py-2 text-xs md:text-xs font-medium" aria-current="page">ホーム</Link>
                                    <Link href={"/"} className={`text-slate-100 hover:bg-blue-800 transition-all duration-300 rounded-md px-3 py-2 text-xs font-medium ${isLinkDisabled ? 'pointer-events-none' : ''}`} aria-disabled={isLinkDisabled}>MyPage</Link>
                                    <Link href={"/"} className="text-slate-100 hover:bg-slate-100 transition-all duration-300 hover:text-red-500 rounded-md px-3 py-2 text-xs font-medium">ログアウト</Link>
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                            <div className="hidden md:ml-6 md:block">
                                <form className="text-center">
                                    <input
                                        type="search"
                                        name="query"
                                        className="rounded py-2 px-4 text-left border-red-500"
                                        placeholder="キーワードを入力して下さい"
                                    />
                                    <button className="ml-2 text-white bg-red-500 rounded py-2 px-6 hover:opacity-75">
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
                        <Link href={"/"} className={`text-slate-100 hover:bg-blue-800 transition-all duration-300 rounded-md px-3 py-2 text-xs font-medium ${isLinkDisabled ? 'pointer-events-none' : ''}`} aria-disabled={isLinkDisabled}>MyPage</Link>
                        <Link href={"/"} className="text-slate-100 hover:bg-slate-100 transition-all duration-300 hover:text-red-500 rounded-md px-3 py-2 text-base font-medium">ログアウト</Link>
                    </div>
                    <div className="px-2 pb-3 pt-2 left-0 justify-start">
                        <form className="text-center">
                            <input
                                type="search"
                                name="query"
                                className="rounded py-2 px-4 text-left border-red-500"
                                placeholder="キーワードを入力して下さい"
                            />
                            <button className="ml-2 pt-2 mt-2 text-white bg-red-500 rounded py-2 px-6 hover:opacity-75">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </nav>
            <main>

            </main>
            <footer className="text-center py-1 bg-slate-200">
                    <p>@TaiGa02</p>
            </footer>
        </>
    );
};
