import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { doSignOut } from '@/firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase/firebase';

const ProfileTab = () => {
  const [username, setUsername] = useState('');
  const [adventureNumber, setAdventureNumber] = useState(0);
  const [diamonds, setDiamonds] = useState(0);
  const [questCompletedCount, setQuestCompletedCount] = useState(0); // Added state for questCompletedCount
  const [error] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          throw new Error('No user logged in');
        }

        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userProgressDocRef = doc(firestore, 'userProgress', currentUser.uid);

        const [userDocSnap, userProgressDocSnap] = await Promise.all([
          getDoc(userDocRef),
          getDoc(userProgressDocRef)
        ]);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData.username || 'User');
          setDiamonds(userData.diamonds || 0);
          setQuestCompletedCount(userData.completedQuestsCount || 0); // Fetch questCompletedCount from user data
        } else {
          setUsername('User');
          setDiamonds(0);
          setQuestCompletedCount(0); // Set default to 0 if not found
        }

        if (userProgressDocSnap.exists()) {
          const userProgressData = userProgressDocSnap.data();
          const fetchedAdventureNumber = userProgressData.adventureProgress?.adventureNumber || 0;
          setAdventureNumber(Math.max(0, fetchedAdventureNumber - 1));
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUsername('User');
        setAdventureNumber(0);
        setDiamonds(0);
        setQuestCompletedCount(0); // Set to 0 if an error occurs
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await doSignOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleIconClick = () => {
    console.log('Bag Icon Clicked');
    // Add your logic for handling the icon click here
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-slate-900 text-white flex items-center justify-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 text-white overflow-y-auto pt-14 pb-28">
      {/* Profile Background */}
      <div>
        <div />
      </div>

      <button
        onClick={handleIconClick}
        className="absolute top-6 right-6 p-2 bg-gray-800 rounded-full focus:outline-none active:scale-90 transition-all ease-in-out shadow-lg "
      >
        <img 
          src="/bag.webp" // Assuming bag.webp is placed in the public directory
          alt="Bag Icon"
          className="w-10 h-10 rounded-full" // Apply white border to the image and optional rounded corners
        />
      </button>

      {/* Main Content Container */}
      <div className="max-w-3xl mx-auto px-4">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className={`bg-yellow-600 p-1 rounded-full mb-4 overflow-hidden w-32 h-32`}>
            <div className="bg-slate-900 p-1 rounded-full overflow-hidden w-full h-full">
              <img 
                src="idle.gif" 
                alt="Profile" 
                className="scale-150 overflow-hidden ml-5 mt-3"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">{username}</h2>
          <p className={`bg-yellow-600 px-4 py-1 rounded-full text-sm`}>
            Level {adventureNumber} Adventurer
          </p>
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
                <span className="text-white">{questCompletedCount.toLocaleString()}</span> {/* Display questCompletedCount */}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Adventures</span>
                <span className="text-white">{adventureNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Diamonds Earned</span>
                <span className="text-white">{diamonds.toLocaleString()} 💎</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gray-800">
            <div className="flex items-center space-x-2">
              <img src="/ach.webp" className="h-5 w-5 mb-2" alt="Icon" />
              <h2 className="font-medium mb-2 text-white">Badges</h2>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <img src="/badge.webp" className="rounded mb-1 text-white h-20 w-20" alt={`Badge ${i}`} />
                  <span className="text-xs text-gray-400">Badge {i}</span>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-2">
            <button className="w-full text-left text-white hover:bg-gray-700 rounded-lg flex items-center space-x-2 p-4 bg-gray-800 border border-white">
              <img src="/setting.webp" alt="Settings Icon" className="w-6 h-6" />
              <span>Settings</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left hover:bg-gray-700 rounded-lg text-red-400 flex justify-center px-10 p-4 bg-gray-800 border border-red-500"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
