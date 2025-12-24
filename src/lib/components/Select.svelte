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

	let propsWithoutStyling = $derived.by(() => {
		return { ...props, class: undefined, style: undefined };
	});

	let propsOnlyStyling = $derived.by(() => {
		return { class: props.class, style: props.style };
	});
</script>

<div class:borderless class:disabled={props.disabled} {...propsOnlyStyling}>
	<select class:borderless bind:value {...propsWithoutStyling}>
		<!-- svelte-ignore slot_element_deprecated -->
		<slot />
	</select>
</div>

<style>
	div {
		position: relative;
		display: inline-block;
		line-height: 0;
	}

	div::after {
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

	div {
		border-radius: var(--clui-radius, 0);
		border-width: 0.0625rem;
		border-style: solid;
		border-color: transparent;
		background-color: transparent;
		color: currentColor;
		font-size: 0.8rem;
		text-align: left;
	}

	div:not(.borderless) {
		border-color: var(--clui-color-base-7);
		background-color: var(--clui-color-base-3);
		color: var(--clui-color-base-12);
	}

	div.disabled {
		color: var(--clui-color-base-11);
	}

	/* Hover */

	div:not(.borderless):not(.disabled):hover {
		border-color: var(--clui-color-base-8);
	}

	/* Focus */

	div:not(.borderless):focus-within {
		outline-width: 0.125rem;
		outline-style: solid;
		outline-color: var(--clui-color-accent-8);
		border-color: var(--clui-color-base-2);
	}

	/* Mangling the select */

	select {
		line-height: normal;
		color: currentColor;
		background-color: transparent;
		border: none;
		outline: none;
		appearance: none;
		padding-right: 1rem;
		border-radius: var(--clui-radius, 0);
	}

	select:not(.borderless) {
		background-color: var(--clui-color-base-3);
		padding: var(--clui-padding);
		padding-right: calc(var(--clui-padding, 0) + 1rem);
	}

	select[disabled] {
		cursor: not-allowed;
	}
</style>
