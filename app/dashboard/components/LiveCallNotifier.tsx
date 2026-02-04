'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Video } from 'lucide-react';
import toast from 'react-hot-toast';

<<<<<<< HEAD
import { TranslatedText } from '../../components/TranslatedText';

=======
>>>>>>> 15f2075 (Patien_View final ver)
export default function LiveCallNotifier() {
  const router = useRouter();
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const checkActiveCalls = async () => {
      try {
        // Sync user to get DB UID
        const syncRes = await fetch('/api/sync-user');
        const syncData = await syncRes.json();
        
        if (!syncData.user) return;

        const response = await fetch(`/api/patient/active-calls?uid=${syncData.user.uid}`);
        const data = await response.json();

        if (data.success && data.activeCalls?.length > 0) {
          const call = data.activeCalls[0];
          
          // Only notify if it's a new call or we haven't notified yet
          if (call.aid !== activeCallId) {
            setActiveCallId(call.aid);
            
            // Audio alert
            try {
              const audio = new Audio('/sounds/call-start.mp3'); // Assuming we might add this later, or just fail silently
              audio.play().catch(() => {});
            } catch (e) {}

            toast.custom(
              (t) => (
                <div
                  className={`${
                    t.visible ? 'animate-enter' : 'animate-leave'
                  } max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                  <div className="flex-1 w-0 p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
                            <Video className="h-6 w-6 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm font-bold text-gray-900">
<<<<<<< HEAD
                          <TranslatedText>Incoming Video Call</TranslatedText>
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          <TranslatedText>Dr.</TranslatedText> <TranslatedText>{call.doctor?.user?.name || 'Doctor'}</TranslatedText> <TranslatedText>has started the consultation.</TranslatedText>
=======
                          Incoming Video Call
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          Dr. {call.doctor?.user?.name || 'Doctor'} has started the consultation.
>>>>>>> 15f2075 (Patien_View final ver)
                        </p>
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
<<<<<<< HEAD
                      <TranslatedText>Join Now</TranslatedText>
=======
                      Join Now
>>>>>>> 15f2075 (Patien_View final ver)
                    </button>
                  </div>
                </div>
              ),
              {
                duration: Infinity, // Stay until clicked or dismissed
                id: 'active-call-notification', // Unique ID to prevent duplicates
                position: 'top-right',
              }
            );
          }
        } else {
            // If no active calls, dismiss existing toast if any
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

  return null; // Headless component
}
