import cl from './Toast.module.scss'
import Icon from '../Icon/Icon.tsx'
import { IconLink } from '../../../constants/IconLink.ts'
import { Color, Size } from '../../../constants/enums.ts'
import { observer } from 'mobx-react-lite'
import classNames from 'classnames'
import { useAppStore } from '../../../store/useAppStore.ts'

const Toast = observer(() => {
  {
    const isShown = useAppStore((state) => state.toast.isShown)
    const content = useAppStore((state) => state.toast.content)

    const classes = classNames(cl.toast, {
      [cl.hidden]: !isShown,
    })

    return (
      <div className={classes}>
        <Icon size={Size.L} classNameExt={cl.toastIcon} iconLink={IconLink.SMILE_SAD} color={Color.INITIAL} />
        <p className={cl.toastText}>{content}</p>
      </div>
    )
  }
})

export default Toast
