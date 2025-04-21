import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <Link href="/chatgpt">ChatGPT</Link>
      <Link href="/claude">Claude</Link>
      <Link href="/gemini">Gemini</Link>
      <Link href="/grok">Grok</Link>
    </div>
  );
}
