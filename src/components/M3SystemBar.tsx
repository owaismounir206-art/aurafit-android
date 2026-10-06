import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export const M3SystemBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-5 pt-2 pb-1 text-xs font-medium tracking-tight text-m3-on-surface select-none z-50">
      <span className="font-semibold tracking-normal text-sm">{currentTime}</span>
      <div className="flex items-center space-x-2 opacity-85">
        <Signal className="w-3.5 h-3.5" />
        <span className="text-[10px] font-bold">5G</span>
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-1">
          <span className="text-[10px]">88%</span>
          <BatteryMedium className="w-4 h-4 text-m3-primary" />
        </div>
      </div>
    </div>
  );
};
