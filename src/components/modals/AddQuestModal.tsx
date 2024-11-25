import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ICON_OPTIONS, IconOption } from '@/lib/constants';

interface AddQuestModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddQuest: (title: string, iconPath: string) => void;
}

const AddQuestModal: React.FC<AddQuestModalProps> = ({ isVisible, onClose, onAddQuest }) => {
  const [selectedIcon, setSelectedIcon] = useState<string>(ICON_OPTIONS[0].imagePath);
  const [newQuestTitle, setNewQuestTitle] = useState<string>('');

  const handleAddQuest = () => {
    if (newQuestTitle.trim()) {
      onAddQuest(newQuestTitle.trim(), selectedIcon);
      setNewQuestTitle('');
      setSelectedIcon(ICON_OPTIONS[0].imagePath);
      onClose();
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add a Main Quest</DialogTitle>
          <DialogDescription className="text-gray-300">
            Create a new quest for Alto to complete
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex space-x-4 items-start">
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors duration-150 border border-gray-700">
                <img src={selectedIcon} className="h-8 w-8 rounded" alt="Selected icon" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700 min-w-0 w-[52px] h-[200px] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-1 gap-2">
                  {ICON_OPTIONS.map((option: IconOption) => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => setSelectedIcon(option.imagePath)}
                      className={`p-1 rounded cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${selectedIcon === option.imagePath ? 'bg-gray-600 ring-2 ring-yellow-400' : ''}`}
                    >
                      <img src={option.imagePath} className="h-8 w-8 rounded" alt={`Icon ${option.id}`} />
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1">
              <input
                type="text"
                value={newQuestTitle}
                onChange={(e) => setNewQuestTitle(e.target.value.slice(0, 40))}
                placeholder="Enter Main Quest"
                maxLength={40}
                className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddQuest();
                  }
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleAddQuest}
            className="px-4 py-2 rounded bg-yellow-400 text-black hover:bg-yellow-500"
            disabled={!newQuestTitle.trim()}
          >
            Add Quest
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddQuestModal;