import {Button} from './ui/button'
import {User, LogIn} from 'lucide-react'
import { AuthModal } from './AuthModal'
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import UserDropdown from './UserDropdown';

function Header() {
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const auth = useAuth()
  
  useEffect(() => {
    if (showDropdown || openAuthModal) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (showDropdown) setShowDropdown(false);
          if (openAuthModal) setOpenAuthModal(false);
        }
      };
      document.addEventListener('keydown', onKey);
      return () => {
        document.removeEventListener('keydown', onKey);
      };
    }
  }, [showDropdown, openAuthModal]);

  const handleLogout = async () => {
    try {
      await auth?.signOutUser()
    } catch (error) {
      console.error("Error signing out", error)
    }
  }

  return (
    <div className = "w-full flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-800">Expense Tracker</h1>
      {!auth?.user ?
      (<Button onClick={() => setOpenAuthModal(true)} variant = 'outline' className=" px-4 py-2 rounded">
        Login
        <LogIn />
        </Button>):
      (
        <div className = 'relative'>
   
        <Button onClick={() => {
            setShowDropdown((prev) => !prev)
            console.log(auth?.user)
          }} 
          variant = 'outline' 
          className="p-0 h-fit w-fit rounded-full">
            <User className="h-4 w-4 m-2" />
        </Button>
        {showDropdown && <UserDropdown onLogout={handleLogout} />}
        </div>
    )}
      <AuthModal open={openAuthModal} setOpen={setOpenAuthModal} />
    </div>
  )
}

export default Header