"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PerfilMonitor } from "@/types"
import { Star, Users, BookOpen } from "lucide-react"

interface MonitorProfileModalProps {
  perfil: PerfilMonitor | null
  isOpen: boolean
  onClose: () => void
}

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        } else if (i === fullStars && hasHalfStar) {
          return (
            <div key={i} className="relative">
              <Star className="h-4 w-4 text-gray-400" />
              <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
            </div>
          )
        } else {
          return <Star key={i} className="h-4 w-4 text-gray-400" />
        }
      })}
      <span className="ml-2 text-sm text-muted-foreground">({rating})</span>
    </div>
  )
}

export function MonitorProfileModal({
  perfil,
  isOpen,
  onClose,
}: MonitorProfileModalProps) {
  if (!perfil) return null

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Perfil del Monitor</DialogTitle>
          <DialogDescription>Información del monitor y sus ofertas</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Información del monitor */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {getInitials(perfil.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{perfil.name}</h3>
              <p className="text-sm text-muted-foreground">{perfil.email}</p>
              <div className="mt-2">
                <StarRating rating={perfil.calificacion} />
              </div>
            </div>
          </div>

          {/* Monitorías grupales */}
          {perfil.monitoriasGrupales.length > 0 && (
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Users className="h-4 w-4" />
                Monitorías Grupales
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                {perfil.monitoriasGrupales.map((monitoria) => (
                  <Card key={monitoria.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{monitoria.curso}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-xs">
                      <div>
                        {monitoria.diasYHorarios.map((dh, idx) => (
                          <p key={idx} className="text-muted-foreground">
                            {dh.dia} {dh.hora}
                          </p>
                        ))}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Aforo:{" "}
                        {monitoria.aforoMaximo === "ilimitado"
                          ? "Ilimitado"
                          : `${monitoria.aforoMaximo} estudiantes`}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Monitorías personalizadas */}
          {perfil.monitoriasPersonalizadas.length > 0 && (
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4" />
                Monitorías Personalizadas
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                {perfil.monitoriasPersonalizadas.map((monitoria) => (
                  <Card key={monitoria.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{monitoria.curso}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-xs">
                      <p className="font-medium">
                        ${monitoria.precioPorHora.toLocaleString("es-CO")}/hora
                      </p>
                      <p className="line-clamp-2 text-muted-foreground">
                        {monitoria.descripcion}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

