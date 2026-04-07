import classNames from 'classnames'
import { CSSProperties, FC, HTMLAttributeAnchorTarget } from 'react'
import { Link } from 'react-router'
import { IconLink } from '../../../constants/IconLink.ts'
import { Color, Size } from '../../../constants/enums.ts'
import Icon from '../../common/Icon/Icon.tsx'
import cl from './MenuItem.module.scss'

interface MenuItemProps {
  className?: string
  accented?: boolean
  isFirst?: boolean
  isLast?: boolean
  iconLink?: IconLink | null
  color?: Color
  text: string
  addText?: string
  size?: Size.S | Size.M
  onClick?: () => void
  to?: string
  target?: HTMLAttributeAnchorTarget
  style?: CSSProperties
}

const MenuItem: FC<MenuItemProps> = (props: MenuItemProps) => {
  const content = (
    <>
      <div className={cl.content}>
        <div className={cl.basicText}>
          {props.iconLink && <Icon iconLink={props.iconLink} color={props.color ?? Color.BLUE} />}
          <span className={cl.text}>{props.text}</span>
        </div>

        {props.addText && <div className={cl.addText}>{props.addText}</div>}
      </div>
      {!props.isFirst && !props.isLast && <div className={cl.divider}></div>}
    </>
  )

  if (props.to) {
    return (
      <Link
        to={props.to}
        target={props.target}
        className={classNames(cl.menuItem, props.className, {
          [cl.sizeS]: props.size === Size.S,
          [cl.accented]: props.accented,
        })}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      className={classNames(cl.menuItem, props.className, {
        [cl.sizeS]: props.size === Size.S,
        [cl.accented]: props.accented,
      })}
      style={props.style}
      onClick={props.onClick}
    >
      {content}
    </button>
  )
}

export default MenuItem
