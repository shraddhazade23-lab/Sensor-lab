import React, { useState, useRef, useEffect } from 'react';
import { useAssistant } from '../../contexts/AssistantContext.jsx';
import { Sparkles, MessageCircle, X, Send, RotateCcw, Bot, AlertCircle, CheckCircle2 } from 'lucide-react';

export const FloatingAssistant = () => {
  const {
    isOpen,
    setIsOpen,
    messages,
    isTyping,
    sendMessage,
    clearChat,
    contextData
  } = useAssistant();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    sendMessage(inputVal);
    setInputVal('');
  };

  const quickPrompts = [
    'Explain what a sensor does',
    'Why is a resistor used with an LED?',
    'Digital vs Analog difference?',
    'Help me find a circuit mistake'
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2.5 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white px-4 py-3 rounded-full shadow-lg shadow-teal-700/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
          aria-label="Open AI Learning Assistant"
        >
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center animate-pulse-slow">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <span className="font-bold text-sm tracking-wide">Ask Sparky AI</span>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
          </span>
        </button>
      )}

      {/* Assistant Modal Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-extrabold text-sm tracking-tight">Sparky AI</h3>
                  <span className="px-1.5 py-0.2 bg-teal-800/80 text-[10px] font-semibold rounded text-teal-200 uppercase">
                    Mentor
                  </span>
                </div>
                <p className="text-[11px] text-teal-100 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Ready to help with electronics</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={clearChat}
                title="Clear Conversation"
                className="p-1.5 text-teal-200 hover:text-white hover:bg-teal-800/50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Assistant"
                className="p-1.5 text-teal-200 hover:text-white hover:bg-teal-800/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Context Banner */}
          {(contextData.currentLesson || contextData.currentProject || contextData.simulatorErrors?.length > 0) && (
            <div className="bg-teal-50 border-b border-teal-100 px-3 py-1.5 text-[11px] text-teal-800 flex items-center justify-between">
              <span className="truncate">
                Context: {contextData.currentProject ? contextData.currentProject.title : contextData.currentLesson?.title || 'Active Circuit Lab'}
              </span>
              {contextData.simulatorErrors?.length > 0 && (
                <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[10px] ml-1 shrink-0">
                  {contextData.simulatorErrors.length} Issue detected
                </span>
              )}
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      isAssistant
                        ? 'bg-white text-slate-800 border border-slate-200/90 shadow-sm'
                        : 'bg-teal-600 text-white rounded-br-xs shadow-sm'
                    }`}
                  >
                    {m.text}
                    {m.configuredStatus && (
                      <p className="mt-2 text-[10px] text-teal-700/80 border-t border-slate-100 pt-1 font-mono">
                        ℹ️ {m.configuredStatus}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2 text-xs text-slate-500 shadow-sm flex items-center space-x-1.5">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="ml-1 text-[11px] font-medium text-slate-400">Sparky is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div className="bg-white border-t border-slate-100 px-3 py-2 overflow-x-auto flex space-x-1.5 shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(prompt)}
                className="whitespace-nowrap bg-slate-100 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 text-slate-700 text-xs px-2.5 py-1 rounded-full border border-slate-200 transition-colors shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a question about your circuit..."
              maxLength={250}
              disabled={isTyping}
              className="flex-1 bg-slate-100 text-slate-800 placeholder-slate-400 text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white transition-all"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white p-2.5 rounded-xl shadow-sm transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};
