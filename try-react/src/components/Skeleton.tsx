import React from 'react'

export function Skeleton({
  isLoading = false
}: {
  isLoading?: boolean
}) {
  return (
    <div>
      {isLoading ? (
        <div>
          <img
            className="w-14 h-14 block mx-auto"
            src="./assets/loader.svg"
            alt="loader"
          />
        </div>
      ) : (
        <div className="px-8 py-8 max-w-md text-center mx-auto bg-slate-700 shadow-md shadow-gray-600 rounded-xl">
          <span className="text-2xl font-semibold">
            There's nothing
          </span>
        </div>
      )}
    </div>
  )
}
