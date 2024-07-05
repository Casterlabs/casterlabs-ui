<script lang="ts">
	import InternalInput, { type StandardInputProps } from './_InternalInput.svelte';

	interface $$Props extends StandardInputProps {
		// We now have to manually specify our own props. That's what we get :P
		value?: number;
		min?: number;
		max?: number;
		step?: number;
	}

	import { onMount, createEventDispatcher } from 'svelte';
	import Debouncer from '$lib/debouncer.js';

	const dispatch = createEventDispatcher();
	const debouncer = new Debouncer();

	export let value = 0;
	export let min = NaN;
	export let max = NaN;
	export let step = 1;

	export let inputElement: HTMLInputElement | null = null;
	export let ID: string = '';

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
				if (inputElement.disabled) return; // Don't.

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

<InternalInput
	bind:ID
	bind:inputElement
	type="range"
	borderless={true}
	properties={{
		min: min,
		max: max,
		step: step,
		inputmode: 'numeric',
		pattern: 'd*'
	}}
	{...$$restProps}
	hasLabel={$$slots.label}
>
	<svelte:fragment slot="label">
		<slot name="label" />
	</svelte:fragment>
</InternalInput>

<style>
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
	:global(.clui-input[type='range']:not([disabled]):hover::-webkit-slider-thumb) {
		border-color: var(--base-8);
	}
	:global(.clui-input[type='range'][disabled]:hover::-webkit-slider-thumb) {
		border-color: var(--base-7);
		cursor: auto;
	}
	:global(.clui-input[type='range']:focus::-webkit-slider-thumb) {
		outline-width: 2px;
		outline-style: solid;
		outline-color: var(--accent-8);
		border-color: var(--base-2);
	}
</style>
