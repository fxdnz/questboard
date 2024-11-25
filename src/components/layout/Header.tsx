// src/components/layout/Header.tsx
export default function Header({ diamonds }: { diamonds: number }) {
    return (
      <div className="bg-transparent text-white p-4 flex justify-between items-center relative z-10">
        <div></div>
        <div className="flex items-center bg-gray-800 space-x-2 px-4 py-1 rounded-lg">
          <span>💎</span>
          <span>{diamonds.toLocaleString()}</span>
        </div>
      </div>
    );
  }