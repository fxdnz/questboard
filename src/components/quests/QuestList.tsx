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
  isOnAdventure: boolean;
  adventureProgress: number;
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
  isOnAdventure,
  adventureProgress 
}) => {
  const [quickAddTitle, setQuickAddTitle] = useState<string>('');
  const [quickAddIcon, setQuickAddIcon] = useState<string>(DEFAULT_ICON);
  const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
  const [editStates, setEditStates] = useState<Record<number, EditState>>({});
  
  const iconOptions = ICON_OPTIONS;

  const createQuest = (title: string) => {
    if (!title.trim()) return null;

    const newQuest: Quest = {
      id: Date.now(),
      title,
      iconPath: quickAddIcon,
      energy: 5, // Always 3 energy per quest regardless of adventure state
      isEditing: false,
    };

    return newQuest;
  };

  const completeQuest = (quest: Quest) => {
    if (isOnAdventure) {
      // During adventure, add energy towards the next adventure
      setEnergy((prev) => Math.min(maxEnergy, prev + quest.energy));
    } else {
      // Not on adventure, add energy normally
      setEnergy((prev) => Math.min(maxEnergy, prev + quest.energy));
    }
    setQuests((prev) => prev.filter((q) => q.id !== quest.id));
  };

  const startEditing = (quest: Quest) => {
    setEditStates((prev) => ({
      ...prev,
      [quest.id]: {
        title: quest.title,
        iconPath: quest.iconPath
      }
    }));
    
    setQuests((prev) => prev.map((q) => ({
      ...q,
      isEditing: q.id === quest.id
    })));
  };

  const updateEditState = (questId: number, field: keyof EditState, value: string) => {
    setEditStates((prev) => ({
      ...prev,
      [questId]: { 
        ...prev[questId],
        [field]: value 
      }
    }));
  };

  const hasChanges = (quest: Quest): boolean => {
    const editState = editStates[quest.id];
    // If there's no edit state, there can't be any changes
    if (!editState) return false;
    
    // Consider changes in either title or icon
    return editState.title !== quest.title || editState.iconPath !== quest.iconPath;
  };

  const saveEdit = (questId: number) => {
    const editState = editStates[questId];
    if (!editState) return;
  
    const currentQuest = quests.find(q => q.id === questId);
    if (!currentQuest) return;
  
    // Update quest with changes, safely handling undefined values
    setQuests((prev) =>
      prev.map((quest) =>
        quest.id === questId
          ? {
              ...quest,
              // Keep existing title if editState.title is undefined or empty
              title: editState.title?.trim() || quest.title,
              // Always update icon if it's different
              iconPath: editState.iconPath || quest.iconPath,
              isEditing: false,
            }
          : quest
      )
    );
  
    // Clear edit state
    setEditStates((prev) => {
      const newState = { ...prev };
      delete newState[questId];
      return newState;
    });
  };

  const cancelEdit = (questId: number) => {
    setEditStates((prev) => {
      const newState = { ...prev };
      delete newState[questId];
      return newState;
    });

    setQuests((prev) => prev.map((quest) => ({
      ...quest,
      isEditing: quest.id === questId ? false : quest.isEditing
    })));
  };

  const deleteQuest = (id: number) => {
    setQuests((prev) => prev.filter((quest) => quest.id !== id));
  };

  const handleQuickAdd = () => {
    const newQuest = createQuest(quickAddTitle);
    if (newQuest) {
      setQuests((prev) => [...prev, newQuest]);
      setQuickAddTitle('');
      setQuickAddIcon(DEFAULT_ICON);
      setShowQuickAdd(false);
    }
  };

  const getEditStateTitle = (quest: Quest): string => {
    return editStates[quest.id]?.title ?? quest.title;
  };

  const getEditStateIconPath = (quest: Quest): string => {
    return editStates[quest.id]?.iconPath ?? quest.iconPath;
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
                      <img 
                        src={getEditStateIconPath(quest)} 
                        className="h-8 w-8 rounded" 
                        alt="Selected icon" 
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700 min-w-0 w-[52px] h-[200px] overflow-y-auto scrollbar-hide">
                      <div className="grid grid-cols-1 gap-2">
                        {iconOptions.map((option) => (
                          <DropdownMenuItem
                            key={option.id}
                            onClick={() => updateEditState(quest.id, 'iconPath', option.imagePath)}
                            className={`p-1 rounded cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${
                              getEditStateIconPath(quest) === option.imagePath ? 'bg-gray-600 ring-2 ring-yellow-400' : ''
                            }`}
                          >
                            <img src={option.imagePath} className="h-8 w-8 rounded" alt={`Icon ${option.id}`} />
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={getEditStateTitle(quest)}
                      onChange={(e) => updateEditState(quest.id, 'title', e.target.value.slice(0, 40))}
                      className="w-full p-2 pr-12 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          saveEdit(quest.id);
                        } else if (e.key === 'Escape') {
                          cancelEdit(quest.id);
                        }
                      }}
                    />
                    <div className="absolute right-3 top-2 text-gray-400 text-sm">
                      {40 - getEditStateTitle(quest).length}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => saveEdit(quest.id)} 
                    disabled={!hasChanges(quest)}
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => cancelEdit(quest.id)} 
                    className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
                  >
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
                <button
                  onClick={() => completeQuest(quest)}
                  className="p-1 rounded-full bg-green-600 hover:bg-green-500 active:bg-green-700 transform transition-transform duration-75 focus:outline-none"
                >
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

      {showQuickAdd ? (
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
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => setQuickAddIcon(option.imagePath)}
                        className={`p-1 rounded cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${
                          quickAddIcon === option.imagePath ? 'bg-gray-600 ring-2 ring-yellow-400' : ''
                        }`}
                      >
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
                    placeholder={isOnAdventure ? "Enter Adventure Quest" : "Enter Main Quest"}
                    className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleQuickAdd();
                      } else if (e.key === 'Escape') {
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
              <button
                onClick={handleQuickAdd}
                disabled={!quickAddTitle.trim()}
                className="px-4 py-2 rounded bg-yellow-400 text-black hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {isOnAdventure ? "Adventure Quest" : "Quest"}
              </button>
              <button
                onClick={() => {
                  setShowQuickAdd(false);
                  setQuickAddTitle('');
                }}
                className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <button
          onClick={() => setShowQuickAdd(true)}
          className="w-full p-3 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Add {isOnAdventure ? "Adventure Quest" : "Quest"}</span>
        </button>
      )}
    </div>
  );
};

export default QuestList;