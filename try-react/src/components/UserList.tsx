import React from 'react'
import { IUser } from '../types/UserTypes'
import { UserCard } from './UserCard'

interface IProps {
  users: IUser[],
  classes?: string
}

export function UserList({users, classes}: IProps) {
  const className = 'flex flex-col items-center justify-center mx-auto ' + (classes ?? '')
  return (
    <div className={className}>
      {
        !!users.length &&
        users.map(user => <UserCard user={user} key={user.id} classList={'mb-5'}/>)
      }
    </div>
  )
}
