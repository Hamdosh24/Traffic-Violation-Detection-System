"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import logo from "../../public/Logo.svg";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Building2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ExternalLink,
  LayoutGrid,
  LayoutList,
  LogOut,
  // Minus,
  MonitorPlay,
  ScanSearch,
  Settings,
  Slack,
  Truck,
  User,
  UserSquare2,
  UsersRound,
  Warehouse,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Sidebar({ showSidebar, setShowSidebar }) {
  const pathname = usePathname();

  console.log(pathname);
  const catalogueLinks = [
    {
      title: "Products",
      icon: Boxes,
      href: "/dashboard/products",
    },
    {
      title: "Categories",
      icon: LayoutList,
      href: "/dashboard/categories",
    },
    {
      title: "Coupons",
      icon: ScanSearch,
      href: "/dashboard/coupons",
    },
    {
      title: "store Banners",
      icon: MonitorPlay,
      href: "/dashboard/banners",
    },
  ];
  const sidebarLinks = [
    {
      title: "Customers",
      icon: UsersRound,
      href: "/dashboard/customers",
    },
    {
      title: "Markets",
      icon: Warehouse,
      href: "/dashboard/markets",
    },
    {
      title: "Farmers",
      icon: UserSquare2,
      href: "/dashboard/farmers",
    },
    {
      title: "Orders",
      icon: Truck,
      href: "/dashboard/orders",
    },
    {
      title: "Our Staff",
      icon: User,
      href: "/dashboard/staff",
    },
    {
      title: "Limi Community",
      icon: Building2,
      href: "/dashboard/community",
    },
    {
      title: "Wallet",
      icon: CircleDollarSign,
      href: "/dashboard/wallet",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
    {
      title: "Online Store",
      icon: ExternalLink,
      href: "/",
    },
  ];
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <div
      className={
        showSidebar
          ? "z-50 fixed sm:block mt-16 sm:mt-0 dark:bg-slate-800 bg-white space-y-6 w-64 h-screen dark:text-slate-100 left-0 top-0 shadow-md overflow-y-scroll"
          : "z-50 fixed hidden sm:block mt-16 sm:mt-0 dark:bg-slate-800 bg-white space-y-6 w-64 h-screen dark:text-slate-100 left-0 top-0 shadow-md overflow-y-scroll"
      }
    >
      <div className="px-6 py-4">
        <Link onClick={() => setShowSidebar(false)} href="/dashboard">
          <Image src={logo} alt="limifood logo" className="w-28 text-black" />
        </Link>
      </div>
      <div className="text-gray-400  space-y-3 flex flex-col">
        <Link
          onClick={() => setShowSidebar(false)}
          href="/dashboard"
          className={
            pathname === "/dashboard"
              ? "flex items-center space-x-1 px-6 py-2.5 border-l-4 border- border-customGreen text-customGreen"
              : "flex items-center hover:text-customGreen dark:hover:text-gray-200 space-x-1 px-6 py-2.5"
          }
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="pl-4 font-bold">Dashboard</span>
        </Link>
        {/* "px-6 " */}
        <Collapsible
          className={
            catalogueLinks.some((link) => link.href === pathname)
              ? "px-6  border-l-4 border-customGreen"
              : "px-6 "
          }
        >
          <CollapsibleTrigger onClick={() => setOpenMenu(!openMenu)}>
            <button className="flex items-center text-slate-400 space-x-4 hover:text-customGreen dark:hover:text-gray-200 ">
              <div className="flex items-center space-x-1">
                <Slack className="w-5 h-5" />
                <span className="pl-4 font-bold text-sm">Catalogue</span>
              </div>
              {openMenu ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="py-2 pl-5 dark:bg-slate-900 rounded-md text-sm dark:text-slate-500">
            {catalogueLinks.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  onClick={() => setShowSidebar(false)}
                  key={i}
                  href={item.href}
                  className=" text-slate-400 flex items-center space-x-1 font-medium py-1"
                >
                  {/* <Minus className="w-3 h-3" /> */}
                  <div className="flex justify-center items-center hover:text-customGreen">
                    <Icon className="w-3 h-3" />
                    <span className="pl-2">{item.title}</span>
                  </div>
                </Link>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {sidebarLinks.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              onClick={() => setShowSidebar(false)}
              key={i}
              href={item.href}
              className={
                item.href == pathname
                  ? "flex items-center space-x-1 px-6 py-2.5 border-l-4 border-customGreen text-customGreen"
                  : "flex items-center text-slate-400 hover:text-customGreen dark:hover:text-gray-200 space-x-1 px-6 py-2.5"
              }
            >
              <Icon className="w-5 h-5" />
              <span className="pl-4 font-bold text-sm">{item.title}</span>
            </Link>
          );
        })}
        {/* "relative left-5 pt-20" */}
        <div className="m-auto py-4">
          <button className="bg-customGreen text-white font-medium flex items-center space-x-1 px-16 py-3 rounded-md text-sm hover:bg-emerald-700">
            <LogOut />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
