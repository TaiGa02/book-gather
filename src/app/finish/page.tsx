"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Nav from "../../components/Nav";

export default function Finish() {

    const searchParams = useSearchParams();
    let title = searchParams.get("title");
    let author = searchParams.get("author");
    let picture_url = searchParams.get("imgUrl");

    console.log(title);
    console.log(author);
    console.log(picture_url);

    let user_name: string = "guest";
    if (typeof window !== 'undefined' && localStorage.getItem("username")) {
        user_name = localStorage.getItem("username") ?? "guest";
    }

    const [error, setError] = useState("");
    const router = useRouter();

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
                const response = await fetch('/api/finish' , {
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
                const response = await fetch('/api/favorite' , {
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
            <Nav />
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