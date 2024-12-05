import cl from './App.module.scss';
import MiddleAndTopControlsLayer from '../../layouts/ControlsLayer/MiddleAndTopControlsLayer.tsx';
import LeftMenu from '../../layouts/LeftMenu/LeftMenu.tsx';
import {useEffect} from 'react';
import HomeLayer from '../../layouts/HomeLayer/HomeLayer.tsx';
import BottomLayer from '../../layouts/BottomLayer/BottomLayer.tsx';
import SpaceInfo from '../../layouts/BottomLayer/SpaceInfo/SpaceInfo.tsx';
import {Layout} from '../../associations/enums.ts';
import BottomControlsLayer from '../../layouts/BottomControlsLayer/BottomControlsLayer.tsx';
import SearchMenu from '../../layouts/BottomLayer/SearchMenu/SearchMenu.tsx';
import {useAppStore} from '../../store/useAppStore.ts';
import {useDataStore} from '../../store/useDataStore.ts';
import PlanLayout from '../../layouts/Plan/PlanLayout.tsx';

function App() {
	const activeLayout = useAppStore(state => state.activeLayout);

	useEffect(() => {
		useDataStore.getState().fetchData();
	}, []);

	return (
		<div className={cl.app}>
			<BottomControlsLayer />

			<MiddleAndTopControlsLayer />

			<LeftMenu />

			<HomeLayer />

			<BottomLayer>
				{activeLayout !== Layout.SEARCH && <SpaceInfo />}
				{activeLayout === Layout.SEARCH && <SearchMenu />}
			</BottomLayer>

			<PlanLayout />
		</div>
	);
}

export default App;
