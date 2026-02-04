'use client';

import { useEffect, useState } from 'react';

<<<<<<< HEAD
export default function PatientProfilePicture({ uid }: { uid?: string }) {
=======
export default function PatientProfilePicture({ uid, fallback }: { uid?: string; fallback?: string }) {
>>>>>>> 15f2075 (Patien_View final ver)
  const [profileImage, setProfileImage] = useState<string>('');

  useEffect(() => {
    if (uid) {
      fetchProfileImage();
    }
  }, [uid]);

  async function fetchProfileImage() {
    try {
      const response = await fetch('/api/sync-user');
      const { user } = await response.json();
<<<<<<< HEAD
      
=======

>>>>>>> 15f2075 (Patien_View final ver)
      if (user?.profile_image_url) {
        setProfileImage(user.profile_image_url);
      }
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  }

<<<<<<< HEAD
  if (!profileImage) return null;
=======
  if (!profileImage) {
    return (
      <span className="text-primary-700 font-semibold text-lg">
        {fallback || 'U'}
      </span>
    );
  }
>>>>>>> 15f2075 (Patien_View final ver)

  return (
    <img
      src={profileImage}
      alt="Profile"
      className="w-full h-full object-cover"
    />
  );
}
