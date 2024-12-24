import cl from './App.module.scss';
import MiddleAndTopControlsLayer from '../../components/layouts/ControlsLayer/MiddleAndTopControlsLayer.tsx';
import LeftMenu from '../../components/layouts/LeftMenu/LeftMenu.tsx';
import {useEffect} from 'react';
import HomeLayer from '../../components/layouts/HomeLayer/HomeLayer.tsx';
import BottomLayer from '../../components/layouts/BottomLayer/BottomLayer.tsx';
import SpaceInfo from '../../components/layouts/BottomLayer/SpaceInfo/SpaceInfo.tsx';
import {Layout} from '../../constants/enums.ts';
import BottomControlsLayer from '../../components/layouts/BottomControlsLayer/BottomControlsLayer.tsx';
import SearchMenu from '../../components/layouts/BottomLayer/SearchMenu/SearchMenu.tsx';
import {useAppStore} from '../../store/useAppStore.ts';
import {useDataStore} from '../../store/useDataStore.ts';
import PlanLayout from '../../components/layouts/Plan/PlanLayout.tsx';

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
