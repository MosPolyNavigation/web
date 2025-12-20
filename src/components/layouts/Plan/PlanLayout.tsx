import { FC, useEffect, useMemo, useRef, useState } from 'react'
import cl from './PlanLayout.module.scss'
import { appStore, useAppStore } from '../../../store/useAppStore.ts'
import { appConfig } from '../../../appConfig.ts'
import axios from 'axios'
import classNames from 'classnames'
import { getSvgLink, isSvgSafe } from '../../../functions/planFunctions.ts'
import { ReactZoomPanPinchContentRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { PlanModel } from '../../../models/Plan/PlanModel.ts'
import { IconLink } from '../../../constants/IconLink.ts'

const PlanLayout: FC = () => {
  const planSvgRef = useRef<null | SVGSVGElement>(null)
  const planWrapperInnerRef = useRef<HTMLDivElement>(null)
  const currentPlan = useAppStore((state) => state.currentPlan)
  const planModel = useAppStore((state) => state.planModel)
  const query = useAppStore((state) => state.queryService)
  const rotationAngle = useAppStore((state) => state.rotationAngle)
  const transformWrapperRef = useRef<ReactZoomPanPinchContentRef>(null)

  const svgLink = useMemo<string | null>(() => {
    if (currentPlan) return appConfig.svgSource + currentPlan?.wayToSvg
    return null
  }, [currentPlan])

  useEffect(() => {
    if (currentPlan) {
      axios
        .get(getSvgLink(currentPlan))
        .then((response) => {
          if (!planSvgRef.current) return //Если вдруг нет свгшки на странице, пропустить

          // Проверка безопасности SVG
          if (!isSvgSafe(response.data)) {
            console.error('SVG содержит потенциально опасный контент и не будет загружен')
            appStore().toast.showForTime('Ошибка загрузки плана: небезопасный контент', IconLink.SMILE_SAD)
            return
          }

          // Парсинг полученного текста свг=изображения в виртуальный ДОМ-элемент
          const parsedSvgDomEl = new DOMParser().parseFromString(response.data, 'image/svg+xml').documentElement as
            | SVGSVGElement
            | HTMLElement
          appStore().changePlanModel(currentPlan, planSvgRef.current, parsedSvgDomEl) //Установка новой модели-плана в стор приложения
          //Сохранение текущего плана в LocalStorage
          localStorage.setItem('last-plan', currentPlan.id)
          localStorage.setItem('last-plan-setting-date', String(Date.now()))
          if (transformWrapperRef.current) transformWrapperRef.current.resetTransform(1)
          // setTimeout(() => {
          // }, 1000)
        })
        .catch((error) => {
          console.error('Ошибка загрузки SVG:', error)
          appStore().toast.showForTime('Ошибка загрузки плана', IconLink.SMILE_SAD)
        })
    }
  }, [currentPlan])

  const viewBox = useMemo(() => {
    if (planModel) {
      return planModel.planSvgEl.getAttribute('viewBox') ?? '0 0 0 0'
    } else {
      return '0 0 0 0'
    }
  }, [planModel])

  const endArrowAnimationEl = useRef<null | SVGAnimateElement>(null)

  const [wayAnimationClass, setWayAnimationClass] = useState(cl.wayAnimation)
  const { primaryWayPathD, primaryWayLength } = useMemo(() => {
    if (!query.steps || !(typeof query.currentStepIndex === 'number') || !planModel) {
      return { primaryWayPathD: '', primaryWayLength: 0 }
    }
    const steps = query.steps
    const currentStepIndex = query.currentStepIndex
    if (steps && steps[currentStepIndex].plan === planModel.plan) {
      const currentStep = steps[currentStepIndex]
      if (currentStep.plan === currentPlan) {
        planModel.highlightRoomForNextStep(
          planModel.rooms.get(currentStep.way.at(-1)?.id ?? ''),
          !(query.steps.length > currentStepIndex + 1)
        ) //Добавление новых хайлайтов на конечное на текущем плане помещение и слушателей кликап на смену плана на следующий в маршруте

        const vertexesOfWay = currentStep.way
        setWayAnimationClass('')
        setTimeout(() => {
          if (endArrowAnimationEl.current) endArrowAnimationEl.current.beginElement()
        }, 850)
        return {
          primaryWayPathD: generatePathD(vertexesOfWay),
          primaryWayLength: currentStep.distance,
        }
      }
    }
    return {
      primaryWayPathD: '',
      primaryWayLength: 0,
    }
  }, [planModel, query])

  useEffect(() => {
    if (wayAnimationClass === '') {
      setWayAnimationClass(cl.wayAnimation)
    }
  }, [wayAnimationClass])

  useEffect(() => {
    if (transformWrapperRef.current) {
      appStore().setControlsFunctions({
        zoomIn: transformWrapperRef.current.zoomIn,
        zoomOut: transformWrapperRef.current.zoomOut,
      })
    }
  }, [transformWrapperRef])

  // Применение поворота к planWrapperInner и элементам карты
  useEffect(() => {
    if (!planWrapperInnerRef.current || !planSvgRef.current || !planModel) return

    const wrapper = planWrapperInnerRef.current
    const svg = planSvgRef.current

    // Применяем поворот к обертке относительно центра (используем проценты)
    wrapper.style.transformOrigin = '50% 50%'
    wrapper.style.transform = `rotate(${rotationAngle}deg)`

    // Находим и поворачиваем совмещенные элементы (текст + SVG)
    const findAndRotateCombinedElements = () => {
      const processedTexts = new Set<SVGTextElement>()
      // Используем радиусы в координатах SVG (независимо от масштаба)
      const searchRadius = 100 // Радиус поиска в координатах SVG
      const iconPartRadius = 50 // Радиус для поиска частей одной иконки (увеличен для длинных иконок типа штанги)

      // Ищем все элементы иконок, исключая crossing
      const iconElements: SVGElement[] = []
      const allElements = svg.querySelectorAll('*')
      
      allElements.forEach((el) => {
        // Пропускаем элементы crossing
        const elId = el.id || ''
        if (elId.includes('crossing') || elId.includes('Crossing')) {
          return
        }
        
        const opacity = el.getAttribute('opacity') || (el as HTMLElement).style.opacity
        if (opacity === '0.5' || parseFloat(opacity) === 0.5) {
          iconElements.push(el as SVGElement)
        }
      })

      // Ищем все элементы в группе Icons (туалеты и т.д.), исключая crossing
      const iconsGroup = svg.querySelector('g#Icons')
      if (iconsGroup) {
        iconsGroup.querySelectorAll('path, circle, rect, ellipse, polygon, polyline, use, image').forEach((el) => {
          const elId = el.id || ''
          if (elId.includes('crossing') || elId.includes('Crossing')) {
            return
          }
          if (el instanceof SVGElement && !iconElements.includes(el)) {
            iconElements.push(el)
          }
        })
      }

      // Группируем элементы, которые составляют одну иконку (находятся рядом друг с другом)
      // Используем итеративный алгоритм для нахождения всех связанных частей
      const iconGroups: Array<{ elements: SVGElement[]; centerX: number; centerY: number }> = []
      const processedIconElements = new Set<SVGElement>()

      iconElements.forEach((iconElement) => {
        if (processedIconElements.has(iconElement)) return

        try {
          const iconBBox = (iconElement as SVGGraphicsElement).getBBox()

          // Ищем все элементы рядом, которые могут быть частями этой иконки
          const iconParts: SVGElement[] = [iconElement]
          processedIconElements.add(iconElement)
          let minX = iconBBox.x
          let minY = iconBBox.y
          let maxX = iconBBox.x + iconBBox.width
          let maxY = iconBBox.y + iconBBox.height

          // Итеративно ищем все связанные части иконки
          let foundNewParts = true
          let iterations = 0
          const maxIterations = 10 // Защита от бесконечного цикла
          
          while (foundNewParts && iterations < maxIterations) {
            iterations++
            foundNewParts = false
            
            iconElements.forEach((otherElement) => {
              if (processedIconElements.has(otherElement) || iconParts.includes(otherElement)) return

              try {
                const otherBBox = (otherElement as SVGGraphicsElement).getBBox()
                const otherCenterX = otherBBox.x + otherBBox.width / 2
                const otherCenterY = otherBBox.y + otherBBox.height / 2

                // Проверяем расстояние от любого элемента в текущей группе
                let isNearAnyPart = false
                for (const part of iconParts) {
                  try {
                    const partBBox = (part as SVGGraphicsElement).getBBox()
                    const partCenterX = partBBox.x + partBBox.width / 2
                    const partCenterY = partBBox.y + partBBox.height / 2
                    
                    const deltaX = Math.abs(otherCenterX - partCenterX)
                    const deltaY = Math.abs(otherCenterY - partCenterY)
                    
                    // Проверяем расстояние в координатах SVG (независимо от масштаба)
                    if (deltaX < iconPartRadius && deltaY < iconPartRadius) {
                      isNearAnyPart = true
                      break
                    }
                  } catch {
                    // Игнорируем ошибки
                  }
                }
                
                if (isNearAnyPart) {
                  // Нашли часть иконки
                  iconParts.push(otherElement)
                  processedIconElements.add(otherElement)
                  foundNewParts = true
                  
                  // Расширяем bounding box группы
                  minX = Math.min(minX, otherBBox.x)
                  minY = Math.min(minY, otherBBox.y)
                  maxX = Math.max(maxX, otherBBox.x + otherBBox.width)
                  maxY = Math.max(maxY, otherBBox.y + otherBBox.height)
                }
              } catch {
                // Игнорируем ошибки getBBox
              }
            })
          }

          // Вычисляем центр группы элементов иконки
          const groupCenterX = (minX + maxX) / 2
          const groupCenterY = (minY + maxY) / 2

          iconGroups.push({
            elements: iconParts,
            centerX: groupCenterX,
            centerY: groupCenterY,
          })
        } catch {
          // Игнорируем ошибки getBBox
        }
      })

      // Теперь ищем тексты, связанные с группами иконок
      const combinedGroups: Array<{ elements: SVGElement[]; centerX: number; centerY: number }> = []
      const processedIconGroups = new Set<number>()

      iconGroups.forEach((iconGroup, iconGroupIndex) => {
        if (processedIconGroups.has(iconGroupIndex)) return

        // Ищем тексты рядом с центром группы иконки
        const allTexts = svg.querySelectorAll('text') as NodeListOf<SVGTextElement>
        const relatedTexts: SVGElement[] = []
        let minX = iconGroup.centerX
        let minY = iconGroup.centerY
        let maxX = iconGroup.centerX
        let maxY = iconGroup.centerY

        // Вычисляем bounding box группы иконки
        iconGroup.elements.forEach((el) => {
          try {
            const bbox = (el as SVGGraphicsElement).getBBox()
            minX = Math.min(minX, bbox.x)
            minY = Math.min(minY, bbox.y)
            maxX = Math.max(maxX, bbox.x + bbox.width)
            maxY = Math.max(maxY, bbox.y + bbox.height)
          } catch {
            // Игнорируем ошибки
          }
        })

        allTexts.forEach((text) => {
          if (processedTexts.has(text)) return

          try {
            const textBBox = text.getBBox()
            const textCenterX = textBBox.x + textBBox.width / 2
            const textCenterY = textBBox.y + textBBox.height / 2

            // Проверяем расстояние от центра группы иконки в координатах SVG
            const deltaX = Math.abs(textCenterX - iconGroup.centerX)
            const deltaY = Math.abs(textCenterY - iconGroup.centerY)
            
            // Текст должен быть рядом с группой иконки (в координатах SVG, независимо от масштаба)
            if (deltaX < searchRadius && deltaY < searchRadius && deltaY > 5) {
              processedTexts.add(text)
              relatedTexts.push(text as SVGElement)
              
              // Расширяем bounding box
              minX = Math.min(minX, textBBox.x)
              minY = Math.min(minY, textBBox.y)
              maxX = Math.max(maxX, textBBox.x + textBBox.width)
              maxY = Math.max(maxY, textBBox.y + textBBox.height)
            }
          } catch {
            // Игнорируем ошибки getBBox
          }
        })

        // Вычисляем общий центр для группы иконки + текстов
        const combinedCenterX = (minX + maxX) / 2
        const combinedCenterY = (minY + maxY) / 2

        if (relatedTexts.length > 0) {
          // Группа иконки + тексты
          processedIconGroups.add(iconGroupIndex)
          combinedGroups.push({
            elements: [...iconGroup.elements, ...relatedTexts],
            centerX: combinedCenterX,
            centerY: combinedCenterY,
          })
        } else {
          // Только группа иконки (без текстов)
          processedIconGroups.add(iconGroupIndex)
          combinedGroups.push({
            elements: iconGroup.elements,
            centerX: iconGroup.centerX,
            centerY: iconGroup.centerY,
          })
        }
      })

      // Применяем поворот ко всем группам
      // Сначала сбрасываем все трансформации, чтобы избежать конфликтов
      const allProcessedElements = new Set<SVGElement>()
      combinedGroups.forEach((group) => {
        group.elements.forEach((element) => {
          if (allProcessedElements.has(element)) {
            // Элемент уже обработан - пропускаем, чтобы избежать двойной обработки
            return
          }
          allProcessedElements.add(element)
          element.style.transformOrigin = `${group.centerX}px ${group.centerY}px`
          element.style.transform = `rotate(${-rotationAngle}deg)`
        })
      })

      // Поворачиваем оставшиеся текстовые элементы по их центру
      const allTexts = svg.querySelectorAll('text') as NodeListOf<SVGTextElement>
      allTexts.forEach((text) => {
        if (processedTexts.has(text)) return

        try {
          const textBBox = text.getBBox()
          const textCenterX = textBBox.x + textBBox.width / 2
          const textCenterY = textBBox.y + textBBox.height / 2

          const textElement = text as SVGElement
          textElement.style.transformOrigin = `${textCenterX}px ${textCenterY}px`
          textElement.style.transform = `rotate(${-rotationAngle}deg)`
        } catch {
          // Игнорируем ошибки getBBox
        }
      })
    }

    // Небольшая задержка для того, чтобы SVG успел отрендериться
    const timeoutId = setTimeout(() => {
      findAndRotateCombinedElements()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [rotationAngle, planModel, currentPlan])

  return (
    <div className={cl.planWrapper}>
      <TransformWrapper ref={transformWrapperRef} maxScale={5} disablePadding={true}>
        <TransformComponent wrapperClass={cl.transformWrapper}>
          {svgLink && (
            <div className={cl.planWrapperInner} ref={planWrapperInnerRef}>
              <svg className={cl.planSvg} ref={planSvgRef}></svg>
              <svg className={cl.planAddingObjects} viewBox={viewBox}>
                {primaryWayPathD && (
                  <path
                    d={primaryWayPathD}
                    className={classNames(cl.way, wayAnimationClass)}
                    style={{ strokeDasharray: primaryWayLength, strokeDashoffset: primaryWayLength }}
                    markerStart="url(#way-start-circle)"
                    markerEnd="url(#way-end-arrow)"
                  />
                )}
                <defs>
                  <marker
                    id="way-end-arrow"
                    markerUnits="userSpaceOnUse"
                    markerWidth="20"
                    markerHeight="22"
                    refX="15"
                    refY="11"
                    viewBox="0 0 20 22"
                    fill="none"
                    orient="auto-start-reverse"
                  >
                    <path key={primaryWayPathD} className={classNames(cl.endArrow, wayAnimationClass)}></path>
                  </marker>
                  <marker
                    id="way-start-circle"
                    markerUnits="userSpaceOnUse"
                    markerWidth="20"
                    markerHeight="20"
                    refX="10"
                    refY="10"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <circle fill="white" cx="10" cy="10" className={classNames(cl.startCircle, wayAnimationClass)} />
                  </marker>
                </defs>
              </svg>
            </div>
          )}
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default PlanLayout

function generatePathD(points: Point[]) {
  if (!points || points.length === 0) {
    return ''
  }

  let d = `M ${points[0].x} ${points[0].y}`

  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i].x} ${points[i].y}`
  }

  return d
}

type Point = {
  x: number
  y: number
}
