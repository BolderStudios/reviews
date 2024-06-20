// components/ui/Sidebar.jsx

"use client";

import React from "react";
import Link from "next/link";
import { DashboardIcon, GearIcon, IdCardIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const currentPathname = pathname.split("/")[1];

  const linkClasses = (href) =>
    `flex items-center p-2 text-gray-900 rounded-lg dark:text-white ${
      currentPathname === href.split("/")[1]
        ? "bg-gray-100 dark:bg-gray-700"
        : "hover:bg-gray-100 dark:hover:bg-gray-700"
    } group`;

  const iconClasses = (href) =>
    `flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 ${
      currentPathname === href.split("/")[1]
        ? "text-gray-900 dark:text-white"
        : "group-hover:text-gray-900 dark:group-hover:text-white"
    }`;

  return (
    <div className="h-screen overflow-hidden w-64">
      {/* Button for small screens */}
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className="h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <a href="/" className="flex items-center ps-2.5 mb-5">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-6 me-3 sm:h-7"
              alt="Flowbite Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              Flowbite
            </span>
          </a>

          <ul className="font-medium mt-7 flex flex-col gap-2">
            <li>
              <Link href="/dashboard" className={linkClasses("/dashboard")}>
                <DashboardIcon className={iconClasses("/dashboard")} />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/settings" className={linkClasses("/settings")}>
                <GearIcon className={iconClasses("/settings")} />
                <span className="ms-3">Settings</span>
              </Link>
            </li>
            <li>
              <Link href="/billing" className={linkClasses("/billing")}>
                <IdCardIcon className={iconClasses("/billing")} />
                <span className="ms-3">Billing</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
