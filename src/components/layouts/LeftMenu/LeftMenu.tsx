import classNames from 'classnames'
import { FC, useEffect, useMemo, useState } from 'react'
import { BtnName, Color, Layout, Size } from '../../../constants/enums.ts'
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
        <img src='img/logo.png' alt='' className={cl.topLogo} onClick={handleTechnicalClick} />
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
        <MenuItem text='Сообщить о проблеме' color={Color.BLUE} iconLink={IconLink.PROBLEM} to='/report' />
        {/*<MenuItem text='О сервисе' color={Color.BLUE} iconLink={IconLink.ABOUT} />*/}
        {/*<MenuItem*/}
        {/*  text='Тг-бот "ПОЛИНА"'*/}
        {/*  color={Color.BLUE}*/}
        {/*  iconLink={IconLink.TG_OUTLINED}*/}
        {/*  to='https://t.me/mospolyna_bot'*/}
        {/*  target='_blank'*/}
        {/*/>*/}
        <MenuItem
          text='Telegram-бот ПолиНа 🕊️'
          color={Color.BLUE}
          iconLink={IconLink.TG_OUTLINED}
          to='https://t.me/PoliNavigatorDOD_bot'
          target='_blank'
        />
        <MenuItem
          text='Регистрация на программы ДПО'
          color={Color.BLUE}
          iconLink={IconLink.LIST}
          to='https://anketolog.ru/service/survey/fill/alias/1013232/zDglLGRB'
          target='_blank'
          isLast
        />
      </div>
      <div className={cl.bottom}>
        <div className={cl.linksGroup}>
          <div>Соцсети Московского Политеха:</div>
          <div className={cl.bottom_links}>
            <IconButton iconLink={IconLink.VK} color={Color.BLUE} to='https://vk.ru/moscowpolytech' target='_blank' />
            <IconButton iconLink={IconLink.TG} color={Color.BLUE} to='https://t.me/mospolytech' target='_blank' />
            <IconButton
              iconLink={IconLink.MAX}
              color={Color.BLUE}
              to='https://max.ru/id7719455553_biz'
              target='_blank'
            />
          </div>
        </div>
        <div className={cl.linksGroup}>
          <div>Соцсети Центра карьеры:</div>
          <div className={cl.bottom_links}>
            <IconButton iconLink={IconLink.VK} color={Color.BLUE} to='https://vk.com/mospolywork' target='_blank' />
            <IconButton iconLink={IconLink.TG} color={Color.BLUE} to='https://t.me/mospolywork' target='_blank' />
            <IconButton
              iconLink={IconLink.MAX}
              color={Color.BLUE}
              to='https://max.ru/id7719455553_gos11'
              target='_blank'
            />
          </div>
        </div>
        <div className={cl.linksGroup}>
          <div>Наши соцсети:</div>
          <div className={cl.bottom_links}>
            <IconButton
              iconLink={IconLink.VK}
              color={Color.BLUE}
              size={Size.XL}
              to='https://vk.ru/mospolynavigation'
              target='_blank'
            />
            <IconButton
              iconLink={IconLink.TG}
              color={Color.BLUE}
              size={Size.XL}
              to='https://t.me/mospolynavigation'
              target='_blank'
            />
            <IconButton
              iconLink={IconLink.MAX}
              color={Color.BLUE}
              size={Size.XL}
              to='https://max.ru/join/t5AiBtccxnLSF6VM2ycT6CzR_XrJo7dt5LuyDrXtHMU'
              target='_blank'
            />
          </div>
        </div>
        <div className={cl.bottom_project}>
          <img src='img/logo.png' alt='' className={cl.bottomProjectLogo} />
          <div className={cl.bottom_projectText}>Сделано студентами проекта “Политех-Навигация (ПолиНа)”</div>
        </div>
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
