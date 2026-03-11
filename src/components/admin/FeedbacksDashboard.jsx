'use client'

import { useEffect, useState } from 'react'

export default function FeedbacksDashboard() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Remplacez par votre vraie route API
    fetch('/api/admin/feedbacks')
      .then(res => res.json())
      .then(data => {
        setFeedbacks(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-slate-400 text-sm">Chargement...</p>
  if (!feedbacks.length) return <p className="text-slate-400 text-sm">Aucun feedback pour l'instant.</p>

  return (
    <ul className="divide-y divide-slate-100">
      {feedbacks.map((fb) => (
        <li key={fb.id} className="py-4">
          <p className="text-sm font-medium text-slate-700">{fb.message}</p>
          <p className="text-xs text-slate-400 mt-1">{fb.author} — {new Date(fb.createdAt).toLocaleDateString('fr-FR')}</p>
        </li>
      ))}
    </ul>
  )
}