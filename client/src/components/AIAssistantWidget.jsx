import React, { useState, useRef, useEffect } from 'react';
import { Bot, Sparkles, X, Send, User, ChevronDown, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

const QUICK_PROMPTS = [
  'Where can I get authentic Kolhapuri Misal?',
  'What are Ambabai Temple timings and dress code?',
  'Tell me about Panhala Fort and Sajja Kothi',
  'Where to buy genuine GI-tagged Kolhapuri Chappals?',
  'Suggest a 2-day budget itinerary'
];

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'नमस्कार! I am **Shahu Margdarshak**, your official Kolhapur Tourism AI Assistant. Ask me anything about temples, historical forts, authentic culinary trails, or custom itineraries!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatAI({
        messages: newMessages.slice(-6),
        message: text
      });

      if (res && res.reply) {
        setMessages([...newMessages, { role: 'assistant', content: res.reply, source: res.source }]);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: 'I apologize, but I could not retrieve an answer at this moment. Please check your query or explore our destination pages.'
          }
        ]);
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I encountered a brief connection issue. Feel free to rephrase or try one of the recommended topics below!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'नमस्कार! I am **Shahu Margdarshak**, your official Kolhapur Tourism AI Assistant. Ask me anything about temples, historical forts, authentic culinary trails, or custom itineraries!'
      }
    ]);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#0878D1] hover:bg-[#1267B0] text-white px-4 py-3 rounded-full shadow-2xl flex items-center gap-2.5 transition-all duration-300 hover:scale-105 active:scale-95 group border-2 border-white"
          title="Open Kolhapur AI Tourism Guide"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#FF7900] group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>
          <span className="font-bold text-sm tracking-wide hidden sm:inline">Ask Kolhapur AI</span>
        </button>
      )}

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-[#E5E7EB] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0878D1] to-[#1267B0] text-white px-5 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-[#FF7900]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm tracking-wide">Shahu Margdarshak</h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    Live AI
                  </span>
                </div>
                <p className="text-[11px] text-white/80 font-medium">Kolhapur Tourism Intelligence</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Restart conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F5F8FC]/60 text-sm">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#0878D1] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm text-xs font-bold">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed text-[13px] shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-[#FF7900] text-white rounded-br-sm'
                      : 'bg-white text-[#17243A] border border-[#E5E7EB] rounded-bl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-1">
                    {msg.content}
                  </div>
                  {msg.source && (
                    <span className="text-[10px] text-gray-400 block mt-1.5 text-right">
                      {msg.source}
                    </span>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#17243A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 items-center text-xs text-[#6B7280]">
                <div className="w-7 h-7 rounded-full bg-[#0878D1] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  AI
                </div>
                <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0878D1] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#0878D1] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-[#0878D1] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-gray-500 font-medium">Consulting Kolhapur knowledge base...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-white border-t border-[#E5E7EB] overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="text-[11px] font-medium bg-[#F5F8FC] hover:bg-[#0878D1] hover:text-white text-[#17243A] px-2.5 py-1 rounded-full border border-[#E5E7EB] transition-colors shrink-0 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about temples, forts, misal, shopping..."
              disabled={loading}
              className="flex-1 bg-[#F5F8FC] border border-[#E5E7EB] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#17243A] focus:outline-none focus:border-[#0878D1] transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="bg-[#0878D1] hover:bg-[#1267B0] disabled:bg-gray-300 text-white p-2.5 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
