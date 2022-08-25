import React from 'react'
import { NavLink} from 'react-router-dom'

export function NavBar() {
  const className = ({isActive}: {isActive: boolean}) => {
    const basic = 'mr-2 hover:bg-gray-300/50 px-3 py-2 rounded'
    return isActive ? basic + ' bg-gray-300/50' : basic
  }
  return (
    <div className="sticky top-0 bg-slate-900">
      <nav className="px-2 py-5 flex justify-between">
        <h1 className='font-semibold text-xl'>
          TryReact
        </h1>
        <span>
          <NavLink to="/" className={className}>Home</NavLink>
          <NavLink to="/todos" className={className}>ToDo</NavLink>
          <NavLink to="/users" className={className}>Users</NavLink>
        </span>
      </nav>
    </div>
  )
}
