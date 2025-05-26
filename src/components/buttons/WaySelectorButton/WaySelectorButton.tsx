import React from 'react'
import { IconLink } from '../../../constants/IconLink.ts'
import Icon from '../../common/Icon/Icon.tsx'
import { Color, Size } from '../../../constants/enums.ts'
import cl from './WaySelectorButton.module.scss'

type Props = {
  text: string | null | undefined
  baseText: string
  baseIcon: IconLink
  icon: IconLink | null | undefined
  onClick?: () => void
  onCrossClick?: () => void
}

function WaySelectorButton(props: Props) {
  function onCrossBtnClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation()
    props.onCrossClick()
  }

  return (
    <div className={cl.waySelectorButtonWrapper}>
      {props.text ? (
        <button className={cl.waySelectorButton} onClick={props.onClick}>
          <div className={cl.waySelectorContent}>
            <Icon classNameExt={cl.waySelectorIcon} iconLink={props.icon} color={Color.INITIAL} />
            <div className={cl.buttonText}>{props.text}</div>
          </div>
          <div className={cl.clearButton} onClick={(e) => onCrossBtnClick(e)}>
            <Icon classNameExt={cl.waySelectorIcon} iconLink={IconLink.CROSS} color={Color.C3} size={Size.S} />
          </div>
        </button>
      ) : (
        <button className={cl.waySelectorButton} onClick={props.onClick}>
          <div className={cl.waySelectorContent}>
            <Icon classNameExt={cl.waySelectorIcon} iconLink={props.baseIcon} color={Color.INITIAL} />
            <div className={cl.buttonText}>{props.baseText}</div>
          </div>
        </button>
      )}
    </div>
  )
}

export default WaySelectorButton
