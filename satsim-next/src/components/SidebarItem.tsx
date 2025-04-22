"use client";
import { useStore } from "@/stores/dataStores";
import {
  AtSymbolIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

type SidebarItemProps = {
  name: string;
  item: any;
  onRemove?: () => void;
};

const SidebarItem = ({ name, item, onRemove }: SidebarItemProps) => {
  const [hover, setHover] = useState(false);
  const { setSelected, setIsFormOpen } = useStore();

  const handleClick = () => {
    setSelected(item);
    setIsFormOpen(true);
  };

  return (
    <div className="w-full">
      <div
        className="flex items-center justify-between px-4"
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="flex text-white items-center space-x-1 cursor-pointer">
          <AtSymbolIcon className="h-4 w-4" />
          <h2 className="text-sm italic">{name}</h2>
        </div>
        {hover && (
          <div className="flex items-center space-x-1">
            {onRemove && (
              <button
                className="hover:text-[#00ffff] hover:cursor-pointer"
                onClick={onRemove}
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
            <button
              className="hover:text-[#00ffff] hover:cursor-pointer"
              onClick={handleClick}
            >
              <EllipsisVerticalIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarItem;
