"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Search() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", query)
    // Placeholder for semantic search
  }

  return (
    <form onSubmit={handleSearch} className="w-full flex gap-2 max-w-2xl mx-auto">
      <Input 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search across all repositories, docs, and notes..."
        className="w-full"
      />
      <Button type="submit" variant="secondary">Search</Button>
    </form>
  )
}
