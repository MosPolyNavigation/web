import React, { FC, HTMLAttributeAnchorTarget } from 'react'
import cl from './IconButton.module.scss'
import { IconLink } from '../../../constants/IconLink.ts'
import Icon from '../../common/Icon/Icon.tsx'
import classNames from 'classnames'
import { Color } from '../../../constants/enums.ts'
import { Link } from 'react-router'

interface IconButtonProps {
  iconLink: IconLink
  color?: Color
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  to?: string
  target?: HTMLAttributeAnchorTarget
}

// Можно добавить размеры
const IconButton: FC<IconButtonProps> = ({ iconLink, color, onClick, className = '', to, target }) => {
  if (to) {
    return (
      <Link to={to} target={target} className={classNames(classNames(cl.iconButton, className))}>
        <Icon iconLink={iconLink} color={color ? color : Color.C4} />
      </Link>
    )
  }
  return (
    <button onClick={onClick} className={classNames(cl.iconButton, className)}>
      <Icon iconLink={iconLink} color={color ? color : Color.C4} />
    </button>
  )
}

export default IconButton
