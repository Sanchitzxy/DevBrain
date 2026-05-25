"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Search() {
  const [query, setQuery] = useState("")

  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setIsSearching(true)
    
    // Simulate fast search response
    setTimeout(() => {
      setIsSearching(false)
    }, 600)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="w-full flex gap-2">
        <Input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across all repositories, docs, and notes..."
          className="w-full bg-[#111113] border-zinc-700 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-cyan-500/50"
          disabled={isSearching}
        />
        <Button 
          type="submit" 
          className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700"
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </form>
    </div>
  )
}
