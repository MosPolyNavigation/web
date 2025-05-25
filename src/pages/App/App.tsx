import cl from './App.module.scss'
import MiddleAndTopControlsLayer from '../../components/layouts/ControlsLayer/MiddleAndTopControlsLayer.tsx'
import LeftMenu from '../../components/layouts/LeftMenu/LeftMenu.tsx'
import {useEffect, useRef} from 'react'
import HomeLayer from '../../components/layouts/HomeLayer/HomeLayer.tsx'
import BottomLayer from '../../components/layouts/BottomLayer/BottomLayer.tsx'
import SpaceInfo from '../../components/layouts/BottomLayer/SpaceInfo/SpaceInfo.tsx'
import {Layout} from '../../constants/enums.ts'
import BottomControlsLayer from '../../components/layouts/BottomControlsLayer/BottomControlsLayer.tsx'
import SearchMenu from '../../components/layouts/BottomLayer/SearchMenu/SearchMenu.tsx'
import {appStore, useAppStore} from '../../store/useAppStore.ts'
import {useDataStore} from '../../store/useDataStore.ts'
import PlanLayout from '../../components/layouts/Plan/PlanLayout.tsx'
import WayInfo from '../../components/layouts/BottomLayer/WayInfo/WayInfo.tsx'
import {IconLink} from '../../constants/IconLink.ts'
import Toast from '../../components/common/Toast/Toast.tsx'
import {appConfig} from '../../appConfig.ts'
import {userStore} from '../../store/useUserStore.ts'
import axios from 'axios'
import {statisticApi} from '../../api/statisticApi.ts'

function App() {
	const activeLayout = useAppStore(state => state.activeLayout);
	const queryService = useAppStore(state => state.queryService);
	const appRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		//Если пользователь не заходил на сайти или заходил больше 85 минут назад, показать начальный экран
		if(!appConfig.firstPlanSettingDate || (Date.now() - appConfig.firstPlanSettingDate) > 85 * 60 * 1000) {
			appStore().changeLayout(Layout.LOCATIONS)
		}
		useDataStore.getState().init();
		// Удаляем возможность параномирования пальцами
		if(appRef.current)
			appRef.current.addEventListener("touchmove", (e) => {
				e.preventDefault()
			})
	}, []);

	useEffect(() => {
		(async () => {

			if(!userStore().userId) {
				const userId = await statisticApi.getUserToken()
				userStore().setUserId(userId)
			}
			void statisticApi.sendSiteVisit()

		})()
	}, []);

	return (
		<div className={cl.app} ref={appRef}>
			<BottomControlsLayer />

			<MiddleAndTopControlsLayer />

			<LeftMenu />

			<HomeLayer />

			<BottomLayer>
				{activeLayout === Layout.SEARCH && <SearchMenu />}
				{/*TODO: По идее надо добавить в стор сосотояния для открытого SpaceInfo и WayInfo чтобы вот так костыльно не делать*/}
				{activeLayout !== Layout.SEARCH && queryService.steps === undefined && <SpaceInfo />}
				{activeLayout !== Layout.SEARCH &&
					queryService.steps ?
					<WayInfo fromWay={{fromIcon: IconLink.STUDY, text: "Н 405 (Аудитория)"}} toWay={{toIcon: IconLink.STUDY, text: "Н 519 (Аудитория)"}} steps={[{stepIcon: IconLink.STEP1, stepText: "Дойти до лестницы, подняться на 5-й этаж"}, {stepIcon: IconLink.STEP1, stepText: "Дойти до аудитории"}]} />
					: null
				}
			</BottomLayer>

			<PlanLayout />
			<Toast />
			{/*<div style={{position: "absolute", inset: 0, width: '100%', height: '100%', backgroundColor: "white", zIndex: 2}}>*/}
			{/*	*/}
			{/*	<h1>asl;dkj</h1>*/}
			{/*</div>*/}
		</div>
	);
}

export default App;
