<script lang="ts" module>
	interface Props extends HTMLSelectAttributes {
		/**
		 * Removes the borders from the element. This has the side effect of also making the element transparent and also removes the outline when focused/active.
		 */
		borderless?: boolean;

		value?: any;
	}
</script>

<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';

	let {
		borderless,

		value = $bindable(),
		...props
	}: Props = $props();
</script>

<select class:borderless bind:value {...props}>
	<!-- svelte-ignore slot_element_deprecated -->
	<slot />
</select>

<style>
	select {
		border-radius: var(--clui-radius, 0);
		border-width: 0.0625rem;
		border-style: solid;
		border-color: transparent;
		background-color: transparent;
		color: currentColor;
		font-size: 0.8rem;
	}

	select:not(.borderless) {
		border-color: var(--clui-color-base-7);
		background-color: var(--clui-color-base-3);
		color: var(--clui-color-base-12);
	}

	select[disabled] {
		color: var(--clui-color-base-11);
		cursor: not-allowed;
	}

	/* Hover */

	select:not(.borderless):not([readonly]):not([disabled]):hover {
		border-color: var(--clui-color-base-8);
	}

	/* Focus */

	select:focus {
		outline: none;
	}

	select:not(.borderless):not([readonly]):not([type='range']):focus {
		outline-width: 0.125rem;
		outline-style: solid;
		outline-color: var(--clui-color-accent-8);
		border-color: var(--clui-color-base-2);
	}
</style>
