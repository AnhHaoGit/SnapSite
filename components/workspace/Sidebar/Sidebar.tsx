"use client";

import { useState, useRef, useEffect } from "react";
import { Home, Trash2, Plus, ChevronDown, File } from "lucide-react";
import SidebarResizer from "@/components/workspace/Sidebar/SidebarResizer";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";
import { useRouter, usePathname } from "next/navigation";
import fetch_data from "@/lib/fetch_data";

type Page = {
  _id: string;
  title: string;
  userId: string;
  createdAt: string;
};

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

export default function Sidebar() {
  const [width, setWidth] = useState(270);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Infomation
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

      if (!res.ok) throw new Error(data.error || "Failed to create new page");

      setPages((prevPages) => [data, ...(prevPages || [])]);

      router.push(`/workspace/${data._id}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    if (session && status === "authenticated") {
      const loadPages = async () => {
        try {
          const data = await fetch_data(session);
          setPages(data.pages ?? []);
        } catch (err) {
          console.error("Failed to load pages", err);
          setPages([]);
        }
      };
      loadPages();
    } else {
      setPages([]);
    }
  }, [session, status]);

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
          <span className="font-semibold whitespace-nowrap overflow-hidden text-ellipsis block text-md">
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
          className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-hover-sidebar cursor-pointer ${
            pathname === "/workspace/home"
              ? "font-bold text-white bg-sidebar-focus"
              : "font-semibold text-sidebar"
          }`}
        >
          <Home size={16} />
          <span>Home</span>
        </Link>

        <div className="px-2 pt-4 text-sidebar text-xs">Pages</div>

        {pages.map((page) => {
          const isActive = pathname === `/workspace/${page._id}`;

          return (
            <Link
              href={`/workspace/${page._id}`}
              key={page._id}
              className={`flex items-center gap-2 px-3 py-1 rounded-md hover:bg-hover-sidebar cursor-pointer transition ${
                isActive
                  ? "font-bold text-white bg-sidebar-focus"
                  : "font-semibold text-sidebar"
              }`}
            >
              <File size={16} />
              <span>{page.title !== "" ? page.title : "New page"}</span>
            </Link>
          );
        })}

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
