'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { fromEvent, of } from 'rxjs';
import { debounceTime, switchMap, catchError, tap } from 'rxjs/operators';

export default function Home() {
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (inputRef.current) {
      const input = inputRef.current;
      const input$ = fromEvent(input, 'input').pipe(
        debounceTime(300), 
        tap(() => {
          setIsLoading(true);
          setIsButtonEnabled(false);
        }),
        switchMap(() => {
          const query = (input as HTMLInputElement).value.trim();
          if (query) {
            return fetch(`https://api.github.com/search/users?q=${query}`)
              .then(response => response.json())
              .then(data => {
                const userFound = data.items.length > 0;
                setIsButtonEnabled(userFound);
                return userFound;
              })
              .catch(() => {
                setIsButtonEnabled(false);
                return false;
              });
          } else {
            setIsButtonEnabled(false);
            return of(false);
          }
        }),
        tap(() => setIsLoading(false)),
        catchError(() => {
          setIsButtonEnabled(false);
          setIsLoading(false);
          return of(false);
        })
      );

      const subscription = input$.subscribe();

      return () => subscription.unsubscribe();
    }
  }, [inputRef.current]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSearch = () => {
    if (username) {
      setIsLoading(true);
      router.push(`/user/${username}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md grid gap-4">
        <h1 className="text-3xl font-bold text-center mb-4">GitHub User Search</h1>
        <input
          ref={inputRef}
          type="text"
          value={username}
          onChange={handleInputChange}
          placeholder="Enter GitHub username"
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        {isLoading ? (
          <div className="w-full text-center p-3">Loading...</div>
        ) : (
          <button
            onClick={handleSearch}
            disabled={!isButtonEnabled}
            className={`w-full p-3 rounded-md 
                  ${isButtonEnabled ? 
                    'bg-blue-500 text-white hover:bg-blue-600' :
                    'bg-gray-300 text-gray-700 cursor-not-allowed'
                  }
              `}
          >
          {isButtonEnabled ?
            'Found!' :
            'Search an existing username'
          }
          </button>
        )}
      </div>
    </div>
  );
}
