import React, { useState, useEffect } from 'react';
import { useGame } from '../context/game-context';
import { MessageCircle, X, Send, Lightbulb, TrendingUp, Shield, Coins, AlertTriangle, Target } from 'lucide-react';
import { 
  generateAdvisoryMessages, 
  getReactiveAdvice, 
  markMessageShown, 
  AdvisorPersonality,
  getPersonalityDescription,
  setAdvisorPersonality
} from '../engine/advisor-engine';
import { AdvisoryMessage } from '../engine/advisor-engine';
import clsx from 'clsx';

export const AdvisorBot = () => {
  const { state } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AdvisoryMessage[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<AdvisorPersonality>('BALANCED');
  const [showPersonalitySelect, setShowPersonalitySelect] = useState(false);

  // Generate advisory messages when season changes or key state changes
  useEffect(() => {
    if (isOpen) {
      const newMessages = generateAdvisoryMessages(state);
      if (newMessages.length > 0) {
        setMessages(newMessages);
        // Mark messages as shown
        newMessages.forEach(msg => markMessageShown(msg.id));
      }
    }
  }, [state.seasonNumber, state.savings, state.debt, isOpen]);

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'CRITICAL': return 'bg-red-100 border-red-500 text-red-800';
      case 'HIGH': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'LOW': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'PROACTIVE': return <Lightbulb className="w-4 h-4" />;
      case 'REACTIVE': return <MessageCircle className="w-4 h-4" />;
      case 'EDUCATIONAL': return <TrendingUp className="w-4 h-4" />;
      case 'GOAL_TRACKING': return <Target className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const handleDismissMessage = (messageId: string) => {
    setMessages(messages.filter(m => m.id !== messageId));
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        aria-label="Open Krishi Mitra Advisor"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Advisor Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-lg max-h-[80vh] md:max-h-[70vh] rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Krishi Mitra</h2>
                  <p className="text-blue-100 text-xs">Your Farm Friend 🌾</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPersonalitySelect(!showPersonalitySelect)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                  title="Change Advisor Personality"
                >
                  <Lightbulb className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            {/* Personality Selection */}
            {showPersonalitySelect && (
              <div className="bg-blue-50 p-4 border-b border-blue-100">
                <h3 className="text-sm font-bold text-blue-800 mb-2">Choose Advisor Style:</h3>
                <div className="space-y-2">
                  {(['CAUTIOUS', 'BALANCED', 'RISK_TAKER'] as AdvisorPersonality[]).map((personality) => (
                    <button
                      key={personality}
                      onClick={() => {
                        setSelectedPersonality(personality);
                        setAdvisorPersonality(personality);
                        setShowPersonalitySelect(false);
                      }}
                      className={clsx(
                        "w-full p-3 rounded-lg text-left text-sm transition-all",
                        selectedPersonality === personality
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-white text-gray-700 hover:bg-blue-100"
                      )}
                    >
                      <div className="font-bold">{personality.replace('_', ' ')}</div>
                      <div className={clsx("text-xs mt-1", selectedPersonality === personality ? "text-blue-100" : "text-gray-500")}>
                        {getPersonalityDescription(personality)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages List */}
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lightbulb className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="font-bold text-gray-700 mb-1">All Caught Up!</h3>
                  <p className="text-sm text-gray-500">No new advice at the moment. Check back after your next harvest!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={clsx(
                      "border-l-4 rounded-lg p-3 shadow-sm animate-fade-in",
                      getPriorityColor(msg.priority)
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="opacity-70">{getCategoryIcon(msg.category)}</span>
                        <h4 className="font-bold text-sm">{msg.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDismissMessage(msg.id)}
                        className="text-xs opacity-50 hover:opacity-100"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-xs mt-2 leading-relaxed">{msg.message}</p>
                    
                    {msg.suggestion && (
                      <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                        <span className="font-bold">💡 Suggestion: </span>
                        {msg.suggestion}
                      </div>
                    )}
                    
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold opacity-60">
                        {msg.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] opacity-40">•</span>
                      <span className="text-[10px] opacity-60">
                        Priority: {msg.priority}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Tips */}
            <div className="bg-gray-50 p-4 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600">
                  <span className="font-bold">Tip: </span>
                  I analyze your farm's financial health and provide personalized advice. 
                  My suggestions are based on best practices, but final decisions are yours!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
