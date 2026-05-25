"use client"

import { Chat } from "@/components/chat";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession()
  return (
    <div className="flex h-screen w-full bg-[#111113] text-white overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col bg-[#161618]">
        <div className="p-6">
          <h1 className="text-xl font-bold text-cyan-400">DevBrain AI</h1>
          <p className="text-xs text-zinc-500 mt-1">v2.4.0-stable</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800">
            <span className="mr-2">⎈</span> Knowledge Graph
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800">
            <span className="mr-2">🔍</span> Universal Search
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800">
            <span className="mr-2">💬</span> AI Chat
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-300 hover:text-white hover:bg-zinc-800">
            <span className="mr-2">⚡</span> Pipelines
          </Button>
          
          <div className="pt-4">
            <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
              New Project
            </Button>
          </div>
        </nav>

        <div className="p-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white">
            ⚙️ Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-white">
            ❓ Support
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#111113]">
          <div className="flex items-center gap-6">
            <h2 className="text-sm font-bold tracking-widest text-cyan-400 uppercase">Knowledge Workspace</h2>
            <nav className="flex gap-4 text-sm text-zinc-400">
              <a href="#" className="hover:text-white transition-colors">Docs</a>
              <a href="#" className="hover:text-white transition-colors">API</a>
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-black h-8 text-xs font-semibold px-4 rounded-full">
              Deploy Index
            </Button>
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors text-sm">
              🔔
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-400">{session?.user?.name}</span>
              <button 
                onClick={() => signOut()}
                className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center cursor-pointer hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-colors text-sm"
                title="Sign out"
              >
                ⏻
              </button>
            </div>
          </div>
        </header>

        {/* Workspace Area */}
        <div className="flex-1 overflow-auto p-6 flex gap-6">
          <div className="flex-1 flex flex-col gap-6">
            {/* Search Section */}
            <div className="bg-[#161618] border border-zinc-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-zinc-100">Semantic Search</h3>
              <Search />
            </div>

            {/* Chat Section */}
            <div className="bg-[#161618] border border-zinc-800 rounded-lg flex-1 flex flex-col overflow-hidden min-h-[400px]">
              <div className="p-4 border-b border-zinc-800">
                <h3 className="text-lg font-semibold text-zinc-100">AI Assistant</h3>
              </div>
              <div className="p-4 flex-1 overflow-hidden bg-[#111113] rounded-b-lg">
                <Chat />
              </div>
            </div>
          </div>

          {/* Right Sidebar (Insights / Health) */}
          <aside className="w-80 flex flex-col gap-6">
            <div className="bg-[#161618] border border-zinc-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg text-zinc-100">Semantic Health</h3>
                <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">Stable</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Indexed Nodes</p>
                  <p className="text-2xl font-bold text-zinc-100">14,203</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Semantic Coverage</p>
                  <p className="text-2xl font-bold text-cyan-400">84%</p>
                </div>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[84%]"></div>
              </div>
            </div>

            <div className="bg-[#161618] border border-zinc-800 rounded-lg p-6 flex-1">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-zinc-100">
                <span>✨</span> Intelligence Insights
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-zinc-800 rounded-lg bg-[#111113]">
                  <div className="flex gap-2 items-start text-red-400 mb-2">
                    <span>⚠️</span>
                    <h4 className="font-medium text-sm">Structural Debt Detected</h4>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">The `AuthModule` has grown to 45 interdependent nodes. Recommended split into sub-domains.</p>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">High Impact</span>
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">#Refactor</span>
                  </div>
                </div>

                <div className="p-4 border border-zinc-800 rounded-lg bg-[#111113]">
                  <div className="flex gap-2 items-start text-cyan-400 mb-2">
                    <span>📄</span>
                    <h4 className="font-medium text-sm text-zinc-200">Documentation Gap</h4>
                  </div>
                  <p className="text-xs text-zinc-400 mb-3">Index coverage for the new `/api/v2` endpoints is below 20%. Semantic context may be lost.</p>
                  <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">Action Required</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
