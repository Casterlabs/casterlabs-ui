<script lang="ts" module>
	interface Props extends HTMLInputAttributes {
		/**
		 * Removes the borders from the element. This has the side effect of also making the element transparent and also removes the outline when focused/active.
		 */
		borderless?: boolean;

		checked?: boolean | undefined | null;
		value?: any;
		group?: any | undefined | null;
		files?: FileList | undefined | null;
		indeterminate?: boolean | undefined | null;
	}
</script>

<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		type,
		borderless,

		checked = $bindable(),
		value = $bindable(),
		group = $bindable(),
		files = $bindable(),
		indeterminate = $bindable(),

		...props
	}: Props = $props();

	let inputElement: HTMLInputElement = $state({} as HTMLInputElement);

	function wheelHandler(event: WheelEvent) {
		if (props.readonly || props.disabled) return; // Don't modify.
		if (document.activeElement != inputElement) return; // We don't have focus.
		if (event.deltaY == 0 || event.deltaY == -0) return;

		event.preventDefault(); // Prevent webkit from doing their own increment/decrement.

		const step = props.step ?? 1;
		const min = props.min ?? -Infinity;
		const max = props.max ?? Infinity;

		if (event.deltaY > 1) {
			value -= step as number;
		} else {
			value += step as number;
		}

		if (value < min) {
			value = min;
		} else if (value > max) {
			value = max;
		}

		inputElement.dispatchEvent(new Event('change', { bubbles: true }));
	}
</script>

{#if type == 'checkbox'}
	<input
		bind:this={inputElement}
		type="checkbox"
		class:borderless
		bind:checked
		bind:group
		bind:indeterminate
		{...props}
	/>
{:else if type == 'radio'}
	<input bind:this={inputElement} type="radio" class:borderless bind:group {...props} />
{:else if type == 'file'}
	<input bind:this={inputElement} type="file" class:borderless bind:files {...props} />
{:else if type == 'number' || type == 'range'}
	{@const step = props.step ?? 1}
	{@const isInteger = Math.floor(step as number) == step}
	<input
		bind:this={inputElement}
		{type}
		class:borderless
		inputmode={isInteger ? 'numeric' : 'decimal'}
		pattern={isInteger ? '[0-9]*' : '[\\.0-9]*'}
		bind:value
		{...props}
		onwheel={wheelHandler}
	/>
{:else}
	<input bind:this={inputElement} {type} class:borderless bind:value {...props} />
{/if}

<style>
	/* Generic */

	input {
		border-radius: var(--clui-radius, 0);
		border-width: 0.0625rem;
		border-style: solid;
		border-color: transparent;
		background-color: transparent;
		color: currentColor;
		font-size: 0.8rem;
	}

	input[disabled] {
		cursor: not-allowed;
	}

	input[readonly] {
		caret-color: transparent;
	}

	input:not(.borderless) {
		border-color: var(--clui-color-base-7);
		background-color: var(--clui-color-base-3);
		color: var(--clui-color-base-12);
	}

	input:not(.borderless)::placeholder {
		color: var(--clui-color-base-11);
	}

	/* Generic Hover */

	input:not(.borderless):not([readonly]):not([disabled]):hover {
		border-color: var(--clui-color-base-8);
	}

	/* Generic Focus */

	input:focus {
		outline: none;
	}

	input:not(.borderless):not([readonly]):not([type='range']):focus {
		outline-width: 0.125rem;
		outline-style: solid;
		outline-color: var(--clui-color-accent-8);
		border-color: var(--clui-color-base-2);
	}

	/* Number Input */

	input[type='number'][disabled],
	input[type='number'][readonly] {
		appearance: textfield;
	}

	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		opacity: 0;
	}

	input[type='number']:hover::-webkit-outer-spin-button,
	input[type='number']:hover::-webkit-inner-spin-button,
	input[type='number']:focus::-webkit-outer-spin-button,
	input[type='number']:focus::-webkit-inner-spin-button {
		opacity: 1;
	}

	/* Range Input */

	input[type='range'] {
		--range-track-height: 0.25rem;
		--range-thumb-size: 1rem;

		--range-thumb-border: var(--clui-color-base-7);
		--range-thumb-color: var(--clui-color-base-3);
		--range-thumb-outline: transparent;

		appearance: none;
		cursor: pointer;
		height: var(--range-track-height);
		border-radius: var(--range-track-height);
	}

	input[type='range']:not([disabled]):not([readonly]):hover {
		--range-thumb-border: var(--clui-color-base-8);
		--range-thumb-color: var(--clui-color-base-4);
	}

	input[type='range']:not([readonly]):focus {
		--range-thumb-border: var(--clui-color-base-8);
		--range-thumb-color: var(--clui-color-base-4);
		--range-thumb-outline: var(--clui-color-accent-8);
	}

	input[type='range']::-webkit-slider-runnable-track {
		-webkit-appearance: none;
		height: var(--range-track-height);
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;

		margin-top: calc(var(--range-track-height) * -1 - 0.125rem); /* -0.125rem for track border */
		height: var(--range-thumb-size);
		width: var(--range-thumb-size);
		background: var(--range-thumb-color);

		border-radius: 100%;
		border-width: 0.0625rem;
		border-style: solid;
		border-color: var(--range-thumb-border);

		outline-width: 0.125rem;
		outline-style: solid;
		outline-color: var(--range-thumb-outline);
	}

	input[type='range']::-moz-range-thumb {
		margin-top: calc(var(--range-track-height) * -1);
		height: var(--range-thumb-size);
		width: var(--range-thumb-size);
		background: var(--range-thumb-color);

		border-radius: 100%;
		border-width: 0.0625rem;
		border-style: solid;
		border-color: var(--range-thumb-border);

		outline-width: 0.125rem;
		outline-style: solid;
		outline-color: var(--range-thumb-outline);
	}

	/* Checkbox */

	input[type='checkbox'] {
		--checkbox-size: 0.625rem;

		appearance: none;
		padding: 0.125rem;
		position: relative;
	}

	input[type='checkbox']::before {
		position: relative;
		display: block;
		width: var(--checkbox-size);
		height: var(--checkbox-size);
		content: '';
	}

	input[type='checkbox']:checked::after {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		/* font-size: 0.75rem; */
		content: '✓';
	}
</style>
