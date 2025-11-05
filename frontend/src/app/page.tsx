'use client'

import { useEffect, useState } from 'react'
import styles from './page.module.css'

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...')
  const [apiMessage, setApiMessage] = useState<string>('')

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
        const response = await fetch(`${apiUrl}`)
        const data = await response.text()
        setApiMessage(data)
        setApiStatus('Connected')
      } catch (error) {
        setApiStatus('Disconnected')
        setApiMessage('Unable to connect to backend API')
      }
    }
    checkAPI()
  }, [])

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ClassMate V2</h1>
        <p className={styles.subtitle}>
          Full-stack application with NestJS, Next.js, and MongoDB
        </p>
        <div className={styles.statusCard}>
          <h2>Backend Status</h2>
          <p className={styles.status}>
            Status: <span className={apiStatus === 'Connected' ? styles.connected : styles.disconnected}>
              {apiStatus}
            </span>
          </p>
          {apiMessage && <p className={styles.message}>{apiMessage}</p>}
        </div>
      </div>
    </main>
  )
}
