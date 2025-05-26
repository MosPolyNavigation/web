import React, { FC } from 'react'
import cl from './MenuItem.module.scss'
import { IconLink } from '../../../constants/IconLink.ts'
import { Color, Size } from '../../../constants/enums.ts'
import Icon from '../../common/Icon/Icon.tsx'
import classNames from 'classnames'

interface MenuItemProps {
  isFirst?: boolean
  iconLink?: IconLink | null
  color?: Color
  text: string
  addText?: string
  size?: Size.S | Size.M
  onClick?: () => void
}

const MenuItem: FC<MenuItemProps> = (props: MenuItemProps) => {
  return (
    <button className={classNames(cl.menuItem, { [cl.sizeS]: props.size === Size.S })} onClick={props.onClick}>
      <div className={cl.content}>
        <div className={cl.basicText}>
          {props.iconLink && <Icon iconLink={props.iconLink} color={props.color} />}
          {props.text}
        </div>

        {props.addText && <div className={cl.addText}>{props.addText}</div>}
      </div>
      {!props.isFirst && <div className={cl.divider}></div>}
    </button>
  )
}

export default MenuItem
