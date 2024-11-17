'use client'

import React, { useState, useEffect } from 'react';
import { Home, Rocket, ShoppingBag, UserCircle2, Plus, MoreVertical, CheckCircle, Trash2, Check, Edit2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



interface Quest {
  id: number;
  title: string;
  energy: number;
  iconPath: string; // New field for storing the selected icon path
  isEditing?: boolean; // Added isEditing flag
}

interface IconOption {
  id: string;
  imagePath: string;
}

interface SideQuest {
  id: number;
  title: string;
  reward: number;
  progress: string;
  completed: boolean;
}

interface Voucher {
  id: number;
  title: string;
  diamonds: number;
  expires: string;
}

type TabType = 'home' | 'quests' | 'shop' | 'profile';

const App = () => {
  const [characterAnimation, setCharacterAnimation] = useState<string>('idle.gif');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editIcon, setEditIcon] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<string>('/quest.webp');
  const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
  const [quickAddTitle, setQuickAddTitle] = useState<string>('');
  const [energy, setEnergy] = useState<number>(0);
  const [diamonds] = useState<number>(1000);
  const [adventureNumber, setAdventureNumber] = useState<number>(1); // Add this state for tracking adventure number
  const [maxEnergy, setMaxEnergy] = useState<number>(15); // Initial max energy requirement
  const [showAdventureModal, setShowAdventureModal] = useState<boolean>(false);
  const [showAddQuestModal, setShowAddQuestModal] = useState<boolean>(false);
  const [quests, setQuests] = useState<Quest[]>([

  ]);

  const getOrdinalSuffix = (number: number): string => {
    // Get the last digit of the number
    const lastDigit = number % 10;
    // Get the last two digits of the number
    const lastTwoDigits = number % 100;
    
    // Special cases for 11, 12, 13
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return 'th';
    }
    
    // Handle other cases based on last digit
    switch (lastDigit) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };


  const startEditing = (quest: Quest): void => {
    const updatedQuests = quests.map(q => ({
      ...q,
      isEditing: q.id === quest.id
    }));
    setQuests(updatedQuests);
    setEditTitle(quest.title);
    setEditIcon(quest.iconPath);
  };

  const saveEdit = (id: number): void => {
    setQuests(quests.map(quest => {
      if (quest.id === id) {
        return {
          ...quest,
          title: editTitle,
          iconPath: editIcon,
          isEditing: false
        };
      }
      return quest;
    }));
    setEditTitle('');
    setEditIcon('');
  };

  const cancelEdit = (): void => {
    setQuests(quests.map(quest => ({
      ...quest,
      isEditing: false
    })));
    setEditTitle('');
    setEditIcon('');
  };

  const [sideQuests] = useState<SideQuest[]>([
    { 
      id: 1, 
      title: 'Start an adventure today', 
      reward: 500,
      progress: '0/1',
      completed: false 
    },
    { 
      id: 2, 
      title: 'Collect 1000 diamonds', 
      reward: 1000,
      progress: '0/1000',
      completed: false 
    }
  ]);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [newQuestTitle, setNewQuestTitle] = useState<string>('');
  const [vouchers] = useState<Voucher[]>([
    { id: 1, title: 'Koykoy 50PHP Voucher', diamonds: 5000, expires: '2024-12-31' },
    { id: 2, title: 'Nuda 100PHP', diamonds: 25000, expires: '2024-12-31' },
    { id: 3, title: 'Extra Quest Slot', diamonds: 7500, expires: '2024-12-31' }
  ]);

  const iconOptions: IconOption[] = [
    { id: 'default', imagePath: '/quest.webp' },
    { id: 'study',  imagePath: '/study.webp' },
    { id: 'exercise',  imagePath: '/exercise.webp' },
    { id: 'work', imagePath: '/work.webp' },
    
    // Add more icon options as needed
  ];

  const handleQuickAdd = (): void => {
    if (quickAddTitle.trim()) {
      const newQuest = {
        id: quests.length + 1,
        title: quickAddTitle.trim(),
        energy: 5,
        iconPath: selectedIcon // Add the selected icon
      };
      setQuests([...quests, newQuest]);
      setQuickAddTitle('');
      setShowQuickAdd(false);
      setSelectedIcon('/quest.webp'); // Reset to default icon
    }
  };

  useEffect(() => {
    if (energy >= maxEnergy) {
      setShowAdventureModal(true);
    }
  }, [energy, maxEnergy]);

  const startAdventure = (): void => {
    setEnergy(0);
    setAdventureNumber(prev => prev + 1);
    setMaxEnergy(prev => prev + 5);
    setShowAdventureModal(false);
    // Change the character animation to rightadv.gif
    setCharacterAnimation('rightadv.gif');
    
    // Reset the animation back to idle after 3 seconds
    setTimeout(() => {
      setCharacterAnimation('idle.gif');
    }, 300000);
  };

  const handleAddQuest = (): void => {
    if (newQuestTitle.trim()) {
      const newQuest: Quest = {
        id: quests.length + 1,
        title: newQuestTitle,
        energy: 5,
        iconPath: selectedIcon // Add the selected icon
      };
      setQuests([...quests, newQuest]);
      setNewQuestTitle('');
      setShowAddQuestModal(false);
      setSelectedIcon('/quest.webp'); // Reset to default icon
    }
  };

  const deleteQuest = (id: number): void => {
    setQuests(quests.filter(quest => quest.id !== id));
  };

  const completeQuest = (quest: Quest): void => {
    setEnergy(prev => Math.min(maxEnergy, prev + quest.energy));
    deleteQuest(quest.id);
  };

  const QuestList = (): JSX.Element => (
    <div className="space-y-4">
      {quests.map(quest => (
        <Card key={quest.id} className="p-3 bg-gray-800 text-white">
          <div className="flex justify-between items-center">
            {quest.isEditing ? (
              <div className="flex-1 space-y-3">
                <div className="flex space-x-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-2 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors duration-150 border border-gray-700">
                      <img src={selectedIcon} className="h-8 w-8 rounded" alt="Selected icon" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-700 min-w-0 w-[52px] h-[200px] overflow-y-auto scrollbar-hide"> {/* Adjusted width, added max height and scroll */}
                    <div className="grid grid-cols-1 gap-2"> {/* Changed to 1 column */}
                      {iconOptions.map((option) => (
                        <DropdownMenuItem
                          key={option.id}
                          onClick={() => setSelectedIcon(option.imagePath)}
                          className={`p-1 rounded cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${
                            selectedIcon === option.imagePath ? 'bg-gray-600 ring-2 ring-yellow-400' : ''
                          }`}
                        >
                          <img src={option.imagePath} className="h-8 w-8 rounded" alt={`Icon ${option.id}`} />
                        </DropdownMenuItem>
                      ))}
                    </div>
                  </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value.slice(0, 40))}
                    className="flex-1 p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        saveEdit(quest.id);
                      } else if (e.key === 'Escape') {
                        cancelEdit();
                      }
                    }}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveEdit(quest.id)}
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
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
                    {/* Add Edit option to dropdown */}
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
  
      {/* Quick Add Quest Section */}
      {showQuickAdd ? (
        
        <Card className="p-3 bg-gray-800">
          <div className="space-y-3">
            <div className="flex space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded hover:bg-gray-700 active:bg-gray-600 transition-colors duration-150 border border-gray-700">
                  <img src={selectedIcon} className="h-8 w-8 rounded" alt="Selected icon" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 min-w-0 w-[52px] h-[200px] overflow-y-auto scrollbar-hide"> {/* Adjusted width, added max height and scroll */}
                  <div className="grid grid-cols-1 gap-2"> {/* Changed to 1 column */}
                    {iconOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => setSelectedIcon(option.imagePath)}
                        className={`p-1 rounded cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${
                          selectedIcon === option.imagePath ? 'bg-gray-600 ring-2 ring-yellow-400' : ''
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
                    placeholder="Enter Main Quest"
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
                  <div className="absolute right-3 top-3 text-gray-400 text-sm">
                    {40 - quickAddTitle.length}
                  </div>
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
      ) : (
        <button
          onClick={() => setShowQuickAdd(true)}
          className="w-full p-3 rounded bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex items-center justify-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Quest</span>
        </button>
      )}
    </div>
  );

  const HomeContent = (): JSX.Element => {
    return (
      <div className="space-y-4 p-4">
        <div className="bg-gray-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/energy.webp" className="rounded h-8 w-8" />
              {/* Updated to show dynamic ordinal suffix */}
              <span className="text-white font-medium">
                {adventureNumber}
                <span className="text-xs align-top">
                  {getOrdinalSuffix(adventureNumber)}
                </span>
                {' Adventure'}
              </span>
            </div>
            <span className="text-white font-medium">{energy} / {maxEnergy}</span>
          </div>
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-yellow-400 rounded-full h-2 transition-all duration-300 ease-in-out" 
              style={{ width: `${(energy / maxEnergy) * 100}%` }}
            />
          </div>
          <div className="text-gray-300 text-sm">
            Gain ⚡ energy so Alto can go discover new things today!
          </div>
        </div>

        <div className="text-gray-300 flex items-center space-x-2">
          <span>{quests.length} main quests left for today!</span>
        </div>

        <QuestList />
      </div>
    );
  };

  const SideQuestsContent = (): JSX.Element => (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2">
            <img src="/side.webp" className="h-10 w-10 mb-5" alt="Icon" />
            <h2 className="text-xl font-bold text-white mb-4">Side Quests</h2>
          </div>
      {sideQuests.map(quest => (
        <Card key={quest.id} className="p-4 bg-gray-800 text-white">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <img src="/sidequest.webp" className="rounded w-10 h-10" />
                <span>{quest.title}</span>
              </div>
              <span className="text-sm font-medium text-yellow-400">
                {quest.reward} 💎
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Progress: {quest.progress}</span>
              <CheckCircle 
                size={20} 
                className={`${
                  quest.completed 
                    ? 'text-green-500 fill-green-500' 
                    : 'text-gray-600'
                }`}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const ShopContent = (): JSX.Element => (
    <div className="space-y-4 p-4">
      <div className="flex items-center space-x-2">
            <img src="/shop.webp" className="h-10 w-10 mb-5" alt="Icon" />
            <h2 className="text-xl font-bold text-white mb-4">Shop</h2>
          </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {vouchers.map(voucher => (
          <Card key={voucher.id} className="p-4 bg-gray-800 text-white">
            <div className="flex items-start space-x-3">
              <img src="/voucher.webp" className="rounded w-10 h-10" />
              <div className="flex-1">
                <h3 className="font-medium">{voucher.title}</h3>
                <div className="text-sm text-gray-400 mt-1">
                  Cost: {voucher.diamonds} 💎
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Expires: {voucher.expires}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const ProfileContent = (): JSX.Element => (
    <div className="p-4 space-y-6 text-white">
      <div className="flex flex-col items-center justify-center space-x-4">
        <div className="flex flex-col items-center justify-center space-x-4">
          <div className="flex flex-col items-center justify-center space-x-4">
            <h2 className="text-2xl font-bold">Alto</h2>
            <p className="text-gray-400">Level 5 Adventurer</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Card className="p-4 bg-gray-800">
          <div className="flex items-center space-x-2">
            <img src="/star.webp" className="h-5 w-5 mb-2" alt="Icon" />
            <h2 className="font-medium mb-2 text-white">Achievements</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Quests Completed</span>
              <span className="text-white">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Adventures</span>
              <span className="text-white">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Diamonds Earned</span>
              <span className="text-white">5,420 💎</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gray-800">
          <div className="flex items-center space-x-2">
            <img src="/ach.webp" className="h-5 w-5 mb-2" alt="Icon" />
            <h2 className="font-medium mb-2 text-white">Achievements</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <img src="/badge.webp" className="rounded mb-1 text-white h-20 w-20" />
                <span className="text-xs text-gray-400">Badge {i}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-gray-800">
          <div className="flex items-center space-x-2">
            <img src="/setting.webp" className="h-5 w-5 mb-1" alt="Icon" />
            <h2 className="font-medium mb-2 text-white">Settings</h2>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left text-white p-2 hover:bg-gray-700 rounded">
              Account Settings
            </button>
            <button className="w-full text-left text-white p-2 hover:bg-gray-700 rounded">
              Notifications
            </button>
            <button className="w-full text-left text-white p-2 hover:bg-gray-700 rounded">
              Privacy
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-700 rounded text-red-400">
              Log Out
            </button>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderContent = (): JSX.Element => {
    switch (activeTab) {
      case 'home':
        return <HomeContent />;
      case 'quests':
        return <SideQuestsContent />;
      case 'shop':
        return <ShopContent />;
      case 'profile':
        return <ProfileContent />;
      default:
        return <HomeContent />;
    }
  };

  return (
    
    <div className="min-h-screen bg-black flex flex-col max-w-3xl mx-auto relative">
      {/* Add winter background image as a fixed background */}
      <div 
        className="fixed inset-0 max-w-3xl mx-auto z-0"
        style={{
          backgroundImage: "url('/winter.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.8, // Adjust opacity to ensure content remains visible
        }}
      />
       {/* Add an overlay to ensure content readability */}
       <div className="fixed inset-0 max-w-3xl mx-auto bg-black opacity-30 z-0" />

        {/* Ensure all content is above the background by adding z-10 */}
      <div className="bg-transparent text-white p-4 flex justify-between items-center relative z-10">
        <div></div>
        <div className="flex items-center space-x-2">
          <span>💎</span>
          <span>{diamonds.toLocaleString()}</span>
        </div>
      </div>

      <AlertDialog open={showAdventureModal}>
        <AlertDialogContent className="bg-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Adventure Ready!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Alto has gathered enough energy to go on an adventure! 
              Start the journey to discover new things!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={startAdventure}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Start Adventure
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showAddQuestModal} onOpenChange={setShowAddQuestModal}>
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
                <DropdownMenuContent className="bg-gray-800 border-gray-700 min-w-0 w-[52px] h-[200px] overflow-y-auto scrollbar-hide"> {/* Adjusted width, added max height and scroll */}
                  <div className="grid grid-cols-1 gap-2"> {/* Changed to 1 column */}
                    {iconOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => setSelectedIcon(option.imagePath)}
                        className={`p-1 rounded cursor-pointer hover:bg-gray-700 focus:bg-gray-700 ${
                          selectedIcon === option.imagePath ? 'bg-gray-600 ring-2 ring-yellow-400' : ''
                        }`}
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
              onClick={() => setShowAddQuestModal(false)}
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
        
      <div className="flex-1 overflow-y-auto pb-20 relative z-10">
        {/* Changed background to transparent */}
        <div className="relative h-56 bg-transparent">
          <div className="absolute inset-0 flex justify-center items-center">
            <img 
              src={characterAnimation} // Use the dynamic animation state here
              alt="Center decoration" 
              className={`h-[180px] w-[160px] ml-10 ${
                // Add padding classes when rightadv.gif is selected
                characterAnimation === 'rightadv.gif' ? 'mr-20 ' : ''
              }`}
            />
          </div>
        </div>

        {renderContent()}
      </div>

      <div className="bg-gray-900/90 text-gray-400 p-4 fixed bottom-0 w-full max-w-3xl z-20">
        <div className="flex items-center justify-evenly w-full space-x-4">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center ${activeTab === 'home' ? 'text-yellow-400' : ''}`}
          >
            <Home size={24} />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`flex flex-col items-center ${activeTab === 'quests' ? 'text-yellow-400' : ''}`}
          >
            <Rocket size={24} />
            <span className="text-xs">Side</span>
          </button>

          <button 
            onClick={() => setShowAddQuestModal(true)}
            className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center -mt-4"
          >
            <Plus size={24} className="text-black" />
          </button>

          <button
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center ${activeTab === 'shop' ? 'text-yellow-400' : ''}`}
          >
            <ShoppingBag size={24} />
            <span className="text-xs">Shop</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center ${activeTab === 'profile' ? 'text-yellow-400' : ''}`}
          >
            <UserCircle2 size={24} />
            <span className="text-xs">Alto</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;