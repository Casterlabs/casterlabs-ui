<script lang="ts">
	import InternalInput from './_InternalInput.svelte';

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
		placeholder?: string;
		readOnly?: boolean;
	}

	const dispatch = createEventDispatcher();
	const debouncer = new Debouncer();

	export let value = 0;
	export let min = NaN;
	export let max = NaN;
	export let step = 1;
	export let placeholder = '';
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

		inputElement.addEventListener(
			'wheel',
			(event) => {
				// if (!inputElement) return;
				// if (document.activeElement != inputElement) return; // We don't have focus.
				// if (readOnly) return; // Don't.
				// if (event.deltaY != 0 && event.deltaY != -0) {
				// 	if (event.deltaY > 1) {
				// 		// @ts-ignore
				// 		// inputElement.value -= step;
				// 	} else {
				// 		// @ts-ignore
				// 		// inputElement.value += step;
				// 	}
				// }
			},
			{ passive: true }
		);
	});
</script>

<InternalInput
	bind:inputElement
	type="number"
	properties={{
		min: min,
		max: max,
		step: step,
		placeholder,
		readonly: readOnly,
		inputmode: 'numeric',
		pattern: 'd*'
	}}
	{...$$restProps}
/>
