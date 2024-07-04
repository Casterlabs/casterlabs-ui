<script lang="ts">
	import InternalInput from './_InternalInput.svelte';
	import NumberInput from './NumberInput.svelte';

	import { sizeToCSS } from '$lib/helper.js';
	import { onMount, createEventDispatcher } from 'svelte';
	import Debouncer from '$lib/debouncer.js';

	// Inherit properties from InternalInput.
	import { type ComponentProps } from 'svelte';
	interface $$Props extends ComponentProps<InternalInput> {
		// We now have to manually specify our own props. That's what we get :P
		value?: number;
		min?: number;
		max?: number;
		step?: number;
		readOnly?: boolean;
	}

	const dispatch = createEventDispatcher();
	const debouncer = new Debouncer();

	export let value = 0;
	export let min = NaN;
	export let max = NaN;
	export let step = 1;
	export let readOnly = false;

	export let inputElement: HTMLInputElement | null = null;

	$: value,
		(() => {
			if (!inputElement) return;

			const oldValue = parseFloat(inputElement.value);
			if (value == oldValue) return; // Avoid unnecessary updates.

			// @ts-ignore
			inputElement.value = value;
		})();

	onMount(() => {
		if (!inputElement) return; // Shut up typescript.

		// @ts-ignore
		inputElement.value = value;

		inputElement.addEventListener('input', () => {
			if (!inputElement) return;

			const newValue = parseFloat(inputElement.value);
			if (newValue == value) return; // Avoid unnecessary updates.

			value = newValue;
			dispatch('update', newValue);

			debouncer.debounce(() => {
				dispatch('update-debounced', value);
			});
		});

		inputElement.addEventListener('change', () => {
			dispatch('update-unfocused', value);
		});

		inputElement.addEventListener(
			'wheel',
			(event) => {
				if (!inputElement) return;
				if (document.activeElement != inputElement) return; // We don't have focus.
				if (readOnly) return; // Don't.

				if (event.deltaY != 0 && event.deltaY != -0) {
					if (event.deltaY > 1) {
						value -= step;
					} else {
						value += step;
					}
				}
				if (event.deltaX != 0 && event.deltaX != -0) {
					if (event.deltaX > 1) {
						value += step;
					} else {
						value -= step;
					}
				}
			},
			{ passive: true }
		);
	});
</script>

<div class="clui-input-range-container" style:width={sizeToCSS($$restProps.width)}>
	<div class="clui-input-range-sister" aria-hidden="true" style:padding={sizeToCSS($$restProps.padding || 0.5)}>
		<NumberInput bind:value {...$$restProps} width="full" borderless={true} padding={0} />
		<div class="clui-input-range-sister-dummy">
			<!-- We use this as a calculation for the width of this part. -->
			{value}
		</div>
	</div>

	{#if $$slots.default}
		<div style="margin-right: 2px;" style:padding-top={sizeToCSS($$restProps.padding || 0.5)}>
			<slot />
		</div>
	{/if}

	<InternalInput
		bind:inputElement
		type="range"
		borderless={true}
		properties={{
			min: min,
			max: max,
			step: step,
			readonly: readOnly,
			inputmode: 'numeric',
			pattern: 'd*'
		}}
		{...$$restProps}
		width="full"
	/>
</div>

<style>
	.clui-input-range-container {
		display: inline-flex;
		align-items: center;
	}

	.clui-input-range-sister {
		/* overflow: hidden; */
		width: min-content;
		height: 1rem;
		padding-bottom: 0.35rem !important;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: var(--base-7);
	}

	.clui-input-range-sister-dummy {
		display: block;
		overflow-y: hidden;
		height: 0;
		/* This is gross, I hate it. */
		font-size: 0.85rem;
		font-family: serif;
		letter-spacing: 0.04rem;
	}

	:global(.clui-input-range-sister .clui-input[type='number']) {
		appearance: textfield;
		text-align: right;
	}
	:global(.clui-input-range-sister .clui-input[type='number']::-webkit-outer-spin-button),
	:global(.clui-input-range-sister .clui-input[type='number']::-webkit-inner-spin-button) {
		-webkit-appearance: none;
		margin: 0;
	}

	:global(.clui-input[type='range']) {
		appearance: none;
		background: transparent;
		/* transform: translateY(-3px); */
	}

	:global(.clui-input[type='range']::-webkit-slider-runnable-track) {
		width: 100%;
		height: 4px;
		border: none;
		border-radius: 3px;
		background-color: var(--base-7);
	}

	:global(.clui-input[type='range']::-webkit-slider-thumb) {
		-webkit-appearance: none;
		height: 0.75rem;
		width: 0.75rem;
		border-radius: 500%;
		background-color: var(--base-1);
		border-width: 1px;
		border-style: solid;
		border-color: var(--base-7);
		margin-top: -0.25rem;
		cursor: pointer;
	}
	:global(.clui-input[type='range']:hover::-webkit-slider-thumb) {
		border-color: var(--base-8);
	}
	:global(.clui-input[type='range']:focus::-webkit-slider-thumb) {
		outline-width: 2px;
		outline-style: solid;
		outline-color: var(--accent-8);
		border-color: var(--base-2);
	}
</style>
