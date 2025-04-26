"use client";

import { useState, useRef, useEffect } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import PreferenceButton from "./PreferenceButton";

const tabs: Record<"File" | "Coordinate", string[]> = {
  File: ["New", "Import", "Export"],
  Coordinate: ["Inertial Frame (ECI/HCI/HCRF)", "Non-inertial Frame (ECEF/HSK)"],
};

type TabKey = keyof typeof tabs;

export default function Navbar() {
  const [activeTab, setActiveTab] = useState<TabKey | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setActiveTab(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      ref={containerRef}
      className="relative z-50 w-full border-b"
    >
      <div className="flex px-6 py-2 justify-between items-center h-12">
        <div className="flex items-center space-x-6">
          <span className="font-bold text-xl tracking-wide">
            {"Satellite Simulator".toUpperCase()}
          </span>

          <div className="flex space-x-4 text-sm">
            {(Object.keys(tabs) as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(activeTab === tab ? null : tab)}
                className={`px-2 py-1 rounded hover:text-[#00ffff] hover:cursor-pointer ${
                  activeTab === tab ? "text-[#00ffff]" : ""
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex space-x-6 items-center text-sm font-medium">
          <PreferenceButton />
          <InformationCircleIcon className="h-6 w-6 cursor-pointer hover:text-[#00ffff]" />
        </div>
      </div>

      {/* 下拉浮出菜单 */}
      {activeTab && (
        <div className="bg-default left-40 top-12 rounded-md">
          {tabs[activeTab].map((item) => (
            <div
              key={item}
              className="hover:bg-[#00ffff] hover:text-black px-12 py-2 cursor-pointer whitespace-nowrap"
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}
