import Navbar from "@/components/app/Navbar";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="pb-[4rem] pt-0 md:pt-[3.5rem] md:pb-0">
        <div className="grid grid-cols-2 md:grid-cols-4 p-2 md:p-0 md:pt-2 w-full md:max-w-[60rem] md:mx-auto gap-2">
          <Link
            href="/chatgpt"
            className="bg-white border border-gray-300 shadow rounded-xl p-4"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/assets/chatgpt.svg"
                alt="chatgpt logo"
                width={80}
                height={80}
                className="rounded-xl"
              />
              <div>ChatGPT</div>
            </div>
            <div className="text-sm text-gray-700 mt-3 text-center">
              مدل هوش مصنوعی محاوره‌ای OpenAI که به پرسش‌ها با متنی شبیه به متن
              انسان پاسخ می‌دهد، قادر به نوشتن، حل مسئله و تولید محتوای خلاقانه
              است.
            </div>
          </Link>
          <div className="bg-white border border-gray-300 shadow rounded-xl p-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/assets/claude.svg"
                alt="claude logo"
                width={80}
                height={80}
                className="rounded-xl"
              />
              <div>Claude</div>
            </div>
            <div className="text-sm text-gray-700 mt-3 text-center">
              دستیار هوش مصنوعی مفید، بی‌ضرر و صادق شرکت Anthropic که برای
              مکالمات طبیعی، استدلال و حل مسئله با ویژگی‌های ایمنی بهبود یافته
              طراحی شده است.
            </div>
          </div>
          <div className="bg-white border border-gray-300 shadow rounded-xl p-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/assets/grok.svg"
                alt="grok logo"
                width={80}
                height={80}
                className="rounded-xl"
              />
              <div>Grok</div>
            </div>
            <div className="text-sm text-gray-700 mt-3 text-center">
              هوش مصنوعی مکالمه‌ای xAI با دسترسی به داده‌ها در لحظه، طراحی شده
              برای ارائه پاسخ‌های شوخ‌طبعانه و سرکش با کمی طنز و شخصیت.
            </div>
          </div>
          <div className="bg-white border border-gray-300 shadow rounded-xl p-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <Image
                src="/assets/gemini.svg"
                alt="gemini logo"
                width={80}
                height={80}
                className="rounded-xl"
              />
              <div>Gemini</div>
            </div>
            <div className="text-sm text-gray-700 mt-3 text-center">
              مدل هوش مصنوعی محاوره‌ای گوگل که با زبانی طبیعی پاسخ می‌دهد،
              توانایی نوشتن، حل مسئله و تولید محتوای خلاقانه را دارد.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
