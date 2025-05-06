// app/test-clerk.tsx
"use client"

import { useClerk } from '@clerk/nextjs';

export default function TestClerk() {
  const { loaded, user } = useClerk();
  
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="font-bold">Clerk Debug Info</h2>
      <p>Loaded: {loaded ? "✅" : "❌"}</p>
      <p>User: {user ? "Logged in" : "Not logged in"}</p>
      <p>Publishable Key: {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}</p>
    </div>
  );
}