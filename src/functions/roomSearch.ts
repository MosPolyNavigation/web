import { RoomData, PlanData, RoomType } from '../constants/types'
import { expandQueryWithSynonyms, getRoomTypeKeywords, getLocationKeywords } from '../constants/synonyms'

const SCORE_CONSTANTS = {
  BASE_SCORE: 100,
  EXACT_MATCH: 80,
  TITLE_PREFIX_MATCH: 50,
  SUBTITLE_MATCH: 30,
  TYPE_MATCH: 25,
  SYNONYM_MATCH: 20,
  PREFIX_MATCH: 15,
  TYPE_AND_LOCATION_MATCH: 40,
  TYPE_SPECIFIC_MATCH: 500,
  TYPE_AND_LOCATION_INTENT_MATCH: 1200,
  LOCATION_INTENT_MATCH: 800,
  CURRENT_CAMPUS_TYPE_MATCH: 1000,
  CURRENT_CAMPUS_GENERAL: 200,
  CURRENT_CAMPUS_STANDARD: 1000,
  CURRENT_CAMPUS_PREFIX: 100,
  CURRENT_FLOOR: 15,
  EDUCATIONAL_ROOM: 25,
  SERVICE_ROOM_PENALTY: -10,
  MIN_PREFIX_LENGTH: 2,
  MAX_RESULTS: 20
} as const

export interface SearchContext {
  currentPlan?: PlanData | null
}

export interface SearchResult {
  room: RoomData
  score: number
}

interface CachedRoomData {
  roomText: string
  titleLower: string
  subTitleLower: string
  typeLower: string
}

interface CachedQueryData {
  originalQuery: string
  queryWords: string[]
  expandedQueries: string[]
  structuredQuery: {
    roomType?: string
    location?: string
    isTypeSpecific: boolean
  }
}

// Вспомогательные функции для оптимизации производительности

function normalizeRoomNumber(text: string): string {
  const cyrillicToLatin: Record<string, string> = {
    'а': 'a',
    'в': 'v',
    'м': 'm',
    'п': 'p',
    'к': 'k',
    'р': 'r',
    'б': 'b',
    'с': 's'
  }
  
  let normalized = text.toLowerCase()
  
  normalized = normalized.split('').map(char => cyrillicToLatin[char] || char).join('')
  
  return normalized.replace(/[\s-]/g, '')
}

function getCachedRoomData(room: RoomData): CachedRoomData {
  const titleLower = room.title.toLowerCase()
  const subTitleLower = room.subTitle.toLowerCase()
  const typeLower = (room.type || '').toLowerCase()
  
  return {
    roomText: `${titleLower} ${subTitleLower} ${typeLower}`,
    titleLower,
    subTitleLower,
    typeLower
  }
}

function getCachedQueryData(query: string): CachedQueryData {
  const originalQuery = query.toLowerCase()
  const queryWords = originalQuery.split(/\s+/).filter(word => word.length > 0)
  const expandedQueries = expandQueryWithSynonyms(query)
  
  return {
    originalQuery,
    queryWords,
    expandedQueries,
    structuredQuery: parseStructuredQuery(query)
  }
}

function hasLocationMatch(room: RoomData, location: string): boolean {
  const locationLower = location.toLowerCase()
  
  // Маппинг кириллических букв на латинские для соответствия с данными
  const cyrillicToLatin: Record<string, string> = {
    'м': 'm',
    'пк': 'pk', 
    'пр': 'pr',
    'бс': 'bs',
    'ав': 'av'
  }
  
  const mappedLocation = cyrillicToLatin[locationLower] || locationLower
  
  // Проверяем по ID локации
  if (room.plan?.corpus.location.id?.toLowerCase() === mappedLocation) {
    return true
  }
  
  // Проверяем по названию локации
  if (room.plan?.corpus.location.title?.toLowerCase().split(/\s+/).some(word => 
    word.startsWith(mappedLocation) || word === mappedLocation
  )) {
    return true
  }
  
  // Проверяем по subTitle комнаты (название корпуса)
  if (room.subTitle?.toLowerCase().split(/\s+/).some(word => 
    word.startsWith(mappedLocation) || word === mappedLocation
  )) {
    return true
  }
  
  return false
}

/**
 * Проверяет, соответствует ли комната критериям поиска (упрощенная логика)
 */
function matchesSearchCriteria(room: RoomData, cachedRoom: CachedRoomData, cachedQuery: CachedQueryData): boolean {
  const { roomText, titleLower, subTitleLower, typeLower } = cachedRoom
  const { originalQuery, queryWords, expandedQueries } = cachedQuery
  
  const normalizedQuery = normalizeRoomNumber(originalQuery)
  const normalizedTitle = normalizeRoomNumber(titleLower)
  if (normalizedQuery.length >= SCORE_CONSTANTS.MIN_PREFIX_LENGTH && normalizedTitle.includes(normalizedQuery)) {
    return true
  }
  
  // Проверяем все расширенные запросы
  const hasExpandedMatch = expandedQueries.some(expandedQuery => {
    const expandedWords = expandedQuery.toLowerCase().split(/\s+/).filter(word => word.length > 0)
    return expandedWords.some(word => roomText.includes(word))
  })
  
  // Проверяем префиксные совпадения
  const hasPrefixMatch = queryWords.some(word => {
    if (word.length < SCORE_CONSTANTS.MIN_PREFIX_LENGTH) return false
    const roomWords = roomText.split(/\s+/).filter(roomWord => roomWord.length > 0)
    return roomWords.some(roomWord => roomWord.startsWith(word))
  })
  
  if (hasExpandedMatch || hasPrefixMatch) {
    if (queryWords.length <= 1) return true
    
    const hasFullMatch = expandedQueries.some(expandedQuery => {
      const expandedWords = expandedQuery.toLowerCase().split(/\s+/).filter(word => word.length > 0)
      return expandedWords.every(word => roomText.includes(word))
    })
    
    if (hasFullMatch) return true
    
    const hasTypeAndLocationMatch = expandedQueries.some(expandedQuery => {
      const expandedWords = expandedQuery.toLowerCase().split(/\s+/).filter(word => word.length > 0)
      
      const hasTypeMatch = typeLower && expandedWords.some(word => typeLower.includes(word))
      const hasLocationMatch = expandedWords.some(word => subTitleLower.includes(word))
      
      return hasTypeMatch && hasLocationMatch
    })
    
    if (hasTypeAndLocationMatch) return true
    
    // Проверяем частичные совпадения для многословных запросов
    const hasPrefixTypeMatch = typeLower && queryWords.some(word => {
      if (word.length < SCORE_CONSTANTS.MIN_PREFIX_LENGTH) return false
      const typeWords = typeLower.split(/\s+/)
      return typeWords.some(typeWord => typeWord.startsWith(word))
    })
    
    const hasPrefixLocationMatch = queryWords.some(word => {
      if (word.length < SCORE_CONSTANTS.MIN_PREFIX_LENGTH) return false
      const locationWords = subTitleLower.split(/\s+/)
      return locationWords.some(locationWord => locationWord.startsWith(word))
    })
    
    return Boolean(hasPrefixTypeMatch && hasPrefixLocationMatch)
  }
  
  return false
}

/**

 * Фильтрация: текстовый поиск по title, subTitle, type + синонимы
 * 
 * Приоритеты скоринга:
 * 1. Соответствие структурированному запросу по типу помещения + корпусу (+1700 баллов)
 * 2. Соответствие структурированному запросу только по корпусу (+800 баллов)
 * 3. Комнаты из текущего кампуса (+1000 баллов для соответствующих типу, +200 для остальных)
 * 4. Соответствие типу помещения (+500 баллов)
 * 5. Точное совпадение с запросом (+80 баллов)
 * 6. Дополнительный буст для префикса в текущем кампусе (+100 баллов)
 * 7. Буст для текущего этажа (+15 баллов)
 * 8. Учебные аудитории выше служебных (+25/-10 баллов)
 */
export function searchRooms(
  rooms: RoomData[],
  query: string,
  context?: SearchContext
): RoomData[] {
  if (!query.trim()) {
    return []
  }

  const trimmedQuery = query.trim()
  const cachedQuery = getCachedQueryData(trimmedQuery)
  
  // Фильтруем комнаты с использованием кэшированных данных
  const filteredResults = rooms.filter(room => {
    const cachedRoom = getCachedRoomData(room)
    return matchesSearchCriteria(room, cachedRoom, cachedQuery)
  })
  
  // Применяем скоринг и ограничиваем результат
  const scoredResults: SearchResult[] = filteredResults.map(room => ({
    room,
    score: calculateCustomScore(room, getCachedRoomData(room), cachedQuery, context)
  }))

  // Сортируем по финальному скору и ограничиваем результат
  const finalResults = scoredResults
    .sort((a, b) => b.score - a.score)
    .slice(0, SCORE_CONSTANTS.MAX_RESULTS)
    .map(result => result.room)
  
  return finalResults
}

/**
 * Парсит структурированные запросы поиска комнат
 * Распознаёт паттерны типа "туалет ПК", "ПР-123", "столовая БС"
 */
function parseStructuredQuery(query: string): {
  roomType?: string
  location?: string
  isTypeSpecific: boolean
} {
  const queryLower = query.toLowerCase()
  
  const roomTypeKeywords = getRoomTypeKeywords()
  const locationKeywords = getLocationKeywords()
  
  let roomType: string | undefined
  let location: string | undefined
  
  const roomSearchPattern = /^(пр|бс|ав|м|пк|pr|bs|av|m|pk)\s*[-]?\s*\d+$/i
  const roomMatch = query.match(roomSearchPattern)
  
  if (roomMatch) {
    // Если запрос соответствует паттерну поиска комнаты (например, "ПР-123")
    location = roomMatch[1].toLowerCase()
    
    // Определяем тип комнаты через поиск по ключевым словам
    for (const [type, keywords] of Object.entries(roomTypeKeywords)) {
      if (keywords.some(keyword => queryLower.includes(keyword))) {
        roomType = type
        break
      }
    }
    
    return {
      roomType,
      location,
      isTypeSpecific: true
    }
  }
  
  for (const [type, keywords] of Object.entries(roomTypeKeywords)) {
    if (keywords.some(keyword => queryLower.includes(keyword))) {
      roomType = type
      break
    }
  }
  
  // Ищем локацию только если есть полные названия кампусов или явные указания
  for (const [loc, keywords] of Object.entries(locationKeywords)) {
    // Исключаем короткие сокращения (м, пк, пр, бс, ав) из поиска локации
    // если они могут конфликтовать с типами помещений
    const shortAbbreviations = ['м', 'пк', 'пр', 'бс', 'ав']
    
    if (keywords.some(keyword => {
      if (shortAbbreviations.includes(keyword)) {
        return false 
      }
      return queryLower.includes(keyword)
    })) {
      if (roomType) {
        location = loc.toLowerCase()
        break
      }
    }
  }
  
  return {
    roomType,
    location,
    isTypeSpecific: !!roomType
  }
}

/**
 * Вычисляет оптимизированный скор для ранжирования
 */
function calculateCustomScore(
  room: RoomData, 
  cachedRoom: CachedRoomData, 
  cachedQuery: CachedQueryData, 
  context?: SearchContext
): number {
  let score = SCORE_CONSTANTS.BASE_SCORE

  const { roomText, titleLower, subTitleLower, typeLower } = cachedRoom
  const { originalQuery, queryWords, expandedQueries, structuredQuery } = cachedQuery

  const normalizedQuery = normalizeRoomNumber(originalQuery)
  const normalizedTitle = normalizeRoomNumber(titleLower)
  if (normalizedQuery.length >= SCORE_CONSTANTS.MIN_PREFIX_LENGTH && normalizedTitle.includes(normalizedQuery)) {
    score += SCORE_CONSTANTS.EXACT_MATCH
    if (normalizedTitle === normalizedQuery) {
      score += SCORE_CONSTANTS.TITLE_PREFIX_MATCH
    }
  }

  // Буст за точное совпадение с оригинальным запросом
  if (roomText.includes(originalQuery)) {
    score += SCORE_CONSTANTS.EXACT_MATCH
  }

  // Буст за точное совпадение в title (префикс)
  if (titleLower.startsWith(originalQuery)) {
    score += SCORE_CONSTANTS.TITLE_PREFIX_MATCH
  }

  // Буст за точное совпадение в subTitle
  if (subTitleLower.includes(originalQuery)) {
    score += SCORE_CONSTANTS.SUBTITLE_MATCH
  }

  // Буст за совпадение по типу помещения
  if (typeLower && typeLower.includes(originalQuery)) {
    score += SCORE_CONSTANTS.TYPE_MATCH
  }

  // Бусты за совпадения с синонимами
  expandedQueries.forEach(expandedQuery => {
    if (expandedQuery === originalQuery) return
    
    const expandedQueryLower = expandedQuery.toLowerCase()
    if (roomText.includes(expandedQueryLower)) {
      score += SCORE_CONSTANTS.SYNONYM_MATCH
    }
  })

  // Буст за частичные совпадения (prefix matching)
  queryWords.forEach(word => {
    if (word.length >= SCORE_CONSTANTS.MIN_PREFIX_LENGTH) {
      const roomWords = roomText.split(/\s+/).filter(roomWord => roomWord.length > 0)
      const hasPrefixMatch = roomWords.some(roomWord => roomWord.startsWith(word))
      
      if (hasPrefixMatch) {
        score += SCORE_CONSTANTS.PREFIX_MATCH
      }
    }
  })

  // Специальный буст для многословных запросов типа "туалет ПК"
  if (queryWords.length > 1) {
    const hasTypeMatch = typeLower && queryWords.some(word => typeLower.includes(word))
    const hasCorpusMatch = queryWords.some(word => subTitleLower.includes(word))
    
    if (hasTypeMatch && hasCorpusMatch) {
      score += SCORE_CONSTANTS.TYPE_AND_LOCATION_MATCH
    }
  }

  // Специальный буст за соответствие структурированному запросу по типу помещения
  if (structuredQuery.isTypeSpecific && structuredQuery.roomType) {
    const roomTypeMatches = typeLower && typeLower.includes(structuredQuery.roomType)
    
    if (roomTypeMatches) {
      score += SCORE_CONSTANTS.TYPE_SPECIFIC_MATCH
      
      // Дополнительный буст если есть совпадение по корпусу
      if (structuredQuery.location) {
        const locationMatches = hasLocationMatch(room, structuredQuery.location)
        
        if (locationMatches) {
          score += SCORE_CONSTANTS.TYPE_AND_LOCATION_INTENT_MATCH
        }
      }
    }
  }
  
  // Специальный буст за соответствие структурированному запросу только по корпусу
  if (!structuredQuery.isTypeSpecific && structuredQuery.location) {
    const locationMatches = hasLocationMatch(room, structuredQuery.location)
    
    if (locationMatches) {
      score += SCORE_CONSTANTS.LOCATION_INTENT_MATCH
    }
  }

  // Контекстно-зависимый буст за текущий кампус
  if (context?.currentPlan && room.plan?.corpus.location.id === context.currentPlan.corpus.location.id) {
    if (structuredQuery.isTypeSpecific) {
      const roomTypeMatches = structuredQuery.roomType && typeLower && 
        typeLower.includes(structuredQuery.roomType)
      
      if (roomTypeMatches) {
        score += SCORE_CONSTANTS.CURRENT_CAMPUS_TYPE_MATCH
      } else {
        score += SCORE_CONSTANTS.CURRENT_CAMPUS_GENERAL
      }
    } else {
      score += SCORE_CONSTANTS.CURRENT_CAMPUS_STANDARD
    }
    
    // Дополнительный буст для поиска по префиксу в текущем корпусе
    if (titleLower.startsWith(originalQuery)) {
      score += SCORE_CONSTANTS.CURRENT_CAMPUS_PREFIX
    }
  }

  // Буст за текущий этаж
  if (context?.currentPlan && room.plan?.floor === context.currentPlan.floor) {
    score += SCORE_CONSTANTS.CURRENT_FLOOR
  }

  // Буст за учебные аудитории
  if (isEducationalRoom(room.type)) {
    score += SCORE_CONSTANTS.EDUCATIONAL_ROOM
  }

  // Штраф за служебные помещения
  if (isServiceRoom(room.type)) {
    score += SCORE_CONSTANTS.SERVICE_ROOM_PENALTY
  }

  return score
}

/**
 * Проверяет, является ли помещение учебным
 */
function isEducationalRoom(type: RoomType): boolean {
  const educationalTypes = [
    'Учебная аудитория',
    'Лекторий', 
    'Лаборатория',
    'Библиотека / читальный зал',
    'Коворкинг'
  ]
  return educationalTypes.includes(type as string)
}

/**
 * Проверяет, является ли помещение служебным
 */
function isServiceRoom(type: RoomType): boolean {
  const serviceTypes = [
    'Служебное помещение',
    'Не используется',
    'Гардероб / раздевалка'
  ]
  return serviceTypes.includes(type as string)
}
