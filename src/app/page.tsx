import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow bg-green-400 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-slate-200 font-bold underline lg:text-9xl md:text-8xl text-6xl mb-10 mx-1">Book Gather</h1>
            <div className="flex flex-col items-center">
              <button className="bg-blue-400 text-slate-200 rounded-md my-2 px-4 py-1 text-center text-xl w-40">ログイン</button>
              <button className="bg-blue-400 text-slate-200 rounded-md my-2 px-4 py-1 text-center text-xl w-40">サインアップ</button>
              <Link href={"/"} className="px-4 py-1 text-center text-xl text-blue-400 underline mt-2">
                ゲストとして
              </Link>
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
