import { Outlet } from 'react-router'
import cl from './DodLayout.module.scss'
import { appConfig } from '../../appConfig.ts'
import { useShowDodLayout } from '../../hooks/useMediaQuery.ts'

export const DodLayout = () => {
  const { showDodLayout } = useShowDodLayout()

  if (showDodLayout)
    return (
      <div className={cl.dodLayout}>
        <div className={cl.imageWrapper}>
          <img className={cl.dodImage} src={appConfig.dodImageUrl} alt='' />
        </div>
        <div className={cl.appViewer}>
          <Outlet />
        </div>
      </div>
    )

  return <Outlet />
}
