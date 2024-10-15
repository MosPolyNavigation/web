import React, { useEffect, useRef, useCallback, useState } from 'react';
import axios from 'axios';

function copyAttribute(target, source, qualifiedName) {
	target.setAttribute(qualifiedName, source.getAttribute(qualifiedName));
}

const PlanLive = ({ onSpaceClick }) => {
	const svgRef = useRef(null);
	const [svgLoaded, setSvgLoaded] = useState(false); // костыль чтобы svg не рендерился повторно

	// Обработка клика на аудиторию
	const onAuditoriumClicked = useCallback((clickedAuId, auditoriums) => {
		const clickedAuditorium = auditoriums.get(clickedAuId);
		const isSelected = clickedAuditorium.classList.contains('selected');
		const name = clickedAuId;
		const desc = `Description for ${clickedAuId}`;

		if (isSelected) {
			onSpaceClick(name, desc)
			return;
		}

		auditoriums.forEach(($auditorium, auditoriumID) => {
			if (auditoriumID !== clickedAuId) {
				$auditorium.classList.remove('selected');
			} else {
				$auditorium.classList.add('selected');
			}
		});

		onSpaceClick(name, desc);
	}, [onSpaceClick]);

	const setupAuditoriumClickListeners = useCallback((auditoriums) => {
		auditoriums.forEach(($auditorium, auId) => {
			$auditorium.addEventListener('click', () => onAuditoriumClicked(auId, auditoriums));
		});
	}, [onAuditoriumClicked]);

	const loadSVG = useCallback(() => {
		if (svgLoaded) return; // Если SVG уже загружен, выходим из функции

		axios.get('https://mospolynavigation.github.io/navigationData/BS/N/N-4.svg')
			.then((response) => {
				const parsedSVGElement = (new DOMParser()).parseFromString(response.data, 'image/svg+xml').documentElement;

				if (svgRef.current) {
					copyAttribute(svgRef.current, parsedSVGElement, 'viewBox');
					copyAttribute(svgRef.current, parsedSVGElement, 'fill');
					copyAttribute(svgRef.current, parsedSVGElement, 'xmlns');
					svgRef.current.innerHTML = parsedSVGElement.innerHTML;

					const auditoriums = new Map();
					const spaces = svgRef.current.getElementById('Spaces').children;

					for (let space of spaces) {
						if (space.id.charAt(0) !== '!' && space.tagName !== 'g') {
							auditoriums.set(space.id, space);
						}
					}

					setupAuditoriumClickListeners(auditoriums);
					setSvgLoaded(true); // Устанавливаем состояние, что SVG загружен
				}
			})
			.catch((error) => {
				console.error('Error loading SVG:', error);
			});
	}, [setupAuditoriumClickListeners, svgLoaded]);

	// удаление прослушивателей
	const removeEventListeners = useCallback(() => {
		if (svgRef.current) {
			const spaces = svgRef.current.getElementById('Spaces').children;
			for (let space of spaces) {
				space.removeEventListener('click', () => {}); // Удаляем все слушатели кликов
			}
		}
	}, []);

	useEffect(() => {
		loadSVG(); // Загружаем SVG при монтировании компонента

		return () => {
			removeEventListeners(); // Удаляем слушатели при размонтировании
		};
	}, [loadSVG, removeEventListeners]);

	return (
		<div className="plans-objects-wrapper">
			<svg className="plan__image" ref={svgRef}></svg>
		</div>
	);
};

export default PlanLive;
