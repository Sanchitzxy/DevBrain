"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([])
  const [input, setInput] = useState("")

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setMessages([...messages, { role: "user", content: input }])
    setInput("")
    
    // Simulate fast streaming response
    const mockResponse = "I found the authentication logic in `src/auth/identity_provider.ts`. It uses JWT tokens and connects directly to the new Identity API service you deployed last week."
    
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "" }
    ])

    let i = 0
    const intervalId = setInterval(() => {
      if (i < mockResponse.length) {
        setMessages((prev) => {
          const newMessages = [...prev]
          newMessages[newMessages.length - 1].content = mockResponse.substring(0, i + 1)
          return newMessages
        })
        i++
      } else {
        clearInterval(intervalId)
      }
    }, 20) // Fast 20ms typewriter effect
  }

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle>AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-[400px]">
        <div className="flex-1 overflow-y-auto space-y-4 p-4 border rounded-md bg-muted/20">
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-center mt-10">Ask a question about your repos...</p>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <Input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Where is the authentication logic?" 
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </CardContent>
    </Card>
  )
}
