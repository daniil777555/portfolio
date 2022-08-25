import React from 'react'
import { IUser } from '../types/UserTypes'

interface IProps {
  user: IUser,
  classList?: string
}

export function UserCard({ user, classList }: IProps) {
  const classes = 'px-5 py-5 w-full max-w-md bg-slate-700 shadow-md shadow-gray-600 rounded-xl ' + (classList ?? '')

  return (
    <div className={classes}>
      <div className='mb-3'>
        <h3 className="text-sm mb-1 font-semibold text-gray-400">Name</h3>
        <p className='text-base font-semibold'>{ user.name }</p>
      </div>
      <div className='mb-3'>
        <h3 className="text-sm mb-1 font-semibold text-gray-400">Email</h3>
        <p className='text-base font-semibold'>{ user.email }</p>
      </div>
      <div className='mb-3'>
        <h3 className="text-sm mb-1 font-semibold text-gray-400">Phone number</h3>
        <p className='text-base font-semibold'>{ user.phone }</p>
      </div>
      <div className='mb-3'>
        <h3 className="text-sm mb-1 font-semibold text-gray-400">Website</h3>
        <p className='text-base font-semibold'>{ user.website }</p>
      </div>
      <div className='mb-3'>
        <h3 className="text-sm mb-1 font-semibold text-gray-400">Address</h3>
        <p className='text-base font-semibold'>{ user.address.city }, { user.address.street }</p>
      </div>
      <div>
        <h3 className="text-sm mb-1 font-semibold text-gray-400">Company</h3>
        <p className='text-base font-semibold'>{ user.company.name }</p>
      </div>
    </div>
  )
}
