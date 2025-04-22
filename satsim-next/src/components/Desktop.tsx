// app/layout/DashboardLayout.tsx
"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Terminal from "./Terminal";
import Beginning from "./Beginning";
import { useStore } from "@/stores/dataStores";
import EditPanel from "./EditPanel";
import Scene from "./Scene";


export default function Desktop() {
  const { isFormOpen, selected, isDataEmpty } = useStore();
  return (
    <div className="h-screen">
      <PanelGroup direction="vertical" className="h-screen w-screen">
        <Panel defaultSize={5} minSize={5} maxSize={5}>
          <Topbar />
        </Panel>
        <PanelResizeHandle className="h-[2px] bg-gray-500 hover:bg-[#00ffff] cursor-row-resize" />
        <Panel defaultSize={75}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={15} maxSize={80}>
              <Sidebar />
            </Panel>
            <PanelResizeHandle className="w-[2px] bg-gray-500 hover:bg-[#00ffff] cursor-col-resize" />
            <Panel defaultSize={80}>
              <PanelGroup direction="vertical">
                <Panel>
                  {isDataEmpty() ? (
                    <Beginning />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-black">
                      <Scene />
                    </div>
                  )}
                  {isFormOpen && <EditPanel />}
                </Panel>
                <PanelResizeHandle className="h-[2px] bg-gray-500 hover:bg-[#00ffff] cursor-row-resize" />
                <Panel defaultSize={30} maxSize={80}>
                  <Terminal />
                </Panel>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
      </PanelGroup>
    </div>
  );
}
