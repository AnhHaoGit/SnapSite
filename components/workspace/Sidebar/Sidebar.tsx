"use client";

import { useState, useRef } from "react";
import { Home, Trash2, Plus, ChevronDown } from "lucide-react";
import SidebarResizer from "@/components/workspace/Sidebar/SidebarResizer";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";

export default function Sidebar() {
  const [width, setWidth] = useState(300);
  const [openDropdown, setOpenDropdown] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const { data: session } = useSession();

  console.log(session);

  type User = {
    username?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
  };

  type Session = {
    user?: User;
  };

  const username = (session as Session)?.user?.username ?? session?.user?.name;
  const email = (session as Session)?.user?.email;
  const userId = (session as Session)?.user?.id;

  const handleAddNewPage = async () => {
    try {
      const res = await fetch("/api/new_page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to create page");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

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
        <Link
          href="/workspace/home"
          className="flex items-center text-sidebar font-semibold gap-2 px-3 py-1 rounded-md hover:bg-hover-sidebar cursor-pointer"
        >
          <Home size={16} />
          <span>Home</span>
        </Link>

        <div className="px-2 pt-4 text-sidebar text-xs">Pages</div>

        <button
          onClick={handleAddNewPage}
          className="flex items-center text-sidebar font-semibold gap-2 px-3 py-1 rounded-md hover:bg-hover-sidebar cursor-pointer"
        >
          <Plus size={16} />
          <span>Add new</span>
        </button>

        <div className="mt-auto pt-6">
          <Link
            href="/workspace/home"
            className="flex items-center text-sidebar font-semibold gap-2 px-3 py-1 rounded-md hover:bg-hover-sidebar cursor-pointer"
          >
            <Trash2 size={16} />
            <span>Trash</span>
          </Link>
        </div>
      </div>

      <SidebarResizer sidebarRef={sidebarRef} setWidth={setWidth} />
    </div>
  );
}
