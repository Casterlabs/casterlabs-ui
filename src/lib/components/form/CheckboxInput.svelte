<script lang="ts">
	import InternalInput, { type StandardInputProps } from './_InternalInput.svelte';

	interface $$Props extends StandardInputProps {
		// We now have to manually specify our own props. That's what we get :P
		value?: boolean;
	}

	import { onMount, createEventDispatcher } from 'svelte';
	import Debouncer from '$lib/debouncer.js';

	const dispatch = createEventDispatcher();
	const debouncer = new Debouncer();

	export let value = false;
	export let inputElement: HTMLInputElement | null = null;

	$: value,
		(() => {
			if (!inputElement) return;

			const oldValue = inputElement.checked;
			if (value == oldValue) return; // Avoid unnecessary updates.

			// @ts-ignore
			inputElement.checked = value;
		})();

	onMount(() => {
		if (!inputElement) return; // Shut up typescript.

		// @ts-ignore
		inputElement.checked = value;

		inputElement.addEventListener('input', () => {
			if (!inputElement) return;

			const newValue = inputElement.checked;
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
	});
</script>

<InternalInput bind:inputElement type="checkbox" borderless={true} properties={{}} {...$$restProps} hasLabel={$$slots.label}>
	<svelte:fragment slot="label">
		<slot name="label" />
	</svelte:fragment>
</InternalInput>

<style>
	:global(.clui-input[type='checkbox']) {
		accent-color: var(--accent-9);
	}
</style>
