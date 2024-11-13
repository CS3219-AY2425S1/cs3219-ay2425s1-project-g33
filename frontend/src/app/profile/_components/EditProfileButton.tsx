'use client'; // Make only this component a client component

import { useState } from 'react';
import { EditProfile } from './EditProfile';
import { UserProfile } from '@/types/User';

interface EditProfileButtonProps {
  userProfileDetails: UserProfile;
}

export default function EditProfileButton({ userProfileDetails }: EditProfileButtonProps) {
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
          userProfile={userProfileDetails}
        />
      )}
    </>
  );
}
