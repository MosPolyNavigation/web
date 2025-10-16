import { useState, useCallback, useRef, useEffect } from 'react'

interface UseDragOptions {
  onDragStart?: (clientY: number) => void
  onDragMove?: (clientY: number, deltaY: number) => void
  onDragEnd?: (deltaY: number) => void
  enabled?: boolean
}

interface UseDragReturn {
  isDragging: boolean
  translateY: number
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: () => void
  handleMouseDown: (e: React.MouseEvent) => void
}

export const useDrag = (options: UseDragOptions = {}): UseDragReturn => {
  const { onDragStart, onDragMove, onDragEnd, enabled = true } = options

  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [currentY, setCurrentY] = useState(0)
  const [translateY, setTranslateY] = useState(0)

  const handleStart = useCallback((clientY: number) => {
    if (!enabled) return
    
    setIsDragging(true)
    setStartY(clientY)
    setCurrentY(clientY)
    onDragStart?.(clientY)
  }, [enabled, onDragStart])

  const handleMove = useCallback((clientY: number) => {
    if (!isDragging || !enabled) return
    
    const deltaY = clientY - startY
    setCurrentY(clientY)
    setTranslateY(deltaY)
    onDragMove?.(clientY, deltaY)
  }, [isDragging, startY, enabled, onDragMove])

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    
    setIsDragging(false)
    const deltaY = currentY - startY
    setTranslateY(0)
    onDragEnd?.(deltaY)
  }, [isDragging, currentY, startY, onDragEnd])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handleStart(e.touches[0].clientY)
  }, [handleStart])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleMove(e.touches[0].clientY)
  }, [handleMove])

  const handleTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    handleStart(e.clientY)
  }, [handleStart])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleMove(e.clientY)
  }, [handleMove])

  const handleMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return {
    isDragging,
    translateY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
  }
}
