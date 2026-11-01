import React, { createContext, useContext, useState } from 'react';
import { aiService } from '../services/aiService.js';
import { useAuth } from './AuthContext.jsx';

const AssistantContext = createContext(null);

export const AssistantProvider = ({ children }) => {
  const { userProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi there! I'm Sparky ⚡, your AI electronics lab mentor. Ask me how circuits work, why we use resistors, or how to fix your virtual breadboard!"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [contextData, setContextData] = useState({
    currentLesson: null,
    currentProject: null,
    simulatorErrors: []
  });

  const sendMessage = async (text) => {
    if (!text || !text.trim()) return;

    const userMsg = {
      id: Math.random().toString(36).substr(2, 6),
      sender: 'user',
      text: text.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await aiService.askAssistant(text, {
        grade: userProfile?.grade || 6,
        currentLesson: contextData.currentLesson,
        currentProject: contextData.currentProject,
        simulatorErrors: contextData.simulatorErrors
      });

      const assistantMsg = {
        id: Math.random().toString(36).substr(2, 6),
        sender: 'assistant',
        text: response.text,
        isLiveAi: response.isLiveAi,
        configuredStatus: response.configuredStatus
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 6),
          sender: 'assistant',
          text: "I couldn't reach the AI service right now. Don't worry, remember: check if your wires form a complete loop between 5V and GND!"
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: "Chat cleared! How can I help you in the lab today?"
      }
    ]);
  };

  const updateAssistantContext = (newContext) => {
    setContextData(prev => ({ ...prev, ...newContext }));
  };

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        isTyping,
        sendMessage,
        clearChat,
        contextData,
        updateAssistantContext
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
};
