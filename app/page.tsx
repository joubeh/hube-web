import Navbar from "@/components/app/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="pb-[4rem] pt-0 md:pt-[3.5rem] md:pb-0 flex justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 p-2 md:p-0 md:pt-2 w-full md:w-max gap-2">
          <Link
            href="/chatgpt"
            className="bg-white border border-gray-300 shadow rounded-xl p-2 flex flex-col items-center justify-center gap-2"
          >
            <Image
              src="/assets/chatgpt.svg"
              alt="chatgpt logo"
              width={80}
              height={80}
              className="rounded-xl"
            />
            <div>ChatGPT</div>
          </Link>
          <div className="bg-white border border-gray-300 shadow rounded-xl p-2 flex flex-col items-center justify-center gap-2">
            <Image
              src="/assets/claude.svg"
              alt="claude logo"
              width={80}
              height={80}
              className="rounded-xl"
            />
            <div>Claude</div>
          </div>
          <div className="bg-white border border-gray-300 shadow rounded-xl p-2 flex flex-col items-center justify-center gap-2">
            <Image
              src="/assets/grok.svg"
              alt="grok logo"
              width={80}
              height={80}
              className="rounded-xl"
            />
            <div>Grok</div>
          </div>
          <div className="bg-white border border-gray-300 shadow rounded-xl p-2 flex flex-col items-center justify-center gap-2">
            <Image
              src="/assets/deepseek.svg"
              alt="deepseek logo"
              width={80}
              height={80}
              className="rounded-xl"
            />
            <div>DeepSeek</div>
          </div>
        </div>
      </div>
    </div>
  );
}
