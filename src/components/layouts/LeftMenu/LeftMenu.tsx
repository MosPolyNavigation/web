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
        <MenuItem text="Сообщить о проблеме" color={Color.BLUE} iconLink={IconLink.PROBLEM} to="/report" />
        <MenuItem text="О сервисе" color={Color.BLUE} iconLink={IconLink.ABOUT} />
        <MenuItem
          text='Тг-бот "ПОЛИНА"'
          color={Color.BLUE}
          iconLink={IconLink.TG_OUTLINED}
          to="https://t.me/mospolyna_bot"
          target="_blank"
        />
        <MenuItem
          text='Тг-бот "ПОЛИНА для абитуриентов"'
          color={Color.BLUE}
          iconLink={IconLink.TG_OUTLINED}
          to="https://t.me/PoliNavigatorDOD_bot"
          target="_blank"
          isLast
        />
      </div>
      <div className={cl.bottom}>
        <div className={cl.bottom_links}>
          <div>Наши соцсети:</div>
          <IconButton iconLink={IconLink.VK} to="https://t.me/mospolynavigation" target="_blank" />
          <IconButton iconLink={IconLink.TG} to="https://vk.com/mospolynavigation" target="_blank" />
        </div>
        <div className={cl.bottom_project}>Сделано студентами проекта “Политех-Навигация (ПолиНа)”</div>
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
