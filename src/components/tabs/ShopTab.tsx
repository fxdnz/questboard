import { useState } from 'react';
import type { Voucher } from '@/types';
import { VOUCHERS } from '@/data/voucherData'; // Import the vouchers

const ShopTab = () => {
  const [vouchers] = useState<Voucher[]>(VOUCHERS);

  // Group vouchers by rarity
  const groupedVouchers = vouchers.reduce((acc, voucher) => {
    acc[voucher.rarity] = acc[voucher.rarity] || [];
    acc[voucher.rarity].push(voucher);
    return acc;
  }, {} as Record<string, Voucher[]>);

  // Function to get rarity color
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Rare': return 'bg-blue-700';   // Blue color for Rare
      case 'Hero': return 'bg-purple-700'; // Purple color for Hero
      case 'Legendary': return 'bg-yellow-600'; // Yellow color for Legendary
      default: return 'bg-gray-500'; // Default gray color
    }
  };

  // Function to handle the purchase action
  const handleBuy = (voucher: Voucher) => {
    alert(`You have bought the ${voucher.title} for ${voucher.diamonds} 💎`);
  };

  return (
    <div className="pt-8">
      {/* Curtain Banner */}
      <div className="w-full max-w-3xl mx-auto relative z-20">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-yellow-400 to-yellow-600 z-30">
          <div className="curtain-effect absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-yellow-400 to-yellow-600 z-20">
            <div className="curtain-text text-center py-4">
              <h1 className="text-3xl font-extrabold text-black">Diamond Shop</h1>
              <p className="text-md text-gray-800 mt-2">Exclusive vouchers available now!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Grid (Grouped by Rarity) */}
      <div className="max-w-3xl mx-auto p-4 pt-32 bg-slate-800 grid gap-4">
        {Object.keys(groupedVouchers).map((rarity) => (
          <div key={rarity} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{rarity} Vouchers</h2>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
              {groupedVouchers[rarity].map((voucher) => (
                <div key={voucher.id} className="relative bg-slate-800 rounded-lg overflow-hidden shadow-lg">
                  {/* Card Header */}
                  <div className={`${getRarityColor(voucher.rarity)} p-2 text-center`}>
                    <div className="text-white font-semibold text-sm">
                      {voucher.title}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="bg-slate-700 p-4 flex flex-col items-center space-y-3">
                    {/* Item Icon */}
                    <div className="w-16 h-16 bg-slate-600 rounded-lg border-4 border-slate-500 flex items-center justify-center">
                      <img
                        src={voucher.icon}
                        alt={voucher.title}
                        className="w-12 h-12 object-contain"
                      />
                    </div>

                    {/* Item Rarity */}
                    <div className="text-center">
                      <h4 className="text-gray-200 font-semibold">{voucher.rarity}</h4>
                    </div>

                    {/* Price Button */}
                    <button
                      onClick={() => handleBuy(voucher)}
                      className={`w-full ${getRarityColor(voucher.rarity)} text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 hover:bg-opacity-80 transition-colors`}
                    >
                      <span className="text-lg">💎</span>
                      <span className="font-bold">x{voucher.diamonds.toLocaleString()}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopTab;
