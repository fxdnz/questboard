import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';

interface RewardModalProps {
  isVisible: boolean;
  onClose: () => void;
  diamonds: number | null;
  onCollect: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({
  isVisible,
  onClose,
  diamonds,
  onCollect
}) => {
  if (!diamonds) return null;

  const handleCollect = () => {
    onCollect();
    onClose();
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-none p-4">
        <DialogTitle className="text-center text-2xl font-bold">
          Adventure Complete! 🎉
        </DialogTitle>

        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="text-center space-y-2">
            <p className="text-lg text-white">
              Alto has returned from the adventure with treasures!
            </p>
            <div className="flex items-center justify-center space-x-2 text-3xl font-bold">
              <span className="text-4xl" aria-hidden="true">💎</span>
              <span className="text-blue-500">{diamonds.toLocaleString()} diamonds</span>
            </div>
          </div>

          <div className="animate-bounce">
            <Button
              onClick={handleCollect}
              className="bg-yellow-400 text-black hover:bg-yellow-500 px-8 py-2 rounded-lg text-lg font-semibold"
            >
              Collect Reward
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardModal;