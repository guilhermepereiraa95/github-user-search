'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const router = useRouter();

  const handleSearch = () => {
    if (username) {
      router.push(`/user/${username}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md grid gap-4">
        <h1 className="text-3xl font-bold text-center mb-4">GitHub User Search</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </div>
  );
}
