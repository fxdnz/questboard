import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AdventureModalProps {
  isVisible: boolean;
  onClose: () => void;
  onStartAdventure: () => void;
  adventureNumber: number;
  maxEnergy: number;
  isOnAdventure: boolean;
}

export default function AdventureModal({
  isVisible,
  onClose,
  onStartAdventure,
  adventureNumber,
  maxEnergy,
  isOnAdventure
}: AdventureModalProps): JSX.Element {
  return (
    <Dialog open={isVisible} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <DialogContent className="bg-gray-900 border-gray-800" onInteractOutside={(e) => {
        e.preventDefault();
      }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white text-center">
            Ready for Adventure!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-4">
          <div className="flex justify-center mr-10">
            <img 
              src="rightadv.gif" 
              alt="Character idle animation" 
              className="w-32 h-32 object-contain"
            />
          </div>

          <Card className="bg-gray-800 border-gray-700 p-4">
            <div className="text-center space-y-2">
              <p className="text-yellow-400 text-lg font-semibold">
                Energy Tank Full!
              </p>
              <div className="space-y-2">
            <p className="text-gray-300 text-sm text-center">
              Start an adventure to discover new treasures and earn diamonds! 
            </p>
          </div>
            </div>
          </Card>

          

          <Button
            onClick={onStartAdventure}
            disabled={isOnAdventure}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-2"
          >
            {isOnAdventure ? 'Adventure in Progress...' : 'Start Adventure!'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}