import Link from "next/link";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import PreferenceButton from "./PreferenceButton";

export default function Navbar() {
  return (
    <nav className="flex px-6 py-2 justify-between items-center h-full w-full">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-xl">
          {"Satellite Simulator".toUpperCase()}
        </span>
      </div>

      <div className="flex space-x-8 text-sm font-medium">
        <PreferenceButton />
        <InformationCircleIcon className="h-6 w-6 cursor-pointer hover:text-blue-600 transition-colors" />
      </div>
    </nav>
  );
}
