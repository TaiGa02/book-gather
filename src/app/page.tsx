"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {

  if (typeof window !== 'undefined') {
    localStorage.clear();
  }

  const router = useRouter();

  const loginHandle = () => {
    router.push("/login");

  };

  const signUpHandle = () => {
    router.push("/signup")
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow bg-green-500 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-slate-200 font-bold underline lg:text-9xl md:text-8xl text-6xl mb-10 mx-1">Book Gather</h1>
            <div className="flex flex-col items-center">
              <button onClick={loginHandle} className="bg-blue-400 text-slate-200 rounded-md my-2 px-4 py-1 text-center text-xl w-40 shadow-md
              hover:bg-blue-800 transition-all duration-300">ログイン</button>
              <button onClick={signUpHandle} className="bg-blue-400 text-slate-200 rounded-md my-2 px-4 py-1 text-center text-xl w-40 shadow-md
              hover:bg-blue-800 transition-all duration-300">サインアップ</button>
              <Link href={"/home"} className="px-4 py-1 text-center text-xl text-blue-400 underline mt-2
              hover:text-blue-800 transition-all duration-300">
                ゲストとして
              </Link>
            </div>
            <div className="pt-5 mt-5 flex justify-center">
            <Image src="/img/readingMan.png" alt="Reading Man" width={80} height={80} />
            </div>
          </div>
        </main>
        <footer className="text-center py-1 bg-slate-200">
          <p>@TaiGa02</p>
        </footer>
      </div>
    </>
  );
};
