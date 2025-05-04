<script lang="ts">
	let {
		//
		scrollContainer = $bindable({} as HTMLDivElement),
		isAtBottom = $bindable(true)
	} = $props();

	export function jumpToBottom(behavior: ScrollBehavior = 'smooth') {
		scrollContainer.scrollTo({
			top: 0, // Note that the scroll direction is inverted.
			behavior
		});
	}

	let targetScrollTop = $state(0);
	let scrollTopUpdateTask = -1;

	function onScrollCapture() {
		isAtBottom = scrollContainer.scrollTop == 0; // Note that the scroll direction is inverted.

		// Debounce to make it less jumpy.
		// Browsers usually send scroll events pretty quickly when triggered by scrollTo(smooth).
		clearTimeout(scrollTopUpdateTask);
		scrollTopUpdateTask = setTimeout(() => {
			targetScrollTop = scrollContainer.scrollTop;
		}, 100);
	}

	function onWheel(e: WheelEvent) {
		e.preventDefault();

		/*
            So, by default. Most browsers will change the value of deltaY depending on whether or not you check deltaMode. 
            We have an issue where we *cannot* accurately figure out the value of DOM_DELTA_LINE. At least, I haven't been
            able to. So we rely on this behavior. 
            
            TODO figure out how to reliably get the value of DOM_DELTA_LINE, as not all browsers do this sneaky conversion.
            This appears to work pretty reliably in Chromium and Firefox (haven't tested Safari), so I'm happy with it.
        */

		// Calling scrollTo while a previous call is still animating will cancel the current animation.
		// This is how we trick the browser into giving the same _feel_ as a normal scroll would have.

		targetScrollTop = targetScrollTop - e.deltaY; // Note that the scroll direction is inverted.
		scrollContainer.scrollTo({
			top: targetScrollTop,
			behavior: 'smooth'
		});
	}
</script>

<div
	class="inverted-scroller"
	bind:this={scrollContainer}
	onscrollcapture={onScrollCapture}
	onwheel={onWheel}
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
