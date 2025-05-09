<script lang="ts" module>
	type Direction = 'horizontal' | 'vertical';

	interface Props {
		class?: string;
		style?: string;
		direction: Direction;
		size?: string;
	}
</script>

<script lang="ts">
	let {
		//
		class: clazz,
		style,
		direction,
		size = '100%'
	}: Props = $props();
</script>

<div
	{style}
	class={clazz}
	style:width={direction == 'horizontal' ? size : '0.0625rem'}
	style:height={direction == 'vertical' ? size : '0.0625rem'}
></div>

<style>
	div {
		background-color: var(--clui-color-base-7);
	}
</style>
