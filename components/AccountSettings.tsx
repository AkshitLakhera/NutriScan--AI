'use client'

import { UserProfile } from "@clerk/nextjs"

export function AccountSettings() {
  return (
    <div className="p-8 border rounded-lg">
      <UserProfile routing="hash" />
    </div>
  )
}
