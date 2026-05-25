"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid credentials. Please try 'demo' and 'demo123'.")
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111113] text-zinc-200">
      <div className="w-full max-w-md p-8 bg-[#161618] border border-zinc-800 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">DevBrain</h1>
          <p className="text-zinc-500">Sign in to your knowledge workspace</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-[#111113] border border-zinc-800 rounded-lg focus:outline-none focus:border-cyan-500 text-zinc-200 placeholder-zinc-600"
              placeholder="demo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#111113] border border-zinc-800 rounded-lg focus:outline-none focus:border-cyan-500 text-zinc-200 placeholder-zinc-600"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-lg transition-colors mt-6"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-zinc-600">
          Hint: Use <span className="text-zinc-400">demo</span> / <span className="text-zinc-400">demo123</span>
        </div>
      </div>
    </div>
  )
}
