"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignUp() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!username || !password) {
            setError("ユーザーネームとパスワードを入力してください");
            return;
        }

        router.push("/home");
    };

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <main className="flex-grow bg-green-500 flex items-center justify-center">
                    <div className="text-2xl text-slate-200 font-bold p-3">
                    <div className="text-center pb-10">
                        <h1 className="text-slate-200 font-bold underline lg:text-9xl md:text-8xl text-6xl mb-10 mx-1">Book Gather</h1>
                    </div>
                    <h2 className="px-4 m-auto font-bold">サインアップ</h2>
                        <div className="bg-slate-200 py-4 px-5 my-3 rounded-lg shadow-lg">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    placeholder="ユーザー名を記入してください"
                                    className="rounded-md px-4 w-full py-2 my-2 text-slate-950"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="パスワードを記入してください"
                                    className="rounded-md px-4 w-full py-2 my-2 text-slate-950"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {/* エラーメッセージ */}
                                {error && <p className="text-red-500">{error}</p>}
                                <button
                                    className="bg-blue-400 rounded-md my-2 px-4 py-2 shadow-lg
                                     hover:bg-blue-800 transition-all duration-300"
                                    type="submit"
                                >
                                    登録
                                </button>
                            </form>
                        </div>
                    </div>
                </main>
                <footer className="text-center py-1 bg-slate-200">
                    <p>@TaiGa02</p>
                </footer>
            </div>
        </>
    );
}
