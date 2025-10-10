import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
function UserDropdown({onLogout}: {onLogout: () => void}) {
  return (
    <div className='absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg'>
      <div className='flex flex-col p-0 m-0'>
        <Button variant="ghost" className='py-2 px-5  text-center '>Profile</Button>
        <Button variant="ghost" className='py-2 px-5  text-center'>Settings</Button>
        <Button onClick = {() => {onLogout()}} variant="ghost" className='py-2 px-5  text-center'>Logout<LogOut /></Button>
      </div>
    </div>
  )
}

export default UserDropdown