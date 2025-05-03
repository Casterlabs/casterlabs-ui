<script lang="ts">
	let {
		//
		scrollContainer = $bindable({} as HTMLDivElement),
		isAtBottom = $bindable(true)
	} = $props();

	export function jumpToBottom(behavior: ScrollBehavior = 'smooth') {
		scrollContainer.scrollTo({
			top: 0, // Note that the scroll direction is inverted via CSS+JS.
			behavior
		});
	}
</script>

<div
	class="inverted-scroller"
	bind:this={scrollContainer}
	onscrollcapture={() => {
		isAtBottom = scrollContainer.scrollTop == 0; // Note that the scroll direction is inverted via CSS+JS.
	}}
	onwheel={(e) => {
		e.preventDefault();

		/*
            So, by default. Most browsers will change the value of deltaY depending on whether or not you check deltaMode. 
            We have an issue where we *cannot* accurately figure out the value of DOM_DELTA_LINE. At least, I haven't been
            able to. So we rely on this behavior. 
            
            TODO figure out how to reliably get the value of DOM_DELTA_LINE, as not all browsers do this sneaky conversion.
            This appears to work pretty reliably in Chromium and Firefox (haven't tested Safari), so I'm happy with it.
        */

		// function getLineHeightInPixels(element: HTMLElement) {
		// 	if (typeof window.getComputedStyle == 'undefined') {
		// 		return 16; // Approximate.
		// 	}

		// 	const computedStyle = window.getComputedStyle(element);
		// 	const lineHeight = computedStyle.lineHeight;

		// 	if (lineHeight === 'normal') {
		// 		// Handle the default "normal" line-height
		// 		// It's typically around 1.2 times the font size, but can vary
		// 		const fontSize = parseFloat(computedStyle.fontSize);
		// 		return fontSize * 1.2;
		// 	}

		// 	return parseFloat(lineHeight);
		// }

		let pixelY;
		// switch (e.deltaMode) {
		// 	case WheelEvent.DOM_DELTA_LINE: {
		// 		// Use the correct unit for scrolling.
		// 		const lineHeight = getLineHeightInPixels(e.currentTarget || scrollContainer);
		// 		console.debug(lineHeight);
		// 		pixelY = (e.deltaY * lineHeight) / 2;
		// 		break;
		// 	}

		// 	case WheelEvent.DOM_DELTA_PAGE:
		// 		pixelY = e.deltaY * window.innerHeight;
		// 		break;

		// 	case WheelEvent.DOM_DELTA_PIXEL:
		// 	default:
		pixelY = e.deltaY;
		// }

		const newY = scrollContainer.scrollTop - pixelY;

		// scrollContainer.scrollTop = newY;
		scrollContainer.scrollTo({
			top: newY,
			behavior: 'smooth'
		});
	}}
>
	<div class="child">
		<!-- svelte-ignore slot_element_deprecated -->
		<slot />
	</div>
</div>

<style>
	.inverted-scroller {
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.child {
		position: relative;
		height: fit-content;
		overflow-y: hidden;
	}

	.inverted-scroller,
	.inverted-scroller > .child {
		transform: scaleY(-1);
	}
</style>
