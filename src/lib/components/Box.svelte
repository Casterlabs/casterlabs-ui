<script lang="ts" module>
	type ResizeProperty = 'none' | 'both' | 'horizontal' | 'vertical';
	type Side = 'top' | 'bottom' | 'left' | 'right';

	interface Props {
		class?: string;
		style?: string;
		resize?: ResizeProperty;
		sides?: Side[];
	}
</script>

<script lang="ts">
	let {
		//
		class: clazz,
		style,
		resize = 'none',
		sides = []
	}: Props = $props();

	const BORDER = '0.0625rem solid var(--clui-color-base-7)';
	const BORDER_NONE = '0.0625rem solid var(--clui-color-base-2)';

	let borderTop = $derived(sides.includes('top') ? BORDER : BORDER_NONE);
	let borderBottom = $derived(sides.includes('bottom') ? BORDER : BORDER_NONE);
	let borderLeft = $derived(sides.includes('left') ? BORDER : BORDER_NONE);
	let borderRight = $derived(sides.includes('right') ? BORDER : BORDER_NONE);
</script>

<div
	{style}
	class={clazz}
	style:resize
	style:border-top={borderTop}
	style:border-bottom={borderBottom}
	style:border-left={borderLeft}
	style:border-right={borderRight}
>
	<!-- svelte-ignore slot_element_deprecated -->
	<slot />
</div>

<style>
	div {
		padding: 0.5rem;
		border-radius: var(--clui-radius, 0);
		background-color: var(--clui-color-base-2);
	}
</style>
