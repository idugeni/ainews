"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { FileText, Newspaper, History, Settings } from "lucide-react"
import { NEWS_CATEGORIES } from "@/config/categories"

export function MegaMenu() {
  const pathname = usePathname()

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Generate</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-3 p-4 w-[500px]">
              <Link href="/title" className="group">
                <div
                  className={cn(
                    "flex flex-col space-y-3 rounded-md p-4 hover:bg-accent transition-colors",
                    pathname === "/title" && "bg-accent",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-medium">Generate Titles</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Create catchy, engaging headlines for any topic with our advanced AI
                  </p>
                </div>
              </Link>
              <Link href="/news" className="group">
                <div
                  className={cn(
                    "flex flex-col space-y-3 rounded-md p-4 hover:bg-accent transition-colors",
                    pathname === "/news" && "bg-accent",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-medium">Generate News</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generate complete, well-structured news articles ready for WordPress
                  </p>
                </div>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-3 gap-3 p-4 w-[600px]">
              {NEWS_CATEGORIES.map((category) => (
                <Link key={category.id} href={`/news?category=${category.id}`} className="group">
                  <div className="flex flex-col space-y-2 rounded-md p-3 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-2">
                      {category.icon && <category.icon className="h-4 w-4 text-primary" />}
                      <h3 className="text-sm font-medium">{category.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid grid-cols-2 gap-3 p-4 w-[500px]">
              <Link href="/history" className="group">
                <div
                  className={cn(
                    "flex flex-col space-y-3 rounded-md p-4 hover:bg-accent transition-colors",
                    pathname === "/history" && "bg-accent",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    <h3 className="text-sm font-medium">History</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Access your previously generated titles and news articles
                  </p>
                </div>
              </Link>
              <div className="flex flex-col space-y-3 rounded-md p-4 hover:bg-accent transition-colors opacity-70">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-medium">Settings</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configure your preferences and API settings (Coming soon)
                </p>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/history" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                pathname === "/history" && "bg-accent text-accent-foreground",
              )}
            >
              History
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
