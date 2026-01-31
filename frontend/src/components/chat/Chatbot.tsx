'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { sendChatMessage, type ChatResponse } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  sources?: string[];
}

function markdownToReact(text: string) {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const bold = /^\*\*(.+?)\*\*/.exec(remaining);
    const newline = /^\n/.exec(remaining);
    if (bold) {
      parts.push(<strong key={key++} className="font-semibold text-[var(--text-primary)]">{bold[1]}</strong>);
      remaining = remaining.slice(bold[0].length);
    } else if (newline) {
      parts.push(<br key={key++} />);
      remaining = remaining.slice(1);
    } else {
      const next = remaining.search(/\*\*|\n/);
      const chunk = next === -1 ? remaining : remaining.slice(0, next);
      parts.push(chunk);
      remaining = next === -1 ? '' : remaining.slice(next);
    }
  }
  return parts;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'bot',
      text: 'Hi! I can help you with stock prices and market overview. Try "What is AAPL?" or "Where to invest today?"',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const res: ChatResponse = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: res.reply,
          sources: res.sources,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'bot',
          text: 'Sorry, I could not reach the server. Make sure the backend is running.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] shadow-lg hover:opacity-90 transition-opacity flex items-center justify-center"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[480px] max-h-[70vh] flex flex-col bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl shadow-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 border-b border-[var(--border-primary)]">
              <span className="font-semibold text-[var(--text-primary)]">Investment assistant</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                      m.role === 'user'
                        ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                        : 'bg-[var(--bg-elevated)] border border-[var(--border-primary)] text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{markdownToReact(m.text)}</div>
                    {m.sources?.length ? (
                      <p className="text-xs opacity-80 mt-1">Sources: {m.sources.join(', ')}</p>
                    ) : null}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
                    <Loader2 size={18} className="animate-spin text-[var(--accent-primary)]" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 border-t border-[var(--border-primary)] flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask: AAPL price, where to invest today..."
                className="flex-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-primary)] px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--accent-primary)]"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2.5 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50 transition-opacity"
                aria-label="Send"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
