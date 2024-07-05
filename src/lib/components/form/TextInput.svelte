<script lang="ts">
	import InternalInput, { type StandardInputProps } from './_InternalInput.svelte';

	interface $$Props extends StandardInputProps {
		// We now have to manually specify our own props. That's what we get :P
		value?: string;
		placeholder?: string;
		type?: 'text' | 'password' | 'email' | 'tel' | 'search' | 'url';
		pattern?: string;
		inputMode?: string;
		maxLength?: number;
		minLength?: number;
		spellCheck?: boolean;
	}

	import { onMount, createEventDispatcher } from 'svelte';
	import Debouncer from '$lib/debouncer.js';

	const dispatch = createEventDispatcher();
	const debouncer = new Debouncer();

	export let value = '';
	export let placeholder = '';
	export let type = 'text';
	export let pattern = '';
	export let inputMode = '';
	export let maxLength = NaN;
	export let minLength = NaN;
	export let spellCheck = true;

	export let inputElement: HTMLInputElement | null = null;
	export let ID: string = '';

	$: value,
		(() => {
			if (!inputElement) return;

			const oldValue = inputElement.value;
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

			const newValue = inputElement.value;
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

<InternalInput
	bind:ID
	bind:inputElement
	{type}
	properties={{
		placeholder,
		pattern,
		inputmode: inputMode,
		maxlength: maxLength,
		minlength: minLength,
		spellcheck: spellCheck
	}}
	{...$$restProps}
	hasLabel={$$slots.label}
>
	<svelte:fragment slot="label">
		<slot name="label" />
	</svelte:fragment>
</InternalInput>

<style>
	:global(.clui-input[type='search']) {
		accent-color: var(--accent-9);
	}
</style>
