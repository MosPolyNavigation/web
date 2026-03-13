import React, { useCallback, useEffect, useRef, useState } from 'react'

interface UseDragOptions {
  onDragStart?: (clientY: number) => void
  onDragMove?: (clientY: number, deltaY: number) => void
  onDragEnd?: (deltaY: number) => void
  enabled?: boolean
  minTranslateY?: number | null
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
  const { onDragStart, onDragMove, onDragEnd, enabled = true, minTranslateY = 0 } = options

  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [translateY, setTranslateY] = useState(0)
  const scrollablesRef = useRef<{ el: HTMLElement; startScrollTop: number; startScrollBottom: number }[]>([])

  const getScrollableAncestors = useCallback((el: HTMLElement | null): HTMLElement[] => {
    const result: HTMLElement[] = []
    let node: HTMLElement | null = el
    while (node) {
      const style = getComputedStyle(node)
      const overflow = style.overflow + style.overflowY
      if (overflow.includes('auto') || overflow.includes('scroll')) {
        result.push(node)
      }
      node = node.parentElement
    }
    return result
  }, [])

  const handleStart = useCallback(
    (clientY: number, event: TouchEvent | MouseEvent, noStart?: boolean) => {
      if (!enabled) return
      // Получаем все scrollable элементы целевой и родительские и их начальные позиции
      try {
        const scrollables = getScrollableAncestors(event.target as HTMLElement)
        scrollablesRef.current = scrollables.map((el) => ({
          el,
          startScrollTop: el.scrollTop,
          startScrollBottom: scrollables[0].scrollHeight - (el.clientHeight + el.scrollTop),
        }))
      } catch (error) {
        console.error(error)
        scrollablesRef.current = []
      }
      setIsDragging(true)
      setStartY(Math.ceil(clientY))
      if (!noStart) {
        onDragStart?.(Math.ceil(clientY))
      }
    },
    [enabled, onDragStart, getScrollableAncestors]
  )

  const handleMove = useCallback(
    (clientY: number, event: TouchEvent | MouseEvent) => {
      if (!isDragging || !enabled) return

      let deltaY = Math.ceil(clientY) - startY
      const scrollables = scrollablesRef.current

      if (scrollables.length > 0) {
        if (
          scrollables.some(
            (item) => (item.startScrollTop !== 0 && deltaY > 0) || (item.startScrollBottom !== 0 && deltaY < 0)
          )
        ) {
          deltaY = 0
        }
      }

      const computeTranslate = () => {
        if (typeof minTranslateY === 'number') {
          return deltaY < minTranslateY ? minTranslateY : deltaY
        }
        return deltaY
      }
      const translatedY = computeTranslate()
      // console.log(deltaY, translatedY, 'last committed', previousCommitedTranslateYRef.current)
      setTranslateY(translatedY)
      onDragMove?.(clientY, translatedY)
    },
    [isDragging, enabled, startY, onDragMove, minTranslateY]
  )

  const handleEnd = useCallback(() => {
    if (!isDragging) return
    setIsDragging(false)
    const appliedDeltaY = translateY
    setTranslateY(0)
    onDragEnd?.(appliedDeltaY)
  }, [isDragging, translateY, onDragEnd])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleStart(e.touches[0].clientY, e.nativeEvent)
    },
    [handleStart]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleMove(e.touches[0].clientY, e.nativeEvent)
    },
    [handleMove]
  )

  const handleTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      handleStart(e.clientY, e.nativeEvent)
    },
    [handleStart]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      handleMove(e.clientY, e)
    },
    [handleMove]
  )

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
