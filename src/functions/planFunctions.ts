import {PlanData} from '../associations/types.ts';
import {appConfig} from '../appConfig.ts';

export function copyAttribute(target: SVGSVGElement | HTMLElement | null, source: SVGSVGElement | HTMLElement | null, qualifiedName: string | null) {
	if(target && source && qualifiedName) {
		target.setAttribute(qualifiedName, <string>source.getAttribute(qualifiedName));
	}
}

export function getSvgLink(plan: PlanData): string {
	if(plan) {
		return appConfig.svgSource + plan?.wayToSvg;
	}
	return '';
}

export function virtualCircleSVGEl() {
	return document.createElementNS('http://www.w3.org/2000/svg','circle')
}
