import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/auth-context';
import Link from 'next/link';

const UserProfile: React.FC = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      setLoading(false);
    }
  }, [userProfile]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <div>No user found</div>;
  }

  return (
    <div>
      <Link href={`/contestant-profile/${userProfile.id}`}>
        Go to Contestant Profile
      </Link>
    </div>
  );
};

export default UserProfile;
