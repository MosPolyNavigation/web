import cl from "./Toast.module.scss";
import Icon from "../Icon/Icon.tsx";
import {IconLink} from "../../../constants/IconLink.ts";
import {Color, Size} from "../../../constants/enums.ts";
import {useStore} from "../../../store/rootStoreContext.ts";
import {observer} from "mobx-react-lite";
import classNames from "classnames";

const Toast = observer(() => {
	{
		const {appStore} = useStore()

		const componentCl = classNames(cl.toast, {
			[cl.hidden]: !appStore.toast.isVisible
		})

		return (
			<div className={componentCl}>
				<Icon size={Size.L} classNameExt={cl.toastIcon} iconLink={IconLink.SMILE_SAD} color={Color.INITIAL}/>
				<p className={cl.toastText}>К сожалению, мы пока не знаем, что здесь</p>
			</div>
		)
	}
})

export default Toast;