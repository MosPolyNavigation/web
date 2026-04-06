import { FC } from 'react'
import cl from './Icon.module.scss'
import { IconLink } from '../../../constants/IconLink.ts'
import { Color, Size } from '../../../constants/enums.ts'
import classNames from 'classnames'
import { getIconComponent } from '../../../constants/iconComponents.ts'

interface IconProps {
  iconLink: IconLink
  color: Color
  classNameExt?: string
  size?: Size.M | Size.S | Size.L
}

const Icon: FC<IconProps> = ({ iconLink, color, classNameExt = '', size = Size.M }) => {
  const IconComponent = getIconComponent(iconLink)

  if (!IconComponent) return null

  return (
    <div
      className={classNames(cl.icon, classNameExt, {
        [cl.sizeM]: size === Size.M,
        [cl.sizeS]: size === Size.S,
        [cl.sizeL]: size === Size.L,
        [cl.initialColor]: color === Color.INITIAL,
      })}
      style={color === Color.INITIAL ? undefined : { color }}
    >
      <IconComponent />
    </div>
  )
}

export default Icon
