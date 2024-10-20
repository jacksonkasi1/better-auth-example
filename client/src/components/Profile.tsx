'use client';

import { authClient } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

export const Profile = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const { data } = await authClient.useSession();
            // @ts-ignore
            setProfile(data?.user || null);
        };
        fetchProfile();
    }, []);

    if (!profile) return <div>Loading...</div>;

    return (
        <div>
            {/* @ts-ignore */}
            <h1 className="text-2xl">Welcome, {profile?.name}</h1>
            {/* @ts-ignore */}
            <img src={profile.image} alt="profile" />
            {/* @ts-ignore */}
            <p>Email: {profile.email}</p>
        </div>
    );
};
