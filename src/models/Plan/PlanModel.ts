import {Id, PlanData, RoomModel} from '../../constants/types.ts'
import {copyAttribute, virtualCircleSVGEl} from '../../functions/planFunctions.ts'
import cl from '../../components/layouts/Plan/PlanLayout.module.scss'
import {appStore} from '../../store/useAppStore.ts'
import {statisticApi} from '../../api/statisticApi.ts'
import React from 'react'

export class PlanModel {
	readonly rooms: Map<Id, RoomModel>;

	constructor(public plan: PlanData, public planSvgEl: SVGSVGElement, virtualSvg: SVGSVGElement | HTMLElement, roomClickHandler: (room: RoomModel) => void) {
		// @ts-expect-error TS2339
		window.planModel = this
		this.rooms = new Map();

		virtualSvg.querySelector(`g#${plan.id} > rect`)?.remove(); //Удаление фона (прямоугольника) верхней вложенности, если он есть

		copyAttribute(planSvgEl, virtualSvg, 'viewBox'); //Копирование атрибутов из спаршенного изображения в реф-свг на страницу
		copyAttribute(planSvgEl, virtualSvg, 'xmlns');
		planSvgEl.setAttribute('fill', 'none');

		planSvgEl.innerHTML = virtualSvg.innerHTML; //Установка внутреннего содержимого отображаемого свг из спаршенного

		['g#Walls', 'g#Textes', '#gEntrances', 'g#Icons'].forEach(selector => {
			this.planSvgEl.querySelector(selector)?.classList?.add(cl.noSelect);
		});

		function addUnknownToastClick(spaceEl: Element) {
			spaceEl.addEventListener('click', (e) => {
				//Если есть активный маршрут, аудитория не выделяется
				if(appStore().queryService.steps)
					return
				const elementId = (e?.target as HTMLElement)?.id
				if(elementId) {
					void statisticApi.sendSelectRoom(elementId, false)
				}
				appStore().toast.showForTime('К сожалению, мы пока не знаем, что здесь')
			})
		}

		const unexploredElement = this.planSvgEl.getElementById('!-unexplored')
		if(unexploredElement) {
			addUnknownToastClick(unexploredElement)
		}

		for (const spaceEl of this.planSvgEl.getElementById('Spaces').children) {
			if (spaceEl.id.startsWith('!')) {
				addUnknownToastClick(spaceEl);
			}
			//Добавление помещения и его id в мап с помещениями
			else if (['path', 'rect'].includes(spaceEl.tagName)) {
				this.rooms.set(spaceEl.id, {
					roomId: spaceEl.id,
					roomEl: spaceEl as SVGPathElement | SVGCircleElement,
					entranceEl: virtualCircleSVGEl(), //пусто чтобы не делать проверки
					entranceId: 'null', //тоже пусто чтобы не делать проверки
				});
				spaceEl.removeAttribute('opacity'); //Удаление оригинального атрибута, потому что с ним плохо работает transition
				spaceEl.classList.add(cl.room); //добавляем помещению соответствующий класс, для подсветки
				setTimeout(() => spaceEl.classList.add(cl.animated), 20); //Добавление класса анимации чуть позже, чтобы успели обновиться свойства
			}
		}

		const entrancesIdToEl: Map<Id, SVGCircleElement> = new Map();
		for (const entranceEl of this.planSvgEl.getElementById('Entrances').children) {
			// if(entranceEl.tagName === 'circle') {
			entrancesIdToEl.set(entranceEl.id, entranceEl as SVGCircleElement);
			entranceEl.classList.add(cl.entrance);
			setTimeout(() => entranceEl.classList.add(cl.animated), 20);
			// }
		}

		function isEntranceOfRoom(entranceEl: HTMLElement | SVGCircleElement, roomEl: HTMLElement | SVGPathElement | SVGRectElement): boolean { //Функция возвращает, является ли кружочек входа входом в данное помещение
			const cx = Number(entranceEl.getAttribute('cx'));
			const cy = Number(entranceEl.getAttribute('cy'));
			const x = Number(roomEl.getAttribute('x'));
			const y = Number(roomEl.getAttribute('y'));
			const width = Number(roomEl.getAttribute('width'));
			const height = Number(roomEl.getAttribute('height'));
			return (cx >= x && cx <= x + width && cy >= y && cy <= y + height);
		}

		const entrancesFromData: Map<Id, Id> = new Map(plan.entrances); //Достаем данные о входах в помещения на плане из данных

		for (const [roomId, roomData] of this.rooms) { //заполнение входов в помещения
			if (entrancesFromData.get(roomId)) { //если вход задан в данных, взять оттуда
				roomData.entranceId = <string>entrancesFromData.get(roomId);
				if (roomData.entranceId) {
					roomData.entranceEl = <SVGCircleElement>entrancesIdToEl.get(roomData.entranceId);
				}
			} else { //Иначе вычислить (только для прямоугольников)
				for (const [entranceId, entranceEl] of entrancesIdToEl) {
					if (isEntranceOfRoom(entranceEl, roomData.roomEl)) {
						roomData.entranceId = entranceId;
						roomData.entranceEl = entranceEl;
					}
				}
			}
		}

		// this.testRoomsAndEntrances();

		for (const [, room] of this.rooms) {
			room.roomEl.addEventListener('click', () => {
				roomClickHandler(room);
			});
		}

		const selectedRoomId = appStore().selectedRoomId
		if (selectedRoomId) {
			const room = this.rooms.get(selectedRoomId);
			if (room)
				this.toggleRoom(room, {activateRoom: true, activateEntrance: true})
		}
	}

	/**
	 * Переключение подсветки помещения и кружочков входа
	 * @param room Модель помещения, которое надо выделить, если надо выделить помещение
	 * @param options `hideRooms` и `hideEntrances` - скрыть все помещения / кружочки входа, `activateRoom` и `activateEntrance` выделить переданное помещение / его кружочек входа
	 */
	public toggleRoom(room: RoomModel | null, options: {
		activateRoom?: boolean,
		hideRooms?: boolean,
		activateEntrance?: boolean,
		hideEntrances?: boolean,
	}) {
		if (options.hideRooms || options.hideEntrances) {
			for (const [, room] of this.rooms) {
				if (options.hideRooms) {
					room.roomEl.classList.remove(cl.selected);
				}
				if (options.hideEntrances && room.entranceEl) {
					room.entranceEl.classList.remove(cl.selected);
				}
			}
		}
		if (options.activateRoom && room) {
			room.roomEl.classList.add(cl.selected);
		}
		if (options.activateEntrance && room && room.entranceEl) {
			room.entranceEl.classList.add(cl.selected);
		}
	}

	/**
	 * Метод, добавляющий класс хайлайта на переданное помещение, а также слушатель события клика для переключения плана на следующий в маршруте
	 * @param room
	 * @param last Последний ли это план в маршруте, если нет, добавляет слушатель на переключения плана на следующий в маршруте
	 */
	public highlightRoomForNextStep(room: RoomModel | undefined, last: boolean) {
		if(!room) {
			console.log(`Попытка подсветить помещение, которого нет`, room)
			return
		}
		room.roomEl.classList.add(cl.highlight)
		if (!last) {
			const nextStepClickHandler = () => {
				appStore().queryService.nextStep()
			}
			room.roomEl.addEventListener('click', nextStepClickHandler)
			room.nextStepClickHandler = nextStepClickHandler
		}
	}

	/**
	 * Метод, убирающий с текущего плана хайлайты и слушатели, т.е. удаляет добавленное в методе `highlightRoomForNextStep`
	 */
	public deHighlightRoomsForNextStep() {
		this.rooms.forEach(room => {
			room.roomEl.classList.remove(cl.highlight);
			if (room.nextStepClickHandler) {
				room.roomEl.removeEventListener('click', room.nextStepClickHandler);
			}
		})
	}

	// noinspection JSUnusedLocalSymbols
	// private testRoomsAndEntrances() {
	// 	console.log('ПОМЕЩЕНИЯ И ВХОДЫ');
	//
	// 	async function aue() {
	// 		const {rooms} = this;
	// 		for(const [roomId, roomData] of rooms) {
	// 			await wait(1000);
	// 			console.log(roomId);
	// 			roomData.roomEl.setAttribute('fill', '#3d9984');
	// 			roomData.roomEl.setAttribute('class', '');
	// 			roomData.entranceEl.setAttribute('fill', '#CE5757');
	// 			roomData.entranceEl.setAttribute('r', '20');
	// 			roomData.entranceEl.setAttribute('class', '');
	// 			console.log(roomData.roomEl);
	// 		}
	// 	}
	//
	// 	aue.bind(this)();
	// }
}