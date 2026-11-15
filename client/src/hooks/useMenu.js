import { useCallback, useEffect, useState } from 'react'
import { api } from '../api.js'

export function useMenu() {
  const [menu, setMenu] = useState({ categories: [], subcategories: [], products: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      const data = await api('/menu')
      setMenu(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { menu, loading, error, reload }
}