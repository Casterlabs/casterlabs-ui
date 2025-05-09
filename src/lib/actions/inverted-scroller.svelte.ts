import type { Action } from 'svelte/action';
import { getRenderingEngine } from '$lib/util/feature-detect.js';

declare type IsAtBottomCallback = (isAtBottom: boolean) => void;

class InvertedScrollerHandler {
	private scrollBehavior: ScrollBehavior;
	private scrollContainer: HTMLElement;
	private isAtBottomCallback: IsAtBottomCallback;

	private scrollTopUpdateTask = -1;
	private targetScrollTop = 0;

	constructor(scrollContainer: HTMLElement, isAtBottomCallback: IsAtBottomCallback) {
		this.scrollContainer = scrollContainer;
		this.isAtBottomCallback = isAtBottomCallback;

		// Allowlist specific rendering engines for smooth scrolling.
		// Some browsers have a built-in debounce that won't start the animation until our final scrollTo() call
		// which prevents our scrolling implementation from working correctly.
		//
		// So we allow for smooth scrolling if the browser behaves how we want it to.
		switch (getRenderingEngine()) {
			case 'webkit': // a.k.a safari
			case 'gecko': // a.k.a firefox
				this.scrollBehavior = 'smooth';
				break;

			default:
				this.scrollBehavior = 'instant';
				break;
		}
	}

	onScroll() {
		const isAtBottom = this.scrollContainer.scrollTop == 0; // Note that the scroll direction is inverted.
		this.isAtBottomCallback(isAtBottom);

		// Debounce to make it less jumpy.
		// Browsers usually send scroll events pretty quickly when triggered by scrollTo(smooth).
		clearTimeout(this.scrollTopUpdateTask);
		this.scrollTopUpdateTask = setTimeout(() => {
			this.targetScrollTop = this.scrollContainer.scrollTop;
		}, 100);
	}

	onWheel(e: WheelEvent) {
		e.preventDefault();

		/*
            So, by default. Most browsers will change the value of deltaY depending on whether or not you check deltaMode. 
            We have an issue where we *cannot* accurately figure out the value of DOM_DELTA_LINE. At least, I haven't been
            able to. So we rely on this behavior. 
            
            TODO figure out how to reliably get the value of DOM_DELTA_LINE, as not all browsers do this sneaky conversion.
            This appears to work pretty reliably in Blink, Gecko, and WebKit, so I'm happy with it.
        */

		let newTargetScrollTop = this.targetScrollTop - e.deltaY; // Note that the scroll direction is inverted.

		const maxScroll = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight;
		if (newTargetScrollTop < 0) {
			newTargetScrollTop = 0; // Min.
		} else if (newTargetScrollTop > maxScroll) {
			newTargetScrollTop = maxScroll; // Max.
		}

		if (newTargetScrollTop == this.targetScrollTop) {
			return; // Don't call scrollTo() unnecessarily.
		}

		this.targetScrollTop = newTargetScrollTop;
		this.scrollContainer.scrollTo({
			top: newTargetScrollTop,
			behavior: this.scrollBehavior
		});
	}
}

const action: Action<HTMLElement, IsAtBottomCallback> = (node, isAtBottomCallback) => {
	$effect(() => {
		const handler = new InvertedScrollerHandler(node, isAtBottomCallback);

		function onScroll() {
			handler.onScroll();
		}

		function onWheel(e: WheelEvent) {
			handler.onWheel(e);
		}

		node.addEventListener('scroll', onScroll);
		node.addEventListener('wheel', onWheel);

		return () => {
			node.removeEventListener('scroll', onScroll);
			node.removeEventListener('wheel', onWheel);
		};
	});
};

export default action;
