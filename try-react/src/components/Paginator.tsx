import React, { useEffect, useRef } from 'react'

interface IProps {
  page: number
  observed: () => void
}

export function Paginator({ page, observed }: IProps) {
  const visible = useRef(false)
  let observer: IntersectionObserver
  const paginator = useRef<HTMLDivElement>(null)

  const initObserver = () => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((el) => {
        onChange(el.isIntersecting)
      })
    })
  }

  const recheck = () => {
    if (visible.current) {
      observed()
    }
  }

  const onChange = (wasVisible: boolean) => {
    visible.current = wasVisible
    recheck()
  }

  useEffect(() => {
    if (paginator.current) {
      initObserver()
      observer.observe(paginator.current)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setTimeout(recheck, 300)
    // eslint-disable-next-line
  }, [page])


  return (
    <div
      className="paginator"
    >
      <div
        ref={paginator}
        className="paginator__core"
      />
    </div>
  )
}
