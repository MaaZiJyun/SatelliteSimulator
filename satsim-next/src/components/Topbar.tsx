import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Topbar() {
  return (
    <div className="px-4 py-2 flex justify-between items-center h-full space-x-4">
      <div className="flex items-center justify-center space-x-2">
        <GlobeAltIcon className="h-5 w-5" />
        <span className="font-bold text-xl">{"O.r.b.i.t".toUpperCase()}</span>
      </div>
    </div>
  );
}
