"use client";

import * as React from "react";
import { Menu, X, User, Settings, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetLoggedInUser } from "@/hooks/server/user/useGetLoggedInUser";
import { useLogout } from "@/hooks/server/auth/useLogout";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
}

interface TopNavbarProps {
  className?: string;
  navItems?: NavItem[];
}

const defaultNavItems: NavItem[] = [
  { title: "Home", href: "/home" },
  { title: "Projects", href: "/projects" },
  { title: "Tasks", href: "/tasks" },
  { title: "Team", href: "/team" },
  { title: "Calendar", href: "/calendar" },
];

export function TopNavbar({
  className,
  navItems = defaultNavItems,
}: TopNavbarProps) {
  const { data: user } = useGetLoggedInUser();
  const { mutateAsync: logout, isPending } = useLogout();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <nav
      className={cn(
        "border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/90 sticky top-0 z-50",
        className
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl text-emerald-600">CoLab</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={isActive(item.href) ? "default" : "ghost"}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                )}
                asChild
              >
                <Link href={item.href}>
                  {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 w-64 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400 focus:bg-zinc-700 focus:border-emerald-500"
              />
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 p-0"
                >
                  <Image
                    src={user?.photo || "/placeholder-avatar.png"}
                    width={20}
                    height={20}
                    alt={user?.username || "User"}
                    className="rounded-full"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-zinc-800 border-zinc-700 text-white"
              >
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {isPending ? "Logging Out..." : "Log Out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 bg-zinc-900 border-zinc-800 text-white"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <span className="font-bold text-xl text-emerald-600">
                      CoLab
                    </span>
                  </SheetTitle>
                  <SheetDescription>
                    Navigate through your collaborative workspace
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  {/* Mobile Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-400"
                    />
                  </div>

                  {/* Mobile Navigation */}
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        variant={isActive(item.href) ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start text-left",
                          isActive(item.href)
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "text-zinc-300 hover:text-white hover:bg-zinc-800"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                        asChild
                      >
                        <Link href={item.href}>
                          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                          {item.title}
                        </Link>
                      </Button>
                    ))}
                  </div>

                  {/* Mobile Actions */}
                  <div className="pt-4 border-t border-zinc-800 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Notifications
                      <span className="ml-auto h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        3
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      disabled={isPending}
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/50"
                      onClick={async () => await logout()}
                    >
                      {isPending ? "Logging Out..." : "Log Out"}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
