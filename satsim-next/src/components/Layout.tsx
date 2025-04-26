// app/layout/DashboardLayout.tsx
"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "./Sidebar";
import Terminal from "./Terminal";
import Beginning from "./Beginning";
import { useStore } from "@/stores/dataStores";
import EditPanel from "./EditPanel";
import Scene from "./Scene";
import ViewStateBar from "./ViewStateBar";
import Navbar from "./Navbar";
import Main from "./Main";

export default function Desktop() {
  const { isFormOpen, selected, isDataEmpty } = useStore();
  return (
    <div className="h-screen">
      <PanelGroup direction="vertical" className="h-screen w-screen">
        <Panel defaultSize={5} minSize={5} maxSize={5}>
          <Navbar />
        </Panel>
        <PanelResizeHandle className="h-[2px] bg-gray-500 hover:bg-[#00ffff] cursor-row-resize" />
        <Panel defaultSize={95}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={16} maxSize={80}>
              <Sidebar />
            </Panel>
            <PanelResizeHandle className="w-[2px] bg-gray-500 hover:bg-[#00ffff] cursor-col-resize" />
            <Panel defaultSize={84}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={70}>
                 <Main/>
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
