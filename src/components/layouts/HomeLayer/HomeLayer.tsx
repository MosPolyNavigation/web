import {FC, useEffect, useMemo, useState} from 'react';
import cl from './HomeLayer.module.scss';
import LocationCard from '../../menuopmponents/LocationCard/LocationCard.tsx';
import classNames from 'classnames';
import useOnHideRemover from '../../../hooks/useOnHideRemover.ts';
import {useAppStore} from '../../../store/useAppStore.ts';
import {Layout} from '../../../constants/enums.ts';
import {useDataStore} from '../../../store/useDataStore.ts';
import {LocationData} from '../../../constants/types.ts';
import {isApple} from '../../../functions/common/isApple.ts';
import Toast from "../../common/Toast/Toast.tsx";

const HomeLayer: FC = () => {
	const activeLayout = useAppStore(state => state.activeLayout);
	const previousLayout = useAppStore(state => state.previousLayout)
	const currentPlan = useAppStore(state => state.currentPlan);
	const locations = useDataStore(state => state.locations);
	const corpuses = useDataStore(state => state.corpuses);
	const [expandedLocation, setExpandedLocation] = useState<LocationData | null>(null);
	const isVisible = useMemo(() =>
		activeLayout === Layout.LOCATIONS || (activeLayout === Layout.SEARCH && previousLayout === Layout.LOCATIONS)
		, [activeLayout, previousLayout]);

	useEffect(() => {
		if(isVisible) {
			setExpandedLocation(currentPlan? currentPlan.corpus.location : null)
		}
	}, [currentPlan, isVisible]);

	const [isRemoved, removerAnimationEndHandler] = useOnHideRemover(isVisible);

	if(isRemoved) {
		return null;
	}

	const expandLocation = (location) => {
		setExpandedLocation(location)
	}

	const layoutClass = classNames(cl.homeLayer, {
		[cl.hidden]: !isVisible,
		[cl.apple]: isApple()
	});

	return (
		<div onAnimationEnd={removerAnimationEndHandler} className={layoutClass}>
			<div className={cl.screenCaption}>Локации</div>
			<div className={cl.content}>
				{
					locations.map(location => (
						<LocationCard
							key={location.id}
							location={location}
							corpuses={corpuses.filter(corpus => corpus.location === location)}
							expanded={location === expandedLocation}
							expandLocation={expandLocation}
						/>
					))
				}
			</div>
		</div>
	);
};

export default HomeLayer;
