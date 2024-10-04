import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios'

function copyAttribute(target, source, qualifiedName) {
	target.setAttribute(qualifiedName, source.getAttribute(qualifiedName))
}

const PlanLive = ({onSpaceClick}) => {
	
	
	let svgRef = useRef() //Хранит ссылку на отображаемую svg
	
	useEffect(() => {
		//TODO: сделать получение ссылки исходя из того какой план нужно загрузить
		axios.get('https://mospolynavigation.github.io/navigationData/BS/N/N-4.svg')
			.then(req => { //Запрос svg
					const parsedSVGElement = (new DOMParser()).parseFromString(req.data, 'image/svg+xml').documentElement //Парсинг svg в DOM-объект
					// console.log(parsedSVGElement)
					// Копируем атрибуты с загруженной svg на svg на странице
					copyAttribute(svgRef.current, parsedSVGElement, 'viewBox')
					copyAttribute(svgRef.current, parsedSVGElement, 'fill')
					copyAttribute(svgRef.current, parsedSVGElement, 'xmlns')
					// Вставляем содержимое с загруженной svg на svg на странице
					svgRef.current.innerHTML = parsedSVGElement.innerHTML
					// console.log(svgRef.current)
					
					//TODO: Дальше нужно вставить из onPlanLoad, лучше завести отдельный класс и работать через него, тогда в принципе множество кода можно будет
					// скопировать
					
				// Здесь вешается функция обработки клика на нажатие на помещение
					const n405 = svgRef.current.getElementById('n-405')
					n405.addEventListener('click', onSpaceClick)
				}
			)
		
		return () => {
			console.log('Удаляется план')
			//TODO Удалить все добавленные прослушиватели событий
			const n405 = svgRef.current.getElementById('n-405')
			n405.removeEventListener('click', onSpaceClick)
		}
	}, [])
	
	
	return (
		<div className="plans-objects-wrapper">
			<svg className="plan__image" ref={svgRef}></svg> // Собственно сама svg на плане
			//Здесь будут еще другие объекты возможно, например svg с маршрутом
		</div>
	)
}

export default PlanLive
