import React from 'react';
import { Card } from '@/components/ui/card';
import { doSignOut } from '@/firebase/auth'; // Import signOut function

const ProfileTab = () => {
  const handleLogout = async () => {
    try {
      await doSignOut(); // Log out the user
      window.location.reload(); // Optionally reload the page after logging out
    } catch (error) {
      console.error('Error signing out:', error);
      // You can handle the error here, like showing a toast notification or alert
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 text-white overflow-y-auto pt-14 pb-28">
      {/* Profile Background */}
      <div>
        <div />
      </div>

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
          <h2 className="text-3xl font-bold mb-2">Alto</h2>
          <p className={`bg-yellow-600 px-4 py-1 rounded-full text-sm`}>
            Level 5 Adventurer
          </p>
        </div>

        {/* Stats Section */}
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
              <button
                onClick={handleLogout} // Attach the logout handler
                className="w-full text-left p-2 hover:bg-gray-700 rounded text-red-400"
              >
                Log Out
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
