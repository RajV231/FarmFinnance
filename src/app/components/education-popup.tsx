import React, { useState, useEffect } from 'react';
import { useGame } from '../context/game-context';
import { X, Lightbulb, BookOpen, CheckCircle } from 'lucide-react';
import { getEducationTip, formatTipForDisplay } from '../engine/education-engine';

interface EducationPopupProps {
  context: string;
  onClose: () => void;
}

export const EducationPopup: React.FC<EducationPopupProps> = ({ context, onClose }) => {
  const { state, dispatch } = useGame();
  const [tip, setTip] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Don't show if this tip was already shown in this session
    if (state.lastEducationTipId && hasBeenShown) {
      return;
    }

    const foundTip = getEducationTip(context);
    if (foundTip && foundTip.id !== state.lastEducationTipId) {
      setTip(foundTip);
      // Small delay for smooth animation
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [context]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (tip) {
        // Mark this tip as shown
        setHasBeenShown(true);
        onClose();
      }
    }, 300);
  };

  const handleMarkAsRead = () => {
    if (tip) {
      // In a real implementation, we'd dispatch an action to update lastEducationTipId
      handleClose();
    }
  };

  if (!tip) return null;

  const formattedTip = formatTipForDisplay(tip);

  return (
    <div 
      className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 relative">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-full">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Financial Tip</h3>
              <p className="text-sm text-white/90">Learn & Earn</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4">
            {formattedTip.headline}
          </h4>
          
          <div className="space-y-3 mb-6">
            {formattedTip.keyPoints.map((point: string, idx: number) => (
              <div key={idx} className="flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-game-primary mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleMarkAsRead}
            className="w-full py-3 bg-gradient-to-r from-game-primary to-green-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {formattedTip.callToAction}
          </button>

          {/* Progress indicator */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              💡 Pro Tip: Apply this knowledge to improve your financial decisions!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper hook to trigger education tips
export const useEducationTip = () => {
  const [currentContext, setCurrentContext] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const showTip = (context: string) => {
    setCurrentContext(context);
    setShowPopup(true);
  };

  const hideTip = () => {
    setShowPopup(false);
    setCurrentContext(null);
  };

  return {
    showTip,
    hideTip,
    isShowing: showPopup,
    currentContext
  };
};
