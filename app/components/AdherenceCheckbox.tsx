'use client';

import { useState } from 'react';
import { CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { TranslatedText } from './TranslatedText';

interface AdherenceCheckboxProps {
  adherenceId: string;
  medicineName: string;
  scheduledTime: string;
  scheduledDate: string;
  isTaken: boolean;
  onUpdate: () => void;
  size?: 'small' | 'large';
  showTime?: boolean;
}

export default function AdherenceCheckbox({
  adherenceId,
  medicineName,
  scheduledTime,
  scheduledDate,
  isTaken,
  onUpdate,
  size = 'small',
  showTime = true
}: AdherenceCheckboxProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/patient/adherence/${adherenceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_taken: !isTaken })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(isTaken ? 'Marked as not taken' : 'Marked as taken');
        onUpdate();
      } else {
        toast.error('Failed to update');
      }
    } catch (error) {
      console.error('Error updating adherence:', error);
      toast.error('Failed to update');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Check if overdue
  const now = new Date();
  const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
  const isOverdue = !isTaken && now > scheduledDateTime;
  const overdueStatus = isOverdue ? 'overdue' : null;

  return (
    <div 
      onClick={handleToggle}
      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${
        isTaken 
          ? 'bg-green-50 border border-green-200' 
          : isOverdue
          ? 'bg-red-50 border border-red-200 hover:bg-red-100'
          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
      } ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex-1">
        <p className={`font-bold ${
          size === 'large' ? 'text-base' : 'text-sm'
        } ${
          isTaken ? 'text-gray-500 line-through' : 
          isOverdue ? 'text-red-700' : 'text-gray-900'
        }`}>
          <TranslatedText>{medicineName}</TranslatedText>
        </p>
        
        {showTime && (
          <div className="flex items-center space-x-1 mt-0.5">
            <Clock className={`w-3 h-3 ${
              overdueStatus ? 'text-red-500' : 'text-gray-400'
            }`} />
            <span className={`text-xs ${
              isTaken ? 'text-gray-500' :
              overdueStatus ? 'text-red-600 font-semibold' : 'text-gray-600'
            }`}>
              {formatTime(scheduledTime)}
              {overdueStatus && <span className="ml-1">• <TranslatedText>OVERDUE</TranslatedText></span>}
            </span>
          </div>
        )}
      </div>

      {isTaken && (
        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 animate-bounce" />
      )}
    </div>
  );
}
