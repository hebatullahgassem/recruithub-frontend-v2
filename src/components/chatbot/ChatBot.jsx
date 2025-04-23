import { useState } from "react"
import { SendIcon } from "lucide-react"
import { Button } from "@mui/material"
import { TextField as Input } from "@mui/material"
import { Card } from "@mui/material"
import ChatMessage from "./ChatMessage"
import { askChatBot } from "../../services/Auth"

export default function ChatBot() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!input.trim()) return

    const question = input
    setInput("")
    setIsLoading(true)

    // Add user message immediately
    setMessages((prev) => [...prev, { question, response: "" }])

    try {
      const res = await askChatBot(question)
      const { answer } = res

      // Update the last message with the response
      setMessages((prev) => prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, response: answer } : msg)))
    } catch (error) {
      console.error("Error:", error)
      const errorMessage = error.response?.data?.message || "An error occurred"

      // Update the last message with the error
      setMessages((prev) =>
        prev.map((msg, idx) => (idx === prev.length - 1 ? { ...msg, response: errorMessage } : msg)),
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
      </div>

      <Card className="flex-1 overflow-y-auto p-4 mb-4 bg-muted/30">
        <div className="flex flex-col space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground text-center">Ask me anything to get started!</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={index}
                question={message.question}
                response={message.response}
                isLast={index === messages.length - 1 && isLoading}
              />
            ))
          )}
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          <SendIcon className="h-4 w-4 mr-2" />
          Send
        </Button>
      </form>
    </div>
  )
}
