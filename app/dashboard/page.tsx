import { UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <UserButton />
      </div>
      
      <p className="text-xl">
        Welcome, {user?.firstName || user?.emailAddresses[0].emailAddress}!
      </p>
    </div>
  )
}