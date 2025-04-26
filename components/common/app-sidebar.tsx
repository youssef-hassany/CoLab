import {
  Calendar,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getLoggedInUser, logout } from "@/app/actions/user-actions";
import Link from "next/link";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "/",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/",
    icon: Settings,
  },
];

export async function AppSidebar() {
  const user = await getLoggedInUser();

  return (
    <Sidebar>
      <SidebarContent className="bg-zinc-900 text-white flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="text-emerald-600 font-bold">
            CoLab
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User profile section at the bottom */}
        <div className="mt-auto p-4 border-t border-zinc-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center w-full gap-3 rounded-md p-2 hover:bg-zinc-800 transition">
                <Avatar>
                  <AvatarImage
                    src={user.user?.profilePic || "/placeholder-avatar.png"}
                    alt="User"
                  />
                  <AvatarFallback className="bg-emerald-600">JD</AvatarFallback>
                </Avatar>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium">{user.user?.name}</p>
                  <p className="text-xs text-zinc-400">{user.user?.email}</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-zinc-950 text-zinc-400 border-zinc-600"
            >
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Account Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-zinc-700" />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
