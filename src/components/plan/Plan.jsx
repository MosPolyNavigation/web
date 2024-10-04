import React, {useEffect, useState} from 'react'
import {TransformComponent, TransformWrapper,} from 'react-zoom-pan-pinch'
import {Navigate, Route, Routes} from 'react-router-dom'

// components //
import Button from '../button/Button'
import AdditionalInfo from '../additionalInfo/AdditionalInfo'
import FloorScroll from '../floorsScroll/FloorScroll'
import ScaleButton from '../scaleButton/ScaleButton'
import Menu from '../menu/Menu'
import SearchMenu from '../searchMenu/SearchMenu'
import SearchPsevdoInput from '../searchPsevdoInput/SearchPsevdoInput'
import CampusMenu from '../campusMenu/CampusMenu'
import ComeBackHeader from '../comeBackHeader/ComeBackHeader'

//floors

// icons //
import burgerIcon from '../../images/burgerIcon.svg'
import heartIcon from '../../images/heartIcon.svg'
import homeIcon from '../../images/homeIcon.svg'
import PlanLive from '../PlanLive/PlanLive'


const Plan = () => {
	const [isShowAddInfo, setIsShowAddInfo] = useState(false)
	const [isShowMenu, setIsShowMenu] = useState(false)
	const [isActive, setIsActive] = useState(() => {
		return parseInt(localStorage.getItem('activeFloor')) || 0
	})
	const [isShowSearch, setIsShowSearch] = useState(false)
	const [isShowCampusMenu, setIsShowCampusMenu] = useState(true)
	
	const [startYAdditionalInfo, setStartYAdditionalInfo] = useState(0)
	const [startXMenu, setStartXMenu] = useState(0)
	
	const [floors, setFloors] = useState([])
	const [floorsImages, setFloorsImages] = useState([])
	
	const [currCorpus, setCurrCorpus] = useState('')
	
	const handleTouchStartAdditionalInfo = (e) => {
		setStartYAdditionalInfo(e.touches[0].clientY)
	}
	
	const [basePlan, setBasePlan] = useState()
	
	const onSpaceClick = (e) => { //Обработка нажатия на помещение
		//TODO: Если нет выбранной аудитории - показать (выбрать) и выделить, если есть, то если другая, поменять данные во всплывашке и выделить, иначе скрыть
		
		//TODO: Почему если я пишу setIsShowAddInfo(false) и setIsShowAddInfo(true), оно не работает?(( Я искренне не понимаю почему, сделайте пожалуйста чтобы нормально работало ((
		setIsShowAddInfo(prev => !prev)
	}
	
	useEffect(() => {
		console.log(isShowAddInfo)
	}, [isShowAddInfo])
	
	const handleTouchMoveAdditionalInfo = (e) => {
		const deltaY = e.touches[0].clientY - startYAdditionalInfo
		if (deltaY >= 50) {
			setIsShowAddInfo(false)
		}
	}
	
	const handleTouchMoveMenu = (e) => {
		const deltaX = e.touches[0].clientX - startXMenu
		if (deltaX <= - 100) {
			setIsShowMenu(false)
		}
	}
	
	const handleTouchStartMenu = (e) => {
		setStartXMenu(e.touches[0].clientX)
	}
	
	useEffect(() => {
		localStorage.setItem('activeFloor', isActive.toString())
	}, [isActive])
	
	//   const countFloors = [0, 1, 2, 3, 4, 5];
	return (
		<div className="plan">
			<div className="plan__wrapper">
				<TransformWrapper>
					<div className="scaleButton_wrapper">
						<ScaleButton />
					</div>
					<TransformComponent>
						<Routes>
							{floorsImages.map((floorsImage, index) => (
								<Route
									key={index}
									path={`/floor/${index}`}
									element={
										<PlanLive
											// TODO: Сюда добавить ссылку на план или его имя
											onSpaceClick={onSpaceClick}
										/>
									}
								/>
							))}
							<Route path="*" element={<Navigate to={`/floor/${0}`} />} />
						</Routes>
					</TransformComponent>
				</TransformWrapper>
			</div>
			<div className="button_wrapper button_burger">
				<div onClick={() => setIsShowMenu((prev) => !prev)}>
					<Button icon={burgerIcon} />
				</div>
			</div>
			<div className="boxshadow"></div>
			<div className="name__wrapper">
        <span className="text__name">
          Большая Семёновская <br /> Корпус {currCorpus}
        </span>
			</div>
			<div className="floorScroll_wrapper">
				<FloorScroll
					floors={floors}
					isActive={isActive}
					setIsActive={setIsActive}
				/>
			</div>
			<div className="common__wrapper">
				<div className="common__wrapper_top">
					<div
						onClick={() => setIsShowAddInfo((prev) => !prev)}
						className="button_wrapper button_heart"
					>
						<Button icon={heartIcon} />
					</div>
					<div
						className="searchPsevdoInput_wrapper"
						onClick={() => setIsShowSearch((prev) => !prev)}
					>
						<SearchPsevdoInput />
					</div>
					<div
						className="button_wrapper button_home"
						onClick={() => setIsShowCampusMenu((prev) => !prev)}
					>
						<Button icon={homeIcon} />
					</div>
				</div>
				<div
					onTouchStart={handleTouchStartAdditionalInfo}
					onTouchMove={handleTouchMoveAdditionalInfo}
					className={`additionalInfo__wrapper ${
						isShowAddInfo ? 'showAddInfo' : 'hideAddInfo'
					}`}
				>
					<AdditionalInfo
						isShowAddInfo={isShowAddInfo}
						setIsShowAddInfo={setIsShowAddInfo}
						nameAudience={'Н405 - Аудитория'}
						descAudience={'Корпус Н, 4-й этаж'}
					/>
				</div>
			</div>
			<div
				onTouchStart={handleTouchStartMenu}
				onTouchMove={handleTouchMoveMenu}
				className={`menu_wrapper ${isShowMenu ? 'showMenu' : 'hideMenu'}`}
			>
				<Menu setIsShowMenu={setIsShowMenu} />
			</div>
			
			<div
				className={`searchMenu_wrapper ${
					isShowSearch ? 'showSearchMenu' : 'hideSearchMenu'
				}`}
			>
				<ComeBackHeader
					title="Поиск"
					backFunction={() => setIsShowSearch((prev) => !prev)}
				></ComeBackHeader>
				
				<SearchMenu
					setIsShowSearch={setIsShowSearch}
					isShowSearch={isShowSearch}
				/>
			</div>
			
			<div
				className={`campusMenu_wrapper ${
					isShowCampusMenu ? 'showCampusMenu' : 'hideCampusMenu'
				}`}
			>
				<ComeBackHeader
					title="Кампусы"
					backFunction={() => setIsShowCampusMenu((prev) => !prev)}
				></ComeBackHeader>
				<CampusMenu
					setCurrCorpus={setCurrCorpus}
					currentLocateInfo={{
						campus: 'на Большой Семеновской',
						building: 'А',
					}}
					floors={floors}
					setFloors={setFloors}
					floorsImages={floorsImages}
					setFloorsImages={setFloorsImages}
					setIsShowCampusMenu={setIsShowCampusMenu}
					setIsShowSearch={setIsShowSearch}
					setIsShowAddInfo={setIsShowAddInfo}
					isShowAddInfo={isShowAddInfo}
					isActive={isActive}
					setIsActive={setIsActive}
				></CampusMenu>
			</div>
		</div>
	)
}

// onTouchStart={handleTouchStartAdditionalInfo}
// onTouchMove={handleTouchMoveAdditionalInfo}
// onTouchStart={handleTouchStartMenu}
// onTouchMove={handleTouchMoveMenu}

export default Plan
