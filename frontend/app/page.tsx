"use client";
import { useEffect, useState, useRef } from "react";
import CommitCard from "@/components/commit_card";
import { AnimatePresence, motion } from "framer-motion";

// Generate a consistent hex color based on the repo name
function getColorScheme(repoName: string): string {
    let hash = 0;
    for (let i = 0; i < repoName.length; i++) {
        hash = repoName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert hash to HSL
    const hue = Math.abs(hash) % 360;
    const saturation = 60; // vibrant but not too much
    const lightness = 60;  // soft and bright

    const rgb = hslToRgb(hue / 360, saturation / 100, lightness / 100);
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
}

// Helper to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Helper to convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
    return (
        "#" +
        [r, g, b]
            .map((x) => x.toString(16).padStart(2, "0"))
            .join("")
    );
}

export default function Home() {
    const [messages, setMessages] = useState<any[]>([]);
    const [pendingMessages, setPendingMessages] = useState<any[]>([]);
    const isProcessing = useRef(false);

    // Process pending messages with a delay to prevent animation conflicts
    useEffect(() => {
        if (pendingMessages.length > 0 && !isProcessing.current) {
            isProcessing.current = true;
            const nextMessage = pendingMessages[0];

            setMessages((prev) => {
                const newMessages = [nextMessage, ...prev].slice(0, 5);
                return newMessages;
            });

            setPendingMessages((prev) => prev.slice(1));

            setTimeout(() => {
                isProcessing.current = false;
            }, 150);
        }
    }, [pendingMessages, isProcessing.current]);

    useEffect(() => {
        const ws = new WebSocket(process.env.NEXT_PUBLIC_BACKEND_WS_URL || "ws://localhost:8000/ws");

        ws.onopen = () => {
            console.log("🦆 WebSocket quacked open!");
            ws.send(JSON.stringify({ message: "Hello from Quackstream client 🦆" }));
            setInterval(() => {
                ws.send(JSON.stringify({ message: "Ping from Quackstream client 🦆" }));
            }, 5000)
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(data);
                console.log(data.repository_name);

                // Add color based on repo name
                if (data.repository_name) {
                    data.color = getColorScheme(data.repository_name);
                }

                setPendingMessages((prev) => [...prev, data]);
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

        return () => ws.close();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 relative overflow-hidden">
            <div className="relative z-10 p-6 flex flex-col items-center">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center mb-10"
                >
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <h1 className="text-5xl font-bold text-gray-900">
                            QuackStream
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg font-medium">
                        Live commits streaming in real-time
                    </p>
                </motion.div>

                {/* Main content */}
                <div className="w-full max-w-2xl">
                    <ul className="flex flex-col space-y-4">
                        <AnimatePresence initial={false}>
                            {messages.length === 0 && (
                                <motion.li
                                    key="empty"
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{
                                        duration: 0.22,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                    className="text-center py-12"
                                >
                                    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-3xl p-8 shadow-lg">
                                        <motion.div
                                            animate={{
                                                y: [0, -8, 0],
                                                rotate: [0, 3, -3, 0]
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                            }}
                                            className="text-5xl mb-4"
                                        >
                                            🦆
                                        </motion.div>
                                        <p className="text-gray-700 text-xl font-medium mb-2">
                                            Waiting for commits to quack in...
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            Connect your repo and watch the magic happen
                                        </p>
                                    </div>
                                </motion.li>
                            )}
                            {messages.map((msg, index) => (
                                <motion.li
                                    key={msg.id}
                                    layout
                                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{
                                        duration: 0.22,
                                        ease: [0.4, 0, 0.2, 1],
                                        layout: { duration: 0.16, ease: "easeInOut" }
                                    }}
                                    style={{ zIndex: messages.length - index }}
                                >
                                    <div className="group transition-all duration-200">
                                        <CommitCard commit={msg} color={msg.color} />
                                    </div>
                                </motion.li>
                            ))}
                        </AnimatePresence>
                    </ul>
                </div>
            </div>
        </div>
    );
}
