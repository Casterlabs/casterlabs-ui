<script lang="ts">
	type ResizeProperty = 'none' | 'both' | 'horizontal' | 'vertical';

	interface Props {
		class?: string;
		style?: string;
		resize?: ResizeProperty;
	}

	let { class: clazz, style, resize = 'none' }: Props = $props();
</script>

<div {style} class={clazz} style:resize>
	<!-- svelte-ignore slot_element_deprecated -->
	<slot />
</div>

<style>
	div {
		padding: 0.5rem;
		border-radius: var(--clui-radius, 0);
		border-width: 0.0625rem;
		border-style: solid;
		border-color: transparent;
		border-color: var(--clui-color-base-7);
		background-color: var(--clui-color-base-2);
	}
</style>
