"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Menu, FileText, Newspaper, History, Home, Layers, Palette } from "lucide-react"
import { NEWS_CATEGORIES } from "@/config/categories"
import { ModeToggle } from "@/components/layout/ModeToggle"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" />
            News Generator
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
          <div className="space-y-1 px-2">
            <SheetClose asChild>
              <Button asChild variant="ghost" className={cn("w-full justify-start", pathname === "/" && "bg-accent")}> 
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Home
                </Link>
              </Button>
            </SheetClose>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="generate" className="border-none">
                <AccordionTrigger className="py-2 px-4 hover:bg-accent hover:no-underline rounded-md">
                  <div className="flex items-center">
                    <Layers className="mr-2 h-5 w-5" />
                    Generate
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="space-y-1">
                    <SheetClose asChild>
                      <Button asChild
                        variant="ghost"
                        className={cn("w-full justify-start pl-9", pathname === "/title" && "bg-accent")}
                      >
                        <Link href="/title">
                          <FileText className="mr-2 h-4 w-4" />
                          Generate Titles
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild
                        variant="ghost"
                        className={cn("w-full justify-start pl-9", pathname === "/news" && "bg-accent")}
                      >
                        <Link href="/news">
                          <Newspaper className="mr-2 h-4 w-4" />
                          Generate News
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="categories" className="border-none">
                <AccordionTrigger className="py-2 px-4 hover:bg-accent hover:no-underline rounded-md">
                  <div className="flex items-center">
                    <Layers className="mr-2 h-5 w-5" />
                    Categories
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="space-y-1">
                    {NEWS_CATEGORIES.map((category) => (
                      <SheetClose asChild key={category.id}>
                        <Button asChild variant="ghost" className="w-full justify-start pl-9">
                          <Link href={`/news?category=${category.id}`}>
                            {category.icon && <category.icon className="mr-2 h-4 w-4" />}
                            {category.name}
                          </Link>
                        </Button>
                      </SheetClose>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <SheetClose asChild>
              <Button asChild variant="ghost" className={cn("w-full justify-start", pathname === "/history" && "bg-accent")}> 
                <Link href="/history">
                  <History className="mr-2 h-5 w-5" />
                  History
                </Link>
              </Button>
            </SheetClose>
          </div>
        </div>

        <div className="border-t p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Theme</span>
          </div>
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
