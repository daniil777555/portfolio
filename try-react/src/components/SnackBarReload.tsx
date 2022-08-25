import React from 'react'

export function SnackBarReload() {
  const onReload = () => window.location.reload()

  return (
    <>
      <span className="font-semibold mr-2 text-sm">
        Something went wrong, click to reload
      </span>
      <button className="btn text-sm bg-yellow-500 text-gray-200 hover:bg-yellow-600 px-4 py-2 rounded-md" onClick={onReload}>
        Reload
      </button>
    </>
  )
}
