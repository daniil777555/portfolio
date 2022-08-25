import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { IUser } from '../types/UserTypes'

export const usersAPI = createApi({
  reducerPath: 'users/api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com/'
  }),
  refetchOnFocus: true,
  endpoints: build => ({
    searchUsers: build.query<IUser[], any>({
      query: (_) => ({
        url: 'users'
      }),
      transformResponse: (response: IUser[]) => response
    })
  })
})

export const { useSearchUsersQuery } = usersAPI