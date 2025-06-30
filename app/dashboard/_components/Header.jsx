"use client";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

function Header() {
  const path = usePathname();

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Link href="/dashboard">
        <Image src="/logo.svg" alt="Logo" width={50} height={50} />
      </Link>
      <ul className="hidden md:flex gap-6">
        <li>
          <Link
            href="/dashboard"
            className={`hover:text-primary hover:font-bold transition-all ${
              path === "/dashboard" ? "text-primary font-bold" : ""
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/questions"
            className={`hover:text-primary hover:font-bold transition-all ${
              path === "/dashboard/questions" ? "text-primary font-bold" : ""
            }`}
          >
            Questions
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/upgrade"
            className={`hover:text-primary hover:font-bold transition-all ${
              path === "/dashboard/upgrade" ? "text-primary font-bold" : ""
            }`}
          >
            Upgrade
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/howitworks"
            className={`hover:text-primary hover:font-bold transition-all ${
              path === "/dashboard/howitworks" ? "text-primary font-bold" : ""
            }`}
          >
            How it works?
          </Link>
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
