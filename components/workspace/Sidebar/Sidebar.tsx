"use client";

import { useState, useRef } from "react";
import { Home, Search, Trash2, Plus, ChevronDown } from "lucide-react";
import SidebarResizer from "@/components/workspace/Sidebar/SidebarResizer";
import SidebarItem from "@/components/workspace/Sidebar/SidebarItem";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [width, setWidth] = useState(300);
  const [openDropdown, setOpenDropdown] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  type User = {
    username?: string;
    name?: string;
    email?: string;
  };

  type Session = {
    user?: User;
  };

  const username = (session as Session)?.user?.username ?? session?.user?.name;
  const email = (session as Session)?.user?.email;

  return (
    <div
      ref={sidebarRef}
      style={{ width }}
      className="relative h-screen bg-sidebar border-sidebar overflow-hidden"
    >
      <div className="p-2 flex flex-col space-y-1 text-sm relative">
        {/* ---------- USER BUTTON ---------- */}
        <button
          onClick={() => setOpenDropdown((prev) => !prev)}
          className="p-2 w-full flex items-center justify-between text-white bg-sidebar hover:bg-[#2a2a2a] rounded transition"
        >
          <span className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis block">
            {username}&apos;s Workspace
          </span>{" "}
          <ChevronDown
            size={16}
            className={`transition-transform ${
              openDropdown ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* ---------- USER DROPDOWN ---------- */}
        <AnimatePresence>
          {openDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute top-12 left-2 right-2 dropdown rounded-lg shadow-lg p-3 z-50"
            >
              <div className="text-sm text-gray-300 mb-2">Signed in as</div>
              <div className="text-white font-medium mb-3">{email}</div>

              <button
                onClick={() => signOut()}
                className="w-full p-2 logout-button text-white rounded transition"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---------- MENU ITEMS ---------- */}
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
