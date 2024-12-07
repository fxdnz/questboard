import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Check, Edit2, Trash2, Plus, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ICON_OPTIONS, DEFAULT_ICON } from '@/lib/constants';
import { Quest } from '@/types';

interface QuestListProps {
  quests: Quest[];
  setQuests: React.Dispatch<React.SetStateAction<Quest[]>>;
  setEnergy: React.Dispatch<React.SetStateAction<number>>;
  maxEnergy: number;
  isOnAdventure: boolean; // Keep this for potential future use, but don't restrict quest creation
}

interface EditState {
  title: string;
  iconPath: string;
}

const QuestList: React.FC<QuestListProps> = ({ 
  quests, 
  setQuests, 
  setEnergy, 
  maxEnergy, 
  isOnAdventure 
}) => {
  const [quickAddTitle, setQuickAddTitle] = useState<string>('');
  const [quickAddIcon, setQuickAddIcon] = useState<string>(DEFAULT_ICON);
  const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
  const [editStates, setEditStates] = useState<Record<number, EditState>>({});

  const iconOptions = ICON_OPTIONS;

  // Create a new quest - now always allows creation
  const createQuest = (title: string): Quest | null => {
    if (!title.trim()) return null;
    const newQuest: Quest = { 
      id: Date.now(), 
      title, 
      iconPath: quickAddIcon, 
      energy: 5, 
      isEditing: false 
    };
    return newQuest;
  };

  // Mark quest as complete
  const completeQuest = (quest: Quest) => {
    setEnergy(prev => Math.min(maxEnergy, prev + quest.energy));
    setQuests(prev => prev.filter(q => q.id !== quest.id));
  };

  // Start editing a quest
  const startEditing = (quest: Quest) => {
    setEditStates(prev => ({ ...prev, [quest.id]: { title: quest.title, iconPath: quest.iconPath } }));
    setQuests(prev => prev.map(q => (q.id === quest.id ? { ...q, isEditing: true } : q)));
  };

  // Update edit state
  const updateEditState = (questId: number, field: keyof EditState, value: string) => {
    setEditStates(prev => ({ ...prev, [questId]: { ...prev[questId], [field]: value } }));
  };

  // Check if there are changes to save
  const hasChanges = (quest: Quest): boolean => {
    const editState = editStates[quest.id];
    return editState?.title !== quest.title || editState?.iconPath !== quest.iconPath;
  };

  // Save changes to a quest
  const saveEdit = (questId: number) => {
    const editState = editStates[questId];
    if (!editState) return;

    setQuests(prev => prev.map(quest =>
      quest.id === questId
        ? { ...quest, title: editState.title.trim() || quest.title, iconPath: editState.iconPath || quest.iconPath, isEditing: false }
        : quest
    ));

    setEditStates(prev => {
      const newState = { ...prev };
      delete newState[questId];
      return newState;
    });
  };

  // Cancel editing a quest
  const cancelEdit = (questId: number) => {
    setEditStates(prev => {
      const newState = { ...prev };
      delete newState[questId];
      return newState;
    });
    setQuests(prev => prev.map(quest => (quest.id === questId ? { ...quest, isEditing: false } : quest)));
  };

  // Delete a quest
  const deleteQuest = (id: number) => {
    setQuests(prev => prev.filter(quest => quest.id !== id));
  };

  // Handle adding a new quest via quick add
  const handleQuickAdd = () => {
    const newQuest = createQuest(quickAddTitle);
    if (newQuest) {
      setQuests(prev => [...prev, newQuest]);
      setQuickAddTitle('');
      setQuickAddIcon(DEFAULT_ICON);
      setShowQuickAdd(false); // Hide quick add form
    }
  };

  return (
    <div className="space-y-4">
      {quests.map((quest) => (
        <Card key={quest.id} className="p-3 bg-gray-800 text-white">
          <div className="flex justify-between items-center">
            {quest.isEditing ? (
              <div className="flex-1 space-y-3">
                <div className="flex space-x-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors duration-150 border border-gray-700">
                      <img src={editStates[quest.id]?.iconPath || quest.iconPath} className="h-8 w-8 rounded" alt="Selected icon" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700 min-w-0 w-[52px] h-[200px] overflow-y-auto scrollbar-hide">
                      <div className="grid grid-cols-1 gap-2">
                        {iconOptions.map((option) => (
                          <DropdownMenuItem key={option.id} onClick={() => updateEditState(quest.id, 'iconPath', option.imagePath)} className={`p-1 rounded cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${editStates[quest.id]?.iconPath === option.imagePath ? 'bg-gray-600 ring-2 ring-yellow-400' : ''}`}>
                            <img src={option.imagePath} className="h-8 w-8 rounded" alt={`Icon ${option.id}`} />
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={editStates[quest.id]?.title || quest.title}
                      onChange={(e) => updateEditState(quest.id, 'title', e.target.value.slice(0, 40))}
                      className="w-full p-2 pr-12 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(quest.id);
                        else if (e.key === 'Escape') cancelEdit(quest.id);
                      }}
                    />
                    <div className="absolute right-3 top-2 text-gray-400 text-sm">{40 - (editStates[quest.id]?.title || quest.title).length}</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button onClick={() => saveEdit(quest.id)} disabled={!hasChanges(quest)} className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600">
                    Save
                  </button>
                  <button onClick={() => cancelEdit(quest.id)} className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <img src={quest.iconPath} className="rounded h-8 w-8" alt="Quest icon" />
                <span>{quest.title}</span>
              </div>
            )}

            {!quest.isEditing && (
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">{quest.energy}⚡</span>
                <button onClick={() => completeQuest(quest)} className="p-1 rounded-full bg-green-600 hover:bg-green-500 active:bg-green-700 transform transition-transform duration-75 focus:outline-none">
                  <Check size={16} className="text-white" strokeWidth={3} />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical size={16} className="text-gray-400" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 text-white border-gray-700">
                    <DropdownMenuItem onClick={() => startEditing(quest)} className="text-white focus:text-gray-200 cursor-pointer">
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Quest
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => deleteQuest(quest.id)} className="text-red-400 focus:text-red-300 cursor-pointer">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Quest
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </Card>
      ))}

      {!showQuickAdd && (
        <button onClick={() => setShowQuickAdd(true)} className="w-full p-3 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center justify-center space-x-2">
          <Plus size={20} />
          <span>Add Quest</span>
        </button>
      )}

      {showQuickAdd && !isOnAdventure && (
        <Card className="p-3 bg-gray-800">
          <div className="space-y-3">
            <div className="flex space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors duration-150 border border-gray-700">
                  <img src={quickAddIcon} className="h-8 w-8 rounded" alt="Selected icon" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 min-w-0 w-[52px] h-[200px] overflow-y-auto scrollbar-hide">
                  <div className="grid grid-cols-1 gap-2">
                    {iconOptions.map((option) => (
                      <DropdownMenuItem key={option.id} onClick={() => setQuickAddIcon(option.imagePath)} className={`p-1 rounded cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${quickAddIcon === option.imagePath ? 'bg-gray-600 ring-2 ring-yellow-400' : ''}`}>
                        <img src={option.imagePath} className="h-8 w-8 rounded" alt={`Icon ${option.id}`} />
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={quickAddTitle}
                    onChange={(e) => setQuickAddTitle(e.target.value.slice(0, 40))}
                    placeholder="Enter Quest"
                    className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleQuickAdd();
                      else if (e.key === 'Escape') {
                        setShowQuickAdd(false);
                        setQuickAddTitle('');
                      }
                    }}
                  />
                  <div className="absolute right-3 top-3 text-gray-400 text-sm">{40 - quickAddTitle.length}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-start space-x-2">
              <button onClick={handleQuickAdd} disabled={!quickAddTitle.trim()} className="px-4 py-2 rounded bg-yellow-400 text-black hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Add Quest
              </button>
              <button onClick={() => { setShowQuickAdd(false); setQuickAddTitle(''); }} className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuestList;
