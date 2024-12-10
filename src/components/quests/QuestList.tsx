import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Check, Edit2, Trash2, Plus, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ICON_OPTIONS, DEFAULT_ICON } from '@/lib/constants';
import { Quest } from '@/types';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  getDoc,
} from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth'; // Assuming you have an auth hook
import { firestore } from '@/firebase/firebase'; // Your Firebase config

interface QuestListProps {
  maxEnergy: number;
  setEnergy: React.Dispatch<React.SetStateAction<number>>;
  isOnAdventure: boolean;
}

interface EditState {
  title: string;
  iconPath: string;
}

const QuestList: React.FC<QuestListProps> = ({ 
  maxEnergy, 
  setEnergy, 
  isOnAdventure 
}) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [quickAddTitle, setQuickAddTitle] = useState<string>('');
  const [quickAddIcon, setQuickAddIcon] = useState<string>(DEFAULT_ICON);
  const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
  const [editStates, setEditStates] = useState<Record<string, EditState>>({});
  
  const { user } = useAuth(); // Get current authenticated user
  const iconOptions = ICON_OPTIONS;

  // Fetch quests for the current user
  useEffect(() => {
    if (!user) return;

    // Reference to the user's quests collection
    const questsRef = collection(firestore, 'users', user.uid, 'quests');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(questsRef, (snapshot) => {
      const fetchedQuests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Quest));

      setQuests(fetchedQuests);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  // Create a new quest in Firestore
  const createQuest = async (title: string) => {
    if (!user || !title.trim()) return null;

    try {
      const questsRef = collection(firestore, 'users', user.uid, 'quests');
      const newQuest: Omit<Quest, 'id'> = { 
        title, 
        iconPath: quickAddIcon, 
        energy: 5, 
        isEditing: false 
      };

      const docRef = await addDoc(questsRef, newQuest);
      return { ...newQuest, id: docRef.id };
    } catch (error) {
      console.error("Error adding quest:", error);
      return null;
    }
  };

  // Mark quest as complete
  const completeQuest = async (quest: Quest) => {
    if (!user) return;

    try {
        // Reference to the user's quests collection
        const questRef = doc(firestore, 'users', user.uid, 'quests', quest.id);

        // Create a record in a 'completedQuests' field within the user's document
        const userRef = doc(firestore, 'users', user.uid);
        
        // Batch write to handle both the quest deletion and user field update
        const batch = writeBatch(firestore);

        // Add a field to the user's document for tracking completed quests count
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const completedQuestsCount = (userDoc.data()?.completedQuestsCount || 0) + 1;

            batch.update(userRef, { completedQuestsCount });
        }

        // Delete the quest from 'quests' collection (optional, if you still want to remove it)
        batch.delete(questRef);

        // Commit the batch write
        await batch.commit();

        // Update energy in the user's main collection
        setEnergy((prev) => Math.min(maxEnergy, prev + quest.energy));

    } catch (error) {
        console.error("Error completing quest:", error);
    }
};



  // Start editing a quest
  const startEditing = (quest: Quest) => {
    setEditStates(prev => ({ ...prev, [quest.id]: { title: quest.title, iconPath: quest.iconPath } }));
    setQuests(prev => prev.map(q => (q.id === quest.id ? { ...q, isEditing: true } : q)));
  };

  // Update edit state
  const updateEditState = (questId: string, field: keyof EditState, value: string) => {
    setEditStates(prev => ({ ...prev, [questId]: { ...prev[questId], [field]: value } }));
  };

  // Check if there are changes to save
  const hasChanges = (quest: Quest): boolean => {
    const editState = editStates[quest.id];
    return editState?.title !== quest.title || editState?.iconPath !== quest.iconPath;
  };

  // Save changes to a quest
  const saveEdit = async (quest: Quest) => {
    if (!user) return;

    const editState = editStates[quest.id];
    if (!editState) return;

    try {
      const questRef = doc(firestore, 'users', user.uid, 'quests', quest.id);
      
      await updateDoc(questRef, {
        title: editState.title.trim() || quest.title,
        iconPath: editState.iconPath || quest.iconPath
      });

      // Update local state
      setQuests(prev => prev.map(q => 
        q.id === quest.id 
          ? { ...q, title: editState.title.trim() || quest.title, iconPath: editState.iconPath || quest.iconPath, isEditing: false } 
          : q
      ));

      // Clear edit state
      setEditStates(prev => {
        const newState = { ...prev };
        delete newState[quest.id];
        return newState;
      });
    } catch (error) {
      console.error("Error saving quest edit:", error);
    }
  };

  // Cancel editing a quest
  const cancelEdit = (questId: string) => {
    setEditStates(prev => {
      const newState = { ...prev };
      delete newState[questId];
      return newState;
    });
    setQuests(prev => prev.map(quest => (quest.id === questId ? { ...quest, isEditing: false } : quest)));
  };

  // Delete a quest
  const deleteQuest = async (id: string) => {
    if (!user) return;

    try {
      const questRef = doc(firestore, 'users', user.uid, 'quests', id);
      await deleteDoc(questRef);
    } catch (error) {
      console.error("Error deleting quest:", error);
    }
  };

  // Handle adding a new quest via quick add
  const handleQuickAdd = async () => {
    const newQuest = await createQuest(quickAddTitle);
    if (newQuest) {
      setQuickAddTitle('');
      setQuickAddIcon(DEFAULT_ICON);
      setShowQuickAdd(false);
    }
  };

  // Render method remains largely the same as before...
  return (
    <div className="space-y-4">
      {quests.map((quest) => (
        <Card key={quest.id} className="p-3 bg-gray-800 text-white">
          {/* Existing render logic with minor modifications */}
          {/* Replace all quest.id usages in event handlers with methods that pass the full quest object */}
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
                          <DropdownMenuItem 
                            key={option.id} 
                            onClick={() => updateEditState(quest.id, 'iconPath', option.imagePath)} 
                            className={`p-1 rounded cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${editStates[quest.id]?.iconPath === option.imagePath ? 'bg-gray-600 ring-2 ring-yellow-400' : ''}`}
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
                      value={editStates[quest.id]?.title || quest.title}
                      onChange={(e) => updateEditState(quest.id, 'title', e.target.value.slice(0, 40))}
                      className="w-full p-2 pr-12 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit(quest);
                        else if (e.key === 'Escape') cancelEdit(quest.id);
                      }}
                    />
                    <div className="absolute right-3 top-2 text-gray-400 text-sm">{40 - (editStates[quest.id]?.title || quest.title).length}</div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button 
                    onClick={() => saveEdit(quest)} 
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
                    <DropdownMenuItem 
                      onClick={() => startEditing(quest)} 
                      className="text-white focus:text-gray-200 cursor-pointer"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit Quest
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteQuest(quest.id)} 
                      className="text-red-400 focus:text-red-300 cursor-pointer"
                    >
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

      {/* Quick add section remains the same */}
      {!showQuickAdd && (
        <button 
          onClick={() => setShowQuickAdd(true)} 
          className="w-full p-3 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Quest</span>
        </button>
      )}

      {showQuickAdd && !isOnAdventure && (
        <Card className="p-3 bg-gray-800">
          {/* Quick add form remains mostly the same */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <DropdownMenu>
                {/* Icon selection dropdown */}
                <DropdownMenuTrigger className="p-2 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors duration-150 border border-gray-700">
                  <img src={quickAddIcon} className="h-8 w-8 rounded" alt="Selected icon" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 min-w-0 w-[52px] h-[200px] overflow-y-auto scrollbar-hide">
                  <div className="grid grid-cols-1 gap-2">
                    {iconOptions.map((option) => (
                      <DropdownMenuItem 
                        key={option.id} 
                        onClick={() => setQuickAddIcon(option.imagePath)} 
                        className={`p-1 rounded cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${quickAddIcon === option.imagePath ? 'bg-gray-600 ring-2 ring-yellow-400' : ''}`}
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
              <button 
                onClick={handleQuickAdd} 
                disabled={!quickAddTitle.trim()} 
                className="px-4 py-2 rounded bg-yellow-400 text-black hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Quest
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
      )}
    </div>
  );
};

export default QuestList;