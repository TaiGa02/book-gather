"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "../../components/Nav";

interface Item {
    Item: {
        title: string;
        author: string;
        largeImageUrl: string;
    };
}

interface ApiResponse {
    Items: Item[];
}

export default function Result() {
    const searchParams = useSearchParams();
    let bookName = searchParams.get("keyword");
    if (bookName !== null) {
        bookName = encodeURI(bookName);
    }

    let user_name: string = "guest";
    if (typeof window !== 'undefined' && localStorage.getItem("username")) {
        user_name = localStorage.getItem("username") ?? "guest";
    }
    const router = useRouter();
    const defaultUrl = `https://app.rakuten.co.jp/services/api/BooksBook/Search/20170404?format=json&title=${bookName}&applicationId=${process.env.NEXT_PUBLIC_APP_ID}`;

    const [apiData, setApiData] = useState<ApiResponse | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(defaultUrl);
                const data: ApiResponse = await response.json();
                setApiData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [defaultUrl]);

    console.log(apiData);

    const handleFinish = async (item: Item) => {
        if (user_name === "guest") {
            alert("ゲストとして入場しています。\nログインまたはサインアップをしてください");
        } else {
            const { title, author, largeImageUrl: picture_url } = item.Item
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
                router.push(`/finish?title=${item.Item.title}&author=${item.Item.author}&imgUrl=${item.Item.largeImageUrl}`);
            }
        }
    };

    const handleWant = async (item: Item) => {
        if (user_name === "guest") {
            alert("ゲストとして入場しています。\nログインまたはサインアップしてください");
        } else {
            const { title, author, largeImageUrl: picture_url } = item.Item;
    
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

    return (
        <>
            <Nav />
            <main>
                <div className="flex flex-col justify-center items-center">
                    <h1 className="my-2 py-4 font-bold text-2xl">「{decodeURI(bookName ?? "")}」の検索結果：{apiData?.Items.length}件</h1>
                </div>
                <div className="mx-10 px-5">
                {apiData && apiData.Items && (
                    <div>
                        {apiData.Items.map((item, index) => (
                            <div className="m-auto flex sm:flex-row flex-col py-5 my-5 outline outline-green-600 rounded-md" key={index}>
                                <div className="px-3 mx-2 m-auto flex justify-center">
                                    <img src={item.Item.largeImageUrl} alt={`Cover of ${item.Item.title}`} />
                                </div>
                                <div className="m-2">
                                    <p className="py-2 px-2 text-xl"><strong>タイトル:  </strong>{item.Item.title}</p>
                                    <p className="py-1 px-2 text-xl"><strong>著者:  </strong>{item.Item.author}</p>
                                    <button onClick={() => handleFinish(item)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 my-4 hover:bg-blue-800 duration-300 transition-all">読んだ</button>
                                    <button onClick={() => handleWant(item)} className="text-slate-100 bg-blue-400 rounded-md px-2 mx-2 hover:bg-blue-800 duration-300 transition-all">気になる、読みたい</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </main>

            <footer className="text-center py-1 bg-slate-200">
                    <p>@TaiGa02</p>
            </footer>
        </>
    );
}
