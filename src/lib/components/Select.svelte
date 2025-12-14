<script lang="ts" module>
	import type { HTMLSelectAttributes } from 'svelte/elements';

	interface Props extends HTMLSelectAttributes {
		/**
		 * Removes the borders from the element. This has the side effect of also making the element transparent and also removes the outline when focused/active.
		 */
		borderless?: boolean;

		value?: any;
	}
</script>

<script lang="ts">
	let {
		borderless,

		value = $bindable(),
		...props
	}: Props = $props();
</script>

<div class="wrapper">
	<select class:borderless bind:value {...props}>
		<!-- svelte-ignore slot_element_deprecated -->
		<slot />
	</select>
</div>

<style>
	.wrapper {
		position: relative;
		display: inline-flex;
	}

	.wrapper::after {
		content: '';
		position: absolute;
		right: 0.5rem;
		top: 50%;
		width: 0.25rem;
		height: 0.25rem;
		pointer-events: none;

		border-right: 0.125rem solid currentColor;
		border-bottom: 0.125rem solid currentColor;
		transform: translateY(-50%) rotate(45deg);
	}

	select {
		border-radius: var(--clui-radius, 0);
		border-width: 0.0625rem;
		border-style: solid;
		border-color: transparent;
		background-color: transparent;
		color: currentColor;
		font-size: 0.8rem;
		text-align: left;
		appearance: none;
		padding-right: 1rem;
	}

	select:not(.borderless) {
		border-color: var(--clui-color-base-7);
		background-color: var(--clui-color-base-3);
		color: var(--clui-color-base-12);
		padding: var(--clui-padding);
		padding-right: calc(var(--clui-padding, 0) + 1rem);
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
