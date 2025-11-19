"use client"

import { useEffect, useState, useCallback } from 'react'
import { api, ApiError } from '@/lib/api'
import { Rating } from '@/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'

interface MonitoriaConfirmadaItem {
  _id: string
  fecha: string
  horario: string
  curso: string
  espacio: string
  tipo: 'personalizada' | 'grupal'
  monitorId: string
  monitor?: { id: string; name: string }
  estudiantes: { id: string; name: string }[]
}

export default function MonitoriasConfirmadasPage() {
  const [monitorias, setMonitorias] = useState<MonitoriaConfirmadaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ratingScore, setRatingScore] = useState<Record<string, number>>({})
  const [ratingComment, setRatingComment] = useState<Record<string, string>>({})
  const [myRatings, setMyRatings] = useState<Record<string, Rating | null>>({})
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({})

  const estudianteId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null')?.id : null

  const loadMonitorias = useCallback(async () => {
    if (!estudianteId) return
    setLoading(true)
    setError(null)
    try {
      const data = await api.getMonitoriasConfirmadasEstudiante(estudianteId)
      setMonitorias(data)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Error al cargar monitorías confirmadas')
    } finally {
      setLoading(false)
    }
  }, [estudianteId])

  const loadMyRatings = useCallback(async () => {
    if (!monitorias.length) return
    const entries: Record<string, Rating | null> = {}
    for (const m of monitorias) {
      try {
        const r = await api.getMyRatingForMonitoria(m._id)
        entries[m._id] = r || null
      } catch {
        entries[m._id] = null
      }
    }
    setMyRatings(entries)
  }, [monitorias])

  useEffect(() => {
    loadMonitorias()
  }, [loadMonitorias])

  useEffect(() => {
    loadMyRatings()
  }, [loadMyRatings])

  const handleRate = async (monitoriaId: string) => {
    const score = ratingScore[monitoriaId]
    if (!score || score < 1 || score > 5) {
      alert('La calificación debe estar entre 1 y 5')
      return
    }
    setSubmitting((prev) => ({ ...prev, [monitoriaId]: true }))
    try {
      const comentario = ratingComment[monitoriaId] || undefined
      await api.rateMonitoria(monitoriaId, score, comentario)
      alert('Calificación enviada')
      // Forzar recarga del rating propio
      const r = await api.getMyRatingForMonitoria(monitoriaId)
      setMyRatings((prev) => ({ ...prev, [monitoriaId]: r }))
    } catch (err) {
      const apiError = err as ApiError
      alert(apiError.message || 'Error al calificar')
    } finally {
      setSubmitting((prev) => ({ ...prev, [monitoriaId]: false }))
    }
  }

  const renderStars = (filled: number, onClick?: (value: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1,2,3,4,5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={onClick ? () => onClick(n) : undefined}
            className={`p-1 rounded ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
            aria-label={`Calificar ${n}`}
          >
            <Star className={`h-5 w-5 ${n <= filled ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Mis Monitorías Confirmadas</h1>
      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {!loading && !error && monitorias.length === 0 && (
        <p className="text-sm text-muted-foreground">No tienes monitorías confirmadas aún.</p>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {monitorias.map((m) => {
          const myRating = myRatings[m._id]
          const isRated = !!myRating
          return (
            <Card key={m._id} className="flex flex-col">
              <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium">{m.curso}</h2>
                  <span className="text-xs px-2 py-1 rounded bg-accent text-accent-foreground uppercase">{m.tipo}</span>
                </div>
                <p className="text-sm text-muted-foreground">{m.fecha} a las {m.horario}</p>
                <p className="text-xs">Espacio: {m.espacio}</p>
                {m.monitor && (
                  <p className="text-xs">Monitor: {m.monitor.name}</p>
                )}
                <div className="mt-auto space-y-2">
                  {isRated ? (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold">Tu calificación:</p>
                      {renderStars(myRating.score)}
                      {myRating.comentario && (
                        <p className="text-xs italic">"{myRating.comentario}"</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label className="text-xs">Calificar</Label>
                      {renderStars(ratingScore[m._id] || 0, (value) => setRatingScore((prev) => ({ ...prev, [m._id]: value })))}
                      <Textarea
                        rows={2}
                        placeholder="Comentario (opcional)"
                        value={ratingComment[m._id] || ''}
                        onChange={(e) => setRatingComment((prev) => ({ ...prev, [m._id]: e.target.value }))}
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleRate(m._id)}
                        disabled={submitting[m._id]}
                      >
                        {submitting[m._id] ? 'Enviando...' : 'Enviar Calificación'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
