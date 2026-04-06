import { useSyncExternalStore } from 'react'

export const useMediaQuery = (query: string) => {
  return useSyncExternalStore(
    // Функция подписки: React вызовет её, чтобы следить за изменениями
    (callback) => {
      const matchMedia = window.matchMedia(query)
      matchMedia.addEventListener('change', callback)

      // Функция очистки
      return () => matchMedia.removeEventListener('change', callback)
    },
    // Функция получения текущего значения (на клиенте)
    () => window.matchMedia(query).matches,
    // Функция для серверного рендеринга (SSR)
    () => false // По умолчанию false, так как на сервере нет окна
  )
}

export const useShowDodLayout = () => {
  const showDodLayout = useMediaQuery('(min-width: 550px)')
  // const showDodLayout = false

  return { showDodLayout }
}

export const useIsDesktop = () => {
  return useMediaQuery('(min-width: 1040px)')
}