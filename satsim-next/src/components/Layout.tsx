// app/layout/DashboardLayout.tsx
"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import Sidebar from "./Sidebar";
import Terminal from "./Terminal";
import Navbar from "./Navbar";
import Main from "./Main";

export default function Desktop() {
  return (
    <div className="flex flex-col h-screen w-screen">
      {/* 固定的导航栏 */}
      <div className="h-12 flex-shrink-0">
        <Navbar />
      </div>

      {/* 可伸缩的主内容区域 */}
      <div className="flex-1">
        <PanelGroup direction="horizontal" className="h-full w-full">
          {/* 左侧 Sidebar */}
          <Panel defaultSize={15} maxSize={80}>
            <Sidebar />
          </Panel>
          <PanelResizeHandle className="w-[2px] bg-gray-500 hover:bg-[#00ffff] cursor-col-resize" />

          {/* 中间内容 */}
          <Panel defaultSize={85}>
            <PanelGroup direction="vertical" className="h-full w-full">
              {/* Main 主内容 */}
              <Panel defaultSize={80}>
                <Main />
              </Panel>
              <PanelResizeHandle className="h-[2px] bg-gray-500 hover:bg-[#00ffff] cursor-row-resize" />

              {/* Terminal */}
              <Panel defaultSize={20} maxSize={80}>
                <Terminal />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
