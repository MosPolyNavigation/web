import { IconLink } from './IconLink.ts'
import { ComponentType, SVGProps } from 'react'

type SvgIconComponent = ComponentType<SVGProps<SVGSVGElement>>

const iconModules = import.meta.glob('../assets/icons/**/*.svg', {
  eager: true,
  query: '?react',
  import: 'default',
}) as Record<string, SvgIconComponent>

const iconComponents: Partial<Record<IconLink, SvgIconComponent>> = Object.values(IconLink).reduce(
  (acc, iconLink) => {
    const relativeIconPath = iconLink.replace('img/icons/', '')
    const modulePath = `../assets/icons/${relativeIconPath}`
    const iconComponent = iconModules[modulePath]

    if (iconComponent) {
      acc[iconLink] = iconComponent
    }

    return acc
  },
  {} as Partial<Record<IconLink, SvgIconComponent>>
)

export function getIconComponent(iconLink: IconLink): SvgIconComponent | null {
  return iconComponents[iconLink] ?? null
}
