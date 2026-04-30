"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet"
import { RiMenu2Line, RiCloseLine } from "@remixicon/react"
import Link from "next/link"

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Transcribe", href: "transcribe" },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95">
      <div className="flex w-full items-center justify-between px-5 py-4 md:px-8 md:py-5">
        <div className="flex items-center gap-1.5">
          <Link href="/">
            <h1 className="text-3xl font-semibold tracking-tight">
              Meeting<span className="text-primary">Mind</span>
            </h1>
          </Link>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Open menu"
              >
                <RiMenu2Line className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[280px] border-l border-gray-200 p-0 sm:w-[320px] dark:border-gray-800"
            >
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-gray-800">
                <SheetTitle></SheetTitle>
              </div>
              <nav className="flex flex-col px-3 py-6">
                {NAV_ITEMS.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center rounded-2xl px-4 py-4 text-lg font-medium text-muted-foreground transition-all duration-200 hover:bg-gray-50 hover:text-foreground dark:hover:bg-gray-900/50 ${index !== NAV_ITEMS.length - 1 ? "mb-1" : ""} `}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="absolute right-6 bottom-8 left-6">
                <div className="text-center text-xs text-muted-foreground">
                  MeetingMind © 2026
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
