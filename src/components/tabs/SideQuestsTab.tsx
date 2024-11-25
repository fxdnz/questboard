import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SideQuest {
  id: number;
  title: string;
  reward: number;
  progress: string;
  completed: boolean;
}

interface SideQuestsTabProps {
  sideQuests: SideQuest[];
  onClaim: (id: number) => void; // Callback to handle claim action
}

export default function SideQuestsTab({ sideQuests, onClaim }: SideQuestsTabProps) {
  const getProgress = (progress: string) => {
    const [current, total] = progress.split('/').map(Number);
    return (current / total) * 100;
  };

  return (
    <div>
      <div className="p-6">
        <div className="space-y-4">
          {sideQuests.map((quest) => {
            const progressPercentage = getProgress(quest.progress);

            return (
              <Card
                key={quest.id}
                className="p-5 bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">{quest.title}</h3>
                  </div>

                  <div >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-400">Progress</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-300">{quest.progress}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <Progress
                      value={progressPercentage}
                      className="h-2 bg-slate-700"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </Progress>

                    {/* Reward Display and Claim Button */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-full">
                        <span className="text-yellow-400 font-bold">{quest.reward}</span>
                        <span className="text-yellow-400">💎</span>
                      </div>

                      <button
                        className={`px-4 py-2 rounded-full text-white font-semibold ${
                          progressPercentage === 100
                            ? 'bg-green-600 hover:bg-green-500 active:bg-green-700'
                            : 'bg-gray-600 cursor-not-allowed'
                        }`}
                        onClick={() => onClaim(quest.id)}
                        disabled={progressPercentage !== 100} // Disable if progress is not 100%
                      >
                        {progressPercentage === 100 ? 'Claim' : 'Claim'}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
