"use client";

import { useState, useRef } from "react";
import { Home, Search, Trash2, Plus } from "lucide-react";
import SidebarResizer from "@/components/workspace/Sidebar/SidebarResizer";
import SidebarItem from "@/components/workspace/Sidebar/SidebarItem";
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const [width, setWidth] = useState(260);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  type User = {
    username?: string;
    name?: string;
  };

  type Session = {
    user?: User;
  };

  const username = (session as Session)?.user?.username ?? session?.user?.name;

  return (
    <div
      ref={sidebarRef}
      style={{ width }}
      className="relative h-screen bg-sidebar border-sidebar overflow-hidden"
    >
      <div className="p-2 flex flex-col space-y-1 text-sm">
        <div className="p-2 font-semibold text-white">
          {username}&apos;s Workspace
        </div>

        <SidebarItem icon={<Search size={16} />} label="Search" />
        <SidebarItem icon={<Home size={16} />} label="Home" />

        <div className="px-2 pt-4 text-sidebar text-xs">Pages</div>
        <SidebarItem icon={<Plus size={16} />} label="Add new" />

        <div className="mt-auto pt-6">
          <SidebarItem icon={<Trash2 size={16} />} label="Trash" />
        </div>
      </div>

      <SidebarResizer sidebarRef={sidebarRef} setWidth={setWidth} />
    </div>
  );
}
