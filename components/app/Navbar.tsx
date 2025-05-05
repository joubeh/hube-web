"use client";

import {
  PiHouse,
  PiImage,
  PiCoins,
  PiCoinsFill,
  PiImageFill,
  PiHouseFill,
  PiChatCircle,
  PiChatCircleFill,
} from "react-icons/pi";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { usePathname } from "next/navigation";

type NavLink = {
  title: string;
  icon: React.JSX.Element;
  iconActive: React.JSX.Element;
  href: string;
};
const navLinks: NavLink[] = [
  {
    title: "خانه",
    icon: <PiHouse className="text-xl md:text-base" />,
    iconActive: <PiHouseFill className="text-xl md:text-base" />,
    href: "/",
  },
  {
    title: "پرامپت ها",
    icon: <PiChatCircle className="text-xl md:text-base" />,
    iconActive: <PiChatCircleFill className="text-xl md:text-base" />,
    href: "/prompts",
  },
  {
    title: "گالری",
    icon: <PiImage className="text-xl md:text-base" />,
    iconActive: <PiImageFill className="text-xl md:text-base" />,
    href: "/gallery",
  },
  {
    title: "کیف پول",
    icon: <PiCoins className="text-xl md:text-base" />,
    iconActive: <PiCoinsFill className="text-xl md:text-base" />,
    href: "/wallet",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <div className="hidden md:flex items-center justify-around fixed top-0 right-0 w-full bg-background p-1.5 text-sm border-b border-gray-300">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/assets/logo.webp"
            alt="hube logo"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span>دنیای هوش مصنوعی</span>
        </div>
        <div className="flex items-center justify-center gap-6">
          {navLinks.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center justify-center hover:text-primary ${
                  isActive ? "text-primary" : "text-gray-700"
                } gap-1`}
              >
                {isActive ? l.iconActive : l.icon}
                {l.title}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex md:hidden fixed bottom-0 right-0 w-full bg-background items-center justify-around text-sm p-3 border-t border-gray-300">
        {navLinks.map((l) => {
          const isActive = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex flex-col items-center justify-center ${
                isActive ? "text-primary" : "text-gray-700"
              } gap-1`}
            >
              {isActive ? l.iconActive : l.icon}
              <span>{l.title}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
