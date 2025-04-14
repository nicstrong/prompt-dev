import { useState, useCallback } from 'react'

export function useHover() {
  const [hovering, setHovering] = useState(false)

  const onMouseEnter = useCallback(() => {
    setHovering(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setHovering(false)
  }, [])

  return [onMouseEnter, onMouseLeave, hovering] as const
}
