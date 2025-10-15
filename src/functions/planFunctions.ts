import { PlanData } from '../constants/types.ts'
import { appConfig } from '../appConfig.ts'

/**
 * Проверяет SVG на наличие потенциально опасных элементов (скрипты, события и т.д.)
 * @param svgContent Содержимое SVG файла
 * @returns true если SVG безопасен, false если содержит потенциально опасный контент
 */
export function isSvgSafe(svgContent: string): boolean {
  // Проверяем на наличие скриптов
  const scriptPattern = /<script[\s\S]*?<\/script>/gi
  if (scriptPattern.test(svgContent)) {
    console.warn('SVG содержит скрипты - потенциальная угроза безопасности')
    return false
  }

  // Проверяем на наличие JavaScript в обработчиках событий
  const eventHandlerPattern = /on\w+\s*=\s*["'][^"']*["']/gi
  if (eventHandlerPattern.test(svgContent)) {
    console.warn('SVG содержит обработчики событий - потенциальная угроза безопасности')
    return false
  }

  // Проверяем на наличие javascript: в ссылках
  const javascriptUrlPattern = /javascript\s*:/gi
  if (javascriptUrlPattern.test(svgContent)) {
    console.warn('SVG содержит javascript: URL - потенциальная угроза безопасности')
    return false
  }

  // Проверяем на наличие data: URL с javascript
  const dataUrlPattern = /data\s*:\s*text\/javascript/gi
  if (dataUrlPattern.test(svgContent)) {
    console.warn('SVG содержит data: URL с javascript - потенциальная угроза безопасности')
    return false
  }

  return true
}

export function copyAttribute(
  target: SVGSVGElement | HTMLElement | null,
  source: SVGSVGElement | HTMLElement | null,
  qualifiedName: string | null
) {
  if (target && source && qualifiedName) {
    target.setAttribute(qualifiedName, <string>source.getAttribute(qualifiedName))
  }
}

export function getSvgLink(plan: PlanData): string {
  if (plan) {
    return appConfig.svgSource + plan?.wayToSvg
  }
  return ''
}

export function virtualCircleSVGEl() {
  return document.createElementNS('http://www.w3.org/2000/svg', 'circle')
}
