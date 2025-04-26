"use client";
import Scene from "./Scene";
import Beginning from "./Beginning";
import EditPanel from "./EditPanel";
import ViewStateBar from "./ViewStateBar";
import { useStore } from "@/stores/dataStores";

export default function Main() {
  const { isFormOpen, isDataEmpty } = useStore();
  if (isDataEmpty()) {
    return <Beginning />;
  } else
    return (
      <>
        {isFormOpen && <EditPanel />}
        <div className="h-full w-full flex flex-col items-center justify-center bg-black">
          <ViewStateBar />
          <Scene />
        </div>
      </>
    );
}
