'use client'; // Make only this component a client component

import { useState } from 'react';
import { EditProfile } from './EditProfile';
import { Profile } from '@/types/Profile';

interface EditProfileButtonProps {
  profileDetails: Profile;
}

export default function EditProfileButton({ profileDetails }: EditProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-primary text-sm font-semibold py-2 rounded-md"
      >
        Edit Profile
      </button>

      {/* Edit Profile Modal */}
      {isOpen && (
        <EditProfile
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          userProfile={profileDetails}
        />
      )}
    </>
  );
}
