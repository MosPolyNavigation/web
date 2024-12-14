import {Id, PlanData, RoomModel} from '../../associations/types.ts';
import {copyAttribute, virtualCircleSVGEl} from '../../functions/planFunctions.ts';
import cl from '../../layouts/Plan/PlanLayout.module.scss';

export class PlanModel {
	readonly rooms: Map<Id, RoomModel>;
	
	constructor(public plan: PlanData, private planSvgEl: SVGSVGElement, virtualSvg: SVGSVGElement, roomClickHandler: (room: RoomModel) => void) {
		this.rooms = new Map();
		
		virtualSvg.querySelector(`g#${plan.id} > rect`)?.remove(); //Удаление фона (прямоугольника) верхней вложенности, если он есть
		
		copyAttribute(planSvgEl, virtualSvg, 'viewBox'); //Копирование атрибутов из спаршенного изображения в реф-свг на страницу
		copyAttribute(planSvgEl, virtualSvg, 'xmlns');
		planSvgEl.setAttribute('fill', 'none');
		
		planSvgEl.innerHTML = virtualSvg.innerHTML; //Установка внутреннего содержимого отображаемого свг из спаршенного
		
		planSvgEl.style.scale = ''; //Сброс масштаба
		const svgGBound = planSvgEl.firstElementChild?.getBoundingClientRect() as DOMRect;
		
		//Если ширина свгшки больше чем ширина экрана с отступом 129пикс (пока фиксированно), то уменьшить и то же для высоты
		if(svgGBound.width > window.innerWidth - 120)
			planSvgEl.style.scale = ((window.innerWidth - 120) / svgGBound.width).toFixed(5);
		if(svgGBound.height > window.innerHeight - 140)
			planSvgEl.style.scale = ((window.innerHeight - 140) / svgGBound.height).toFixed(5);
		
		['g#Walls', 'g#Textes', '#gEntrances', 'g#Icons'].forEach(selector => {
			this.planSvgEl.querySelector(selector)?.classList?.add(cl.noSelect);
		});
		
		for(const roomEl of this.planSvgEl.getElementById('Spaces').children) {
			if(roomEl.id.startsWith('!') || roomEl.tagName === 'g')
				continue;
			//Добавление помещения и его id в мап с помещениями
			if(['path', 'rect'].includes(roomEl.tagName))
				this.rooms.set(roomEl.id, {
					roomId: roomEl.id,
					roomEl: roomEl as SVGPathElement | SVGCircleElement,
					entranceEl: virtualCircleSVGEl(), //пусто чтобы не делать проверки
					entranceId: 'null', //тоже пусто чтобы не делать проверки
				});
			roomEl.removeAttribute('opacity'); //Удаление оригинального атрибута, потому что с ним плохо работает transition
			roomEl.classList.add(cl.room); //добавляем помещению соответствующий класс, для подсветки
			setTimeout(() => roomEl.classList.add(cl.animated), 20); //Добавление класса анимации чуть позже, чтобы успели обновиться свойства
		}
		
		const entrancesIdToEl: Map<Id, SVGCircleElement> = new Map();
		for(const entranceEl of this.planSvgEl.getElementById('Entrances').children) {
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
		
		for(const [roomId, roomData] of this.rooms) { //заполнение входов в помещения
			if(entrancesFromData.get(roomId)) { //если вход задан в данных, взять оттуда
				roomData.entranceId = <string>entrancesFromData.get(roomId);
				if(roomData.entranceId) {
					roomData.entranceEl = <SVGCircleElement>entrancesIdToEl.get(roomData.entranceId);
				}
			} else { //Иначе вычислить (только для прямоугольников)
				for(const [entranceId, entranceEl] of entrancesIdToEl) {
					if(isEntranceOfRoom(entranceEl, roomData.roomEl)) {
						roomData.entranceId = entranceId;
						roomData.entranceEl = entranceEl;
					}
				}
			}
		}
		
		// this.testRoomsAndEntrances();
		
		for(const [, room] of this.rooms) {
			room.roomEl.addEventListener('click', () => {
				roomClickHandler(room);
			});
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
		if(options.hideRooms || options.hideEntrances) {
			for(const [, room] of this.rooms) {
				if(options.hideRooms) {
					room.roomEl.classList.remove(cl.selected);
				}
				if(options.hideEntrances) {
					room.entranceEl.classList.remove(cl.selected);
				}
			}
		}
		if(options.activateRoom && room) {
			room.roomEl.classList.add(cl.selected);
		}
		if(options.activateEntrance && room) {
			room.entranceEl.classList.add(cl.selected);
		}
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
