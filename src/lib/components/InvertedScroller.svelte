<script lang="ts" module>
	interface Props {
		isAtBottom?: boolean;
		scrollContainer?: HTMLElement;
	}
</script>

<script lang="ts">
	import invertedScroller from '$lib/actions/inverted-scroller.svelte.js';

	let {
		//
		isAtBottom = $bindable(true),
		scrollContainer = $bindable({} as HTMLDivElement)
	}: Props = $props();

	export function jumpToBottom(behavior: ScrollBehavior = 'smooth') {
		scrollContainer.scrollTo({
			top: 0, // Note that the scroll direction is inverted.
			behavior
		});
	}
</script>

<div
	class="inverted-scroller"
	bind:this={scrollContainer}
	use:invertedScroller={(b) => {
		isAtBottom = b;
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
