import React from 'react'

export function SnackBarReload() {
  const onReload = () => window.location.reload()

  return (
    <div className="fixed flex justify-between bg-inherit shadow-sm shadow-slate-100">
      <span className="font-semibold mr-2 text-sm">
        Something went wrong, click to reload
      </span>
      <svg className="fill-gray-200 w-6 h-6" onClick={ onReload }>
        <use href="../assets/svg/cross.svg"></use>
      </svg>
    </div>
  )
}
