"use client";

import { useState } from "react";
import {
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useStore } from "@/stores/dataStores"; // ← 请替换为你实际的 store 路径
import SidebarItem from "./SidebarItem";

type PartProps = {
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
};
type SectionProps = {
  title: string;
  children: React.ReactNode;
  item: any;
  onAdd?: () => void;
  onRemove?: () => void;
};

function SidebarPart({ title, children, onAdd }: PartProps) {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  return (
    <div
      className={`w-full ${
        open && "bg-black/10 px-1 py-2"
      } border-t border-gray-500 select-none`}
    >
      <div
        className="flex items-center justify-between px-2"
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className="flex items-center space-x-1 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
          <h2 className="text-sm font-semibold">{title.toUpperCase()}</h2>
        </div>
        {hover && (
          <div className="flex items-center">
            {onAdd && (
              <button
                className="hover:text-[#00ffff] hover:cursor-pointer"
                onClick={onAdd}
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
      {open && <div className="pl-4">{children}</div>}
    </div>
  );
}

function SidebarSection({
  title,
  children,
  item,
  onAdd,
  onRemove,
}: SectionProps) {
  const [open, setOpen] = useState(true);
  const [hover, setHover] = useState(false);
  const { setSelected, setIsFormOpen } = useStore();

  const handleClick = () => {
    setSelected(item);
    setIsFormOpen(true);
  };

  return (
    <div className="w-full">
      <div
        className="flex items-center justify-between px-4 hover:text-white"
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className="flex items-center space-x-1 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {open ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
          <h2 className="text-sm">{title}</h2>
        </div>
        {hover && (
          <div className="flex items-center space-x-1">
            {onAdd && (
              <button
                className="hover:text-[#00ffff] hover:cursor-pointer"
                onClick={onAdd}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            )}
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
      {open && <div className="pl-4">{children}</div>}
    </div>
  );
}

export default function Sidebar() {
  const {
    data,
    setData,
    addStar,
    deleteStar,
    addPlanet,
    deletePlanet,
    addGroundStation,
    deleteGroundStation,
    addObservationPoint,
    deleteObservationPoint,
    addNaturalSatellite,
    deleteNaturalSatellite,
    addArtificialSatellite,
    deleteArtificialSatellite,
    downloadDataAsJSON,
  } = useStore();

  if (!data) {
    return <div className="p-4 text-gray-500">No data loaded</div>;
  }

  return (
    <div className="flex flex-col h-full w-full overflow-auto bg-black/30">
        <div className="flex items-center justify-between px-4 py-2">
          <h1 className="text-base">EXPLORER</h1>
          <div className="flex items-center justify-center space-x-2">
            <button
              className="hover:text-[#00ffff] rounded hover:cursor-pointer"
              onClick={() =>
                setData({
                  stars: [],
                  planets: [],
                  naturalSatellites: [],
                  artificialSatellites: [],
                })
              }
            >
              <FolderIcon className="h-5 w-5" />
            </button>
            <button
              className="hover:text-[#00ffff] rounded hover:cursor-pointer"
              onClick={downloadDataAsJSON}
            >
              <ArrowTopRightOnSquareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <SidebarPart title="Architecture" onAdd={addStar}>
          {/* Planets */}
          {(data.stars || []).map((star, idx) => (
            <SidebarSection
              key={`star-${idx}`}
              title={star.name}
              item={star}
              onAdd={addPlanet}
              onRemove={() => deleteStar(star.id)}
            >
              {(data.planets || [])
                .filter((plt) => plt.primary === star.id)
                .map((plt, pidx) => (
                  <SidebarSection
                    key={`plt-${pidx}`}
                    title={plt.name}
                    item={plt}
                    onAdd={addNaturalSatellite}
                    onRemove={() => deletePlanet(plt.id)}
                  >
                    {(data.naturalSatellites || [])
                      .filter((n) => n.primary === plt.id)
                      .map((nsat, nidx) => (
                        <SidebarSection
                          key={`nsat-${nidx}`}
                          title={nsat.name}
                          item={nsat}
                          onRemove={() => deleteNaturalSatellite(nsat.id)}
                        >
                          {(data.artificialSatellites || [])
                            .filter((a) => a.primary === nsat.id)
                            .map((asat, aidx) => (
                              <SidebarItem
                                key={`asat-${aidx}`}
                                name={asat.name}
                                item={asat}
                                onRemove={() =>
                                  deleteArtificialSatellite(asat.id)
                                }
                              />
                            ))}
                        </SidebarSection>
                      ))}
                    {(data.artificialSatellites || [])
                      .filter((sat) => sat.primary === plt.id)
                      .map((sat, sidx) => (
                        <SidebarItem
                          key={`sat-${sidx}`}
                          name={sat.name}
                          item={sat}
                          onRemove={() => deleteArtificialSatellite(sat.id)}
                        />
                      ))}
                  </SidebarSection>
                ))}
            </SidebarSection>
          ))}
        </SidebarPart>

        {/* Stars */}
        <SidebarPart title="Stars" onAdd={addStar}>
          {(data.stars || []).map((star, idx) => (
            <SidebarItem
              key={`star-${idx}`}
              name={star.name}
              item={star}
              onRemove={() => deleteStar(star.id)}
            />
          ))}
        </SidebarPart>

        {/* Planets */}
        <SidebarPart title="Planets" onAdd={addPlanet}>
          {(data.planets || []).map((planet, idx) => (
            <div key={`planet-${idx}`} className="space-y-1">
              <div className="flex items-center justify-between">
                <SidebarItem
                  name={planet.name}
                  item={planet}
                  onRemove={() => deleteNaturalSatellite(planet.id)}
                />
              </div>
            </div>
          ))}
        </SidebarPart>

        {/* Natural Satellites */}
        <SidebarPart
          title="Natural Satellites"
          onAdd={() => addNaturalSatellite()}
        >
          {(data.naturalSatellites || []).map((sat, idx) => (
            <div
              key={`nsat-${idx}`}
              className="flex items-center justify-between pl-2"
            >
              <SidebarItem
                name={sat.name}
                item={sat}
                onRemove={() => deleteNaturalSatellite(sat.id)}
              />
            </div>
          ))}
        </SidebarPart>

        {/* Artificial Satellites */}
        <SidebarPart
          title="Artificial Satellites"
          onAdd={addArtificialSatellite}
        >
          {(data.artificialSatellites || []).map((sat, idx) => (
            <div
              key={`asat-${idx}`}
              className="flex items-center justify-between pl-2"
            >
              <SidebarItem
                name={sat.name}
                item={sat}
                onRemove={() => deleteArtificialSatellite(sat.id)}
              />
            </div>
          ))}
        </SidebarPart>
    </div>
  );
}
