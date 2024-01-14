"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";

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

    const handleFinish = async (item: Item) => {
        if (user_name === "guest") {
            alert("ゲストとして入場しています。\nログインまたはサインアップをしてください");
        } else {
            const { title, author, largeImageUrl: picture_url } = item.Item
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
                router.push(`/finish?title=${item.Item.title}&author=${item.Item.author}&imgUrl=${item.Item.largeImageUrl}`);
            }
        }
    };

    const handleWant = async (item: Item) => {
        if (user_name === "guest"){
            alert("ゲストとして入場しています。\nログインまたはサインアップしてください");
        } else {

            const { title, author, largeImageUrl: picture_url } = item.Item
            try {
                const res = await fetch('http://localhost:3000/api/wantbooks' , {
                method: 'POST',
                body: JSON.stringify({ title, author, picture_url, user_name }),
                headers:{ 
                    'Content-Type': 'application/json',
                    },
                });
                const data = await res.json();
                if(data.hasData){
                    alert("この本は既に気になるに追加されています")
                }
                else{
                    toast.loading("気になるに追加中です・・・")
                const response = await fetch('http://localhost:3000/api/want' , {
                    method: "POST",
                    body: JSON.stringify({ title, author, picture_url, user_name }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if(!response.ok) {
                    setError("登録に失敗しました");
                    return;
                }
    
                toast.success("追加しました！");
                router.refresh();
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
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
