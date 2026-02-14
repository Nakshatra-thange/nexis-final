import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import  {useWalletAuth}  from '@/hooks/useWalletAuth'
export default function AppShell() {
  useWalletAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)

  const toggleSidebar = (): void => {
    setIsSidebarOpen(prev => !prev)
  }

  const closeSidebar = (): void => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-app-bg overflow-hidden">

      {/* Mobile overlay — clicking it closes the sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar with Lovable's slide animation */}
      <div
        className={`fixed md:relative z-40 h-full transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={closeSidebar} />
      </div>

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>

    </div>
  )
}