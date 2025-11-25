import classNames from 'classnames'
import { FC, useEffect, useMemo, useState } from 'react'
import { BtnName, Color, Layout } from '../../../constants/enums.ts'
import { IconLink } from '../../../constants/IconLink.ts'
import useOnHideRemover from '../../../hooks/useOnHideRemover.ts'
import { useAppStore } from '../../../store/useAppStore.ts'
import { userStore, useUserStore } from '../../../store/useUserStore.ts'
import IconButton from '../../buttons/IconButton/IconButton.tsx'
import MenuItem from '../../menuopmponents/MenuItem/MenuItem.tsx'
import cl from './LeftMenu.module.scss'

const LeftMenu: FC = () => {
  const [activeLayout, controlBtnClickHandler] = [
    useAppStore((state) => state.activeLayout),
    useAppStore((state) => state.controlBtnClickHandler),
  ]
  // Тапы для выключения/включения статистики
  const [taps, setTaps] = useState(0)
  const isDevelopMode = useUserStore((state) => state.isDevelopMode)

  const isVisible = useMemo(() => activeLayout === Layout.MENU, [activeLayout])
  const [isRemoved, removerAnimationEndHandler] = useOnHideRemover(isVisible)

  useEffect(() => {
    if (!isVisible) {
      setTaps(0)
    }
  }, [isVisible])

  const leftMenuClasses = classNames({
    [cl.leftMenu]: true,
    [cl.hidden]: !isVisible,
  })

  function handleTechnicalClick() {
    setTaps((prev) => prev + 1)
    if (taps >= 4) {
      userStore().toggleDevelopMode()
      setTaps(0)
    }
  }

  if (isRemoved) {
    return null
  }

  return (
    <div className={leftMenuClasses} onAnimationEnd={removerAnimationEndHandler}>
      <div className={cl.top}>
        <img src="img/logo.png" alt="" className={cl.topLogo} onClick={handleTechnicalClick} />
        <div className={cl.title}>
          Политех <br /> Навигация
        </div>
        <IconButton
          // onClick={() => toggleMenu(ActionName.HIDE)}
          onClick={() => controlBtnClickHandler(BtnName.MENU_CLOSE)}
          iconLink={IconLink.CROSS}
          color={Color.C5}
        />
      </div>
      <div className={cl.items}>
        <MenuItem text="О сервисе" color={Color.BLUE} iconLink={IconLink.ABOUT} />
        <MenuItem text="Сообщить о проблеме" color={Color.BLUE} iconLink={IconLink.PROBLEM} to="/report" />
        <MenuItem text="Настройки" color={Color.BLUE} iconLink={IconLink.SETTINGS} />
      </div>
      <div className={cl.bottom}>
        Сделано студентами проекта
        <br />
        “Политех-Навигация (ПолиНа)”
      </div>
      {isDevelopMode && (
        <div>
          <b>Режим разработчика</b>
        </div>
      )}
    </div>
  )
}

export default LeftMenu
