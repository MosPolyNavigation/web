import classNames from 'classnames'
import { FC } from 'react'
import { Link } from 'react-router'
import { IconLink } from '../../../constants/IconLink.ts'
import { Color, Size } from '../../../constants/enums.ts'
import Icon from '../../common/Icon/Icon.tsx'
import cl from './MenuItem.module.scss'

interface MenuItemProps {
  isFirst?: boolean
  iconLink?: IconLink | null
  color?: Color
  text: string
  addText?: string
  size?: Size.S | Size.M
  onClick?: () => void
  to?: string
}

const MenuItem: FC<MenuItemProps> = (props: MenuItemProps) => {
  const content = (
    <>
      <div className={cl.content}>
        <div className={cl.basicText}>
          {props.iconLink && <Icon iconLink={props.iconLink} color={props.color} />}
          {props.text}
        </div>

        {props.addText && <div className={cl.addText}>{props.addText}</div>}
      </div>
      {!props.isFirst && <div className={cl.divider}></div>}
    </>
  )

  if (props.to) {
    return (
      <Link to={props.to} className={classNames(cl.menuItem, { [cl.sizeS]: props.size === Size.S })}>
        {content}
      </Link>
    )
  }

  return (
    <button className={classNames(cl.menuItem, { [cl.sizeS]: props.size === Size.S })} onClick={props.onClick}>
      {content}
    </button>
  )
}

export default MenuItem
