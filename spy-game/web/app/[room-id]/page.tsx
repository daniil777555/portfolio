'use client'

import { useParams, useRouter } from 'next/navigation'
import { Suspense, useState, type SubmitEvent } from 'react'
import Button from '../components/Button'
import Dialog from '../components/Dialog'
import Input from '../components/Input'
import { useNotification } from '../components/NotificationProvider'
import { joinRoom } from '../components/room-service'

export default function InvitePage() {
  return <Suspense fallback={<main>Loading invitation...</main>}><InviteForm /></Suspense>
}

function InviteForm() {
  const { 'room-id': roomId } = useParams<{ 'room-id': string }>()
  const router = useRouter()
  const notify = useNotification()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Enter your name or nickname.')
      return
    }
    setPending(true)
    setError('')
    try {
      const player = await joinRoom(roomId, name.trim())
      router.replace(`/${encodeURIComponent(roomId)}/${encodeURIComponent(player.userId)}`)
    } catch (reason) {
      notify({ status: 'error', message: reason instanceof Error ? reason.message : 'Could not join the room.' })
      setPending(false)
    }
  }

  return (
    <main aria-label="Room invitation">
      <Dialog aria-labelledby="invite-title" onClose={() => router.push('/')} closeDisabled={pending}>
        <h1 id="invite-title">What should we call you?</h1>
        <form onSubmit={submit}>
          <Input id="invite-name" label="Name or nickname" value={name} onChange={event => setName(event.target.value)} autoComplete="nickname" autoFocus maxLength={32} disabled={pending} error={error} />
          <Button type="submit" className="w-full" loading={pending}>Join game</Button>
        </form>
      </Dialog>
      <style jsx>{`
        h1 { margin: 16px 0 24px; font-size: 1.6rem; text-align: center; }
      `}</style>
    </main>
  )
}
