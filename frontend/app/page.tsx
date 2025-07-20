"use client";
import { useEffect, useState } from "react";
import CommitCard from "@/components/commit_card";

export default function Home() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("🦆 WebSocket quacked open!");
      ws.send(JSON.stringify({ message: "Hello from Quackstream client 🦆" }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error("Error parsing message:", err);
      }
    };

    ws.onclose = () => {
      console.log("🦆 WebSocket quacked closed!");
    };

    ws.onerror = (error) => {
      console.error("⚠️ WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
      <ul className="flex-1 overflow-y-auto space-y-3 pr-2 pb-2">
        {messages.length === 0 && (
            <li className="text-yellow-700 italic text-center mt-10">
              Waiting for ducks to quack commits...
            </li>
        )}
        {messages.map((msg, id) => (
            <CommitCard commit={msg} key={id} />
        ))}
      </ul>
  );
}
