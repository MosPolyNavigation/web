import axios from 'axios'
import { userStore } from '../store/useUserStore.ts'

export const statisticApi = {
  sendChangePlan: async (planId: string, first: boolean | undefined) => {
    if (userStore().isDevelopMode) return
    if (first) {
      const navigationEntries = performance.getEntriesByType('navigation')
      const isReload =
        navigationEntries.length > 0 && (navigationEntries[0] as PerformanceNavigationTiming).type === 'reload'
      if (isReload) {
        return
      }
    }

    const userId = userStore().userId
    if (!userId) return
    void axios.put('https://mpunav.ru/api/stat/change-plan', {
      user_id: userId,
      plan_id: planId,
    })
  },

  sendSelectRoom: async (roomId: string, success: boolean) => {
    if (userStore().isDevelopMode) return
    void axios.put('https://mpunav.ru/api/stat/select-aud', {
      auditory_id: roomId,
      user_id: userStore().userId,
      success: success,
    })
  },

  getUserToken: async () => {
    const userIdResponse = await axios.get<{ user_id: string }>('https://mpunav.ru/api/get/user-id')
    return userIdResponse.data.user_id
  },

  sendSiteVisit: async () => {
    if (userStore().isDevelopMode) return
    const navigationEntries = performance.getEntriesByType('navigation')
    const isReload =
      navigationEntries.length > 0 && (navigationEntries[0] as PerformanceNavigationTiming).type === 'reload'
    if (isReload) {
      return
    }
    await axios.put('https://mpunav.ru/api/stat/site', {
      user_id: userStore().userId || null,
    })
  },

  sendStartWay: (from: string, to: string, success: boolean) => {
    if (userStore().isDevelopMode) return
    void axios.put('https://mpunav.ru/api/stat/start-way', {
      user_id: userStore().userId,
      start_id: from,
      end_id: to,
      success: success,
    })
  },
}
