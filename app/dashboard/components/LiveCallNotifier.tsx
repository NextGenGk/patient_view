'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { TranslatedText } from '../../components/TranslatedText';

export default function LiveCallNotifier() {
  const router = useRouter();
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const checkActiveCalls = async () => {
      try {
        const response = await fetch('/api/calls/check-active');
        const data = await response.json();

        if (data.active && data.calls && data.calls.length > 0) {
          const call = data.calls[0]; // Take the first active call
          
          if (call.aid !== activeCallId) {
            setActiveCallId(call.aid);
            
            // Play notification sound
            const audio = new Audio('/sounds/ringtone.mp3');
            audio.play().catch(e => console.log('Audio play failed', e));

            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center animate-pulse">
                         <Video className="h-6 w-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-3 flex-1">
                      <TranslatedText as="p" className="text-sm font-medium text-gray-900">
                        Incoming Video Call
                      </TranslatedText>
                      <TranslatedText as="p" className="mt-1 text-sm text-gray-500">
                        Your doctor is calling you to join the session.
                      </TranslatedText>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      router.push(`/dashboard/video-call/${call.aid}`);
                    }}
                    className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-bold text-primary-600 hover:text-primary-500 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <TranslatedText>Join Now</TranslatedText>
                  </button>
                </div>
              </div>
            ), {
              duration: Infinity,
              id: 'active-call-notification',
              position: 'top-right',
            });
          }
        } else {
             // If no active calls, dismiss notification
             if (activeCallId) {
                 toast.dismiss('active-call-notification');
                 setActiveCallId(null);
             }
        }
      } catch (error) {
        console.error('Error checking active calls:', error);
      }
    };

    // Initial check
    checkActiveCalls();

    // Poll every 5 seconds
    pollInterval = setInterval(checkActiveCalls, 5000);

    return () => clearInterval(pollInterval);
  }, [activeCallId, router]);

  return null;
}
