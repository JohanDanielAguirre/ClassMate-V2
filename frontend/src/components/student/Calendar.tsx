"use client"

import React, { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { MonitoriaEstudiante } from "@/types"

interface CalendarProps {
  monitorias: MonitoriaEstudiante[]
  onDayClick: (date: Date, monitorias: MonitoriaEstudiante[]) => void
  onMonitoriaClick: (monitoria: MonitoriaEstudiante) => void
}

const diasSemana = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const meses = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export function Calendar({
  monitorias,
  onDayClick,
  onMonitoriaClick,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const today = new Date()
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const getMonitoriasForDay = (day: number): MonitoriaEstudiante[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`
    return monitorias.filter((m) => m.fecha === dateStr)
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const days = []
  const emptyDays = Array(startingDayOfWeek).fill(null)

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  return (
    <div className="space-y-4">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={goToPreviousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {meses[month]}, {year}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={goToNextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-2">
        {diasSemana.map((dia) => (
          <div
            key={dia}
            className="p-2 text-center text-xs font-medium text-muted-foreground"
          >
            {dia}
          </div>
        ))}
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="h-24" />
        ))}
        {days.map((day) => {
          const dayMonitorias = getMonitoriasForDay(day)
          const showVerTodas = dayMonitorias.length > 2

          return (
            <div
              key={day}
              className={cn(
                "relative flex h-24 flex-col rounded-lg border bg-card p-2 transition-colors hover:bg-accent/50",
                isToday(day) && "ring-2 ring-primary"
              )}
            >
              <div className="absolute top-1 right-1 text-xs font-medium">
                {day}
              </div>
              <div className="mt-4 flex flex-1 flex-col gap-1.5">
                {dayMonitorias.slice(0, showVerTodas ? 1 : 2).map((monitoria) => (
                  <div
                    key={monitoria.id}
                    className="w-full cursor-pointer rounded-md border bg-secondary/50 px-2 py-1 text-xs transition-colors hover:bg-secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMonitoriaClick(monitoria)
                    }}
                  >
                    <span className="font-medium">{monitoria.curso}</span>{" "}
                    <span className="text-muted-foreground">{monitoria.horario}</span>
                  </div>
                ))}
                {showVerTodas && (
                  <div
                    className="w-full cursor-pointer rounded-md border border-border bg-background px-2 py-1 text-xs transition-colors hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation()
                      const date = new Date(year, month, day)
                      onDayClick(date, dayMonitorias)
                    }}
                  >
                    Ver todas
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

