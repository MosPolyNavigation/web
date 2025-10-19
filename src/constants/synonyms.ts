/**
 * Система синонимов для поиска
 * Позволяет находить помещения по полным названиям локаций, которые в данных хранятся как сокращения
 */

export interface SynonymMapping {
  [key: string]: string[]
}

/**
 * Основные синонимы для локаций
 * Ключ - полное название, значение - массив возможных сокращений и вариантов
 */
export const LOCATION_SYNONYMS: SynonymMapping = {
  // Павел Корчагина
  'павла корчагина': ['пк', 'корчагина', 'павел корчагина', 'корчага'],
  'корчагина': ['пк', 'павла корчагина', 'павел корчагина', 'корчага'],
  'павел корчагина': ['пк', 'корчагина', 'павла корчагина', 'корчага'],
  'корчага': ['пк', 'корчагина', 'павла корчагина', 'павел корчагина'],
  'пк': ['пк', 'павла корчагина', 'павел корчагина', 'корчагина', 'корчага'],
  
  // Большая Семёновская
  'большая семёновская': ['бс', 'семёновская', 'большая семеновская', 'семеновка'],
  'семёновская': ['бс', 'большая семёновская', 'большая семеновская', 'семеновка'],
  'большая семеновская': ['бс', 'семёновская', 'большая семёновская', 'семеновка'],
  'семеновка': ['бс', 'семёновская', 'большая семёновская', 'большая семеновская'],
  'бс': ['бс', 'большая семёновская', 'семёновская', 'большая семеновская', 'семеновка'],
  
  // Автозаводская
  'автозаводская': ['ав', 'автозавод', 'автозаводка'],
  'автозавод': ['ав', 'автозаводская', 'автозаводка'],
  'автозаводка': ['ав', 'автозаводская', 'автозавод'],
  'автаз': ['ав', 'автозаводская', 'автозавод'],
  'ав': ['ав', 'автозаводская', 'автозавод', 'автозаводка', 'автаз'],
  
  // Прянишникова
  'прянишникова': ['пр', 'прянишников', 'пряники'],
  'прянишников': ['пр', 'прянишникова', 'пряники'],
  'пряники': ['пр', 'прянишникова', 'прянишников'],
  'пр': ['пр', 'прянишникова', 'прянишников', 'пряники'],
  
  // Михалковская
  'михалковская': ['м', 'михалков', 'михалковка', 'михалка'],
  'михалков': ['м', 'михалковская', 'михалковка', 'михалка'],
  'михалковка': ['м', 'михалковская', 'михалков', 'михалка'],
  'михалка': ['м', 'михалковская', 'михалков', 'михалковка'],
  'м': ['м', 'михалковская', 'михалков', 'михалковка', 'михалка'],
}

/**
 * Синонимы для типов помещений
 */
export const ROOM_TYPE_SYNONYMS: SynonymMapping = {
  // Туалеты
  'туалет': ['женский туалет', 'мужской туалет', 'общий туалет', 'wc', 'уборная', 'санузел'],
  'wc': ['туалет', 'женский туалет', 'мужской туалет', 'общий туалет', 'уборная', 'санузел'],
  'уборная': ['туалет', 'женский туалет', 'мужской туалет', 'общий туалет', 'wc', 'санузел'],
  'санузел': ['туалет', 'женский туалет', 'мужской туалет', 'общий туалет', 'wc', 'уборная'],
  
  // Аудитории
  'аудитория': ['учебная аудитория', 'лекторий', 'ауд', 'класс'],
  'ауд': ['аудитория', 'учебная аудитория', 'лекторий', 'класс'],
  'лекторий': ['аудитория', 'учебная аудитория', 'ауд', 'класс'],
  'класс': ['аудитория', 'учебная аудитория', 'лекторий', 'ауд'],
  
  // Лаборатории
  'лаборатория': ['лаб', 'лаба'],
  'лаб': ['лаборатория', 'лаба'],
  'лаба': ['лаборатория', 'лаб'],
  
  // Столовые
  'столовая': ['кафе', 'столовая / кафе', 'еда', 'питание', 'столовка'],
  'кафе': ['столовая', 'столовая / кафе', 'еда', 'питание', 'столовка'],
  'еда': ['столовая', 'кафе', 'столовая / кафе', 'питание', 'столовка'],
  'столовка': ['столовая', 'кафе', 'столовая / кафе', 'еда', 'питание'],
  
  // Библиотеки
  'библиотека': ['библиотека / читальный зал', 'читальный зал', 'читальный', 'библиотечка'],
  'читальный зал': ['библиотека', 'библиотека / читальный зал', 'читальный', 'библиотечка'],
  'читальный': ['библиотека', 'библиотека / читальный зал', 'читальный зал', 'библиотечка'],
  'библиотечка': ['библиотека', 'библиотека / читальный зал', 'читальный зал', 'читальный'],
  
  // Спорт
  'спорт': ['спортивный зал', 'спортзал'],
  'спортзал': ['спорт', 'спортивный зал'],
  'спортивный зал': ['спорт', 'спортзал'],
  
  // Администрация
  'администрация': ['админ', 'офис'],
  'админ': ['администрация', 'офис'],
  'офис': ['администрация', 'админ'],
  
  // Входы
  'вход': ['вход в здание', 'входы'],
  'входы': ['вход', 'вход в здание'],
  
  // Гардероб
  'гардероб': ['раздевалка', 'гардероб / раздевалка'],
  'раздевалка': ['гардероб', 'гардероб / раздевалка'],
}


export function expandQueryWithSynonyms(query: string): string[] {
  const normalizedQuery = query.toLowerCase().trim()
  const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 0)
  
  const expandedQueries = new Set<string>()
  expandedQueries.add(normalizedQuery)
  
  queryWords.forEach(word => {
    if (LOCATION_SYNONYMS[word]) {
      LOCATION_SYNONYMS[word].forEach(synonym => {
        const newWords = [...queryWords]
        const wordIndex = newWords.indexOf(word)
        if (wordIndex !== -1) {
          newWords[wordIndex] = synonym
          expandedQueries.add(newWords.join(' '))
        }
      })
    }
    
    if (ROOM_TYPE_SYNONYMS[word]) {
      ROOM_TYPE_SYNONYMS[word].forEach(synonym => {
        const newWords = [...queryWords]
        const wordIndex = newWords.indexOf(word)
        if (wordIndex !== -1) {
          newWords[wordIndex] = synonym
          expandedQueries.add(newWords.join(' '))
        }
      })
    }
  })
  
  // Также проверяем комбинации слов (например, "павла корчагина" как фраза)
  const fullPhrase = queryWords.join(' ')
  if (LOCATION_SYNONYMS[fullPhrase]) {
    LOCATION_SYNONYMS[fullPhrase].forEach(synonym => {
      expandedQueries.add(synonym)
    })
  }
  
  if (ROOM_TYPE_SYNONYMS[fullPhrase]) {
    ROOM_TYPE_SYNONYMS[fullPhrase].forEach(synonym => {
      expandedQueries.add(synonym)
    })
  }
  
  // Создаем варианты с частичными совпадениями для многословных запросов
  // Например, "туалет павла корчагина" -> "туалет пк"
  if (queryWords.length > 1) {
    queryWords.forEach((word, index) => {
      if (LOCATION_SYNONYMS[word]) {
        LOCATION_SYNONYMS[word].forEach(synonym => {
          const newWords = [...queryWords]
          newWords[index] = synonym
          expandedQueries.add(newWords.join(' '))
        })
      }
      
      if (ROOM_TYPE_SYNONYMS[word]) {
        ROOM_TYPE_SYNONYMS[word].forEach(synonym => {
          const newWords = [...queryWords]
          newWords[index] = synonym
          expandedQueries.add(newWords.join(' '))
        })
      }
    })
    
    // Также пробуем заменить несколько слов одновременно
    for (let i = 0; i < queryWords.length; i++) {
      for (let j = i + 1; j < queryWords.length; j++) {
        const word1 = queryWords[i]
        const word2 = queryWords[j]
        
        // Если оба слова имеют синонимы, пробуем их заменить
        if (LOCATION_SYNONYMS[word1] && LOCATION_SYNONYMS[word2]) {
          LOCATION_SYNONYMS[word1].forEach(synonym1 => {
            LOCATION_SYNONYMS[word2].forEach(synonym2 => {
              const newWords = [...queryWords]
              newWords[i] = synonym1
              newWords[j] = synonym2
              expandedQueries.add(newWords.join(' '))
            })
          })
        }
        
        if (ROOM_TYPE_SYNONYMS[word1] && ROOM_TYPE_SYNONYMS[word2]) {
          ROOM_TYPE_SYNONYMS[word1].forEach(synonym1 => {
            ROOM_TYPE_SYNONYMS[word2].forEach(synonym2 => {
              const newWords = [...queryWords]
              newWords[i] = synonym1
              newWords[j] = synonym2
              expandedQueries.add(newWords.join(' '))
            })
          })
        }
      }
    }
  }
  
  // Добавляем поддержку частичных совпадений (prefix matching)
  // Например, "пав" должно найти "павла корчагина"
  queryWords.forEach(word => {
    // Ищем все синонимы, которые начинаются с этого слова
    Object.keys(LOCATION_SYNONYMS).forEach(locationKey => {
      if (locationKey.startsWith(word) && word.length >= 2) { // Минимум 2 символа для частичного совпадения
        LOCATION_SYNONYMS[locationKey].forEach(synonym => {
          // Создаем варианты с заменой частичного слова на полный синоним
          const newWords = [...queryWords]
          const wordIndex = newWords.indexOf(word)
          if (wordIndex !== -1) {
            newWords[wordIndex] = synonym
            expandedQueries.add(newWords.join(' '))
          }
        })
      }
    })
    
    Object.keys(ROOM_TYPE_SYNONYMS).forEach(roomTypeKey => {
      if (roomTypeKey.startsWith(word) && word.length >= 2) {
        ROOM_TYPE_SYNONYMS[roomTypeKey].forEach(synonym => {
          const newWords = [...queryWords]
          const wordIndex = newWords.indexOf(word)
          if (wordIndex !== -1) {
            newWords[wordIndex] = synonym
            expandedQueries.add(newWords.join(' '))
          }
        })
      }
    })
  })
  
  return Array.from(expandedQueries)
}


export function getSynonyms(word: string): string[] {
  const normalizedWord = word.toLowerCase().trim()
  
  const synonyms = new Set<string>()
  
  if (LOCATION_SYNONYMS[normalizedWord]) {
    LOCATION_SYNONYMS[normalizedWord].forEach(synonym => synonyms.add(synonym))
  }
  
  if (ROOM_TYPE_SYNONYMS[normalizedWord]) {
    ROOM_TYPE_SYNONYMS[normalizedWord].forEach(synonym => synonyms.add(synonym))
  }
  
  return Array.from(synonyms)
}

export function getRoomTypeKeywords(): Record<string, string[]> {
  const keywords: Record<string, string[]> = {}
  
  const roomTypeGroups = {
    'столовая': ['столовая', 'кафе', 'еда', 'столовка'],
    'туалет': ['туалет', 'wc', 'санузел', 'уборная'],
    'аудитория': ['аудитория', 'лекторий', 'класс', 'ауд'],
    'библиотека': ['библиотека', 'читальный'],
    'коворкинг': ['коворкинг']
  }
  
  return roomTypeGroups
}


export function getLocationKeywords(): Record<string, string[]> {
  const keywords: Record<string, string[]> = {}
  
  const locationGroups = {
    'пр': ['пр', 'прянишникова', 'прянишников', 'пряники'],
    'бс': ['бс', 'большая семеновская', 'семеновская', 'семеновка'],
    'ав': ['ав', 'автозаводская', 'автозавод', 'автозаводка', 'автаз'],
    'м': ['м', 'михалковская', 'михалков', 'михалковка', 'михалка'],
    'пк': ['пк', 'павла корчагина', 'павел корчагина', 'корчагина', 'корчага']
  }
  
  return locationGroups
}
