import React, { useEffect, useContext } from 'react'
import { Skeleton } from '../components/Skeleton'
import { UserList } from '../components/UserList'
import { SnackBarContext } from '../context/snack-bar'
import { useSearchUsersQuery } from '../store/users.api'
import { ISnackBarEnum } from '../types/ISnackBarEnum'

export function UsersPage() {
  const { setComponentType, open } = useContext(SnackBarContext)
  const {isLoading, isError, data: users} = useSearchUsersQuery('', {
    refetchOnFocus: true
  })

  useEffect(() => {
    if (isError) {
      setComponentType(ISnackBarEnum.RELOAD)
      open()
    }
  }, [isError])

  return (
    <div className="mt-5">
      {
        (!!users && users.length) &&
        <UserList users={users}/>
      }
      {
        (isLoading) &&
        <Skeleton isLoading={true}/>
      }
      {
        (!isLoading && (!users || !users?.length)) &&
        <Skeleton />
      }
    </div>
  )
}