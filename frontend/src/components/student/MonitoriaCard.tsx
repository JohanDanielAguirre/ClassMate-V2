"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MonitoriaDisponible } from "@/types"
import { Calendar, Clock, DollarSign, Users } from "lucide-react"

interface MonitoriaCardProps {
  monitoria: MonitoriaDisponible
  onClick: () => void
}

export function MonitoriaCard({ monitoria, onClick }: MonitoriaCardProps) {
  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{monitoria.curso}</CardTitle>
          <Badge variant={monitoria.tipo === "grupal" ? "default" : "secondary"}>
            {monitoria.tipo === "grupal" ? "Grupal" : "Personalizada"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {monitoria.tipo === "grupal" ? (
            <>
              {monitoria.fecha && monitoria.horario && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {monitoria.fecha} a las {monitoria.horario}
                  </span>
                </div>
              )}
              {monitoria.estudiantesConfirmados !== undefined && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{monitoria.estudiantesConfirmados} confirmados</span>
                </div>
              )}
            </>
          ) : (
            monitoria.precioPorHora && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>${monitoria.precioPorHora.toLocaleString("es-CO")}/hora</span>
              </div>
            )
          )}
          <div className="pt-2">
            <p className="text-sm font-medium text-muted-foreground">Monitor</p>
            <p className="text-sm">{monitoria.monitor.name}</p>
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xs text-yellow-400">★</span>
              <span className="text-xs text-muted-foreground">
                {monitoria.monitor.calificacion.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

