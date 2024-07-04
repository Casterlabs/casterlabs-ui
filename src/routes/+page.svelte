<script lang="ts">
	import Box from '$lib/components/Box.svelte';
	import Root from '$lib/components/Root.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import NumberInput from '$lib/components/form/NumberInput.svelte';
	import RangeInput from '$lib/components/form/RangeInput.svelte';

	import { registerProvider } from '$lib/icons.js';

	registerProvider('example', (name) => {
		switch (name) {
			case 'academic-cap':
				return `
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 100%; height: 100%;">
					<path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
				</svg>
				`; // https://heroicons.com

			default:
				throw 'Unknown icon';
		}
	});

	let numberInputTest = 69;
</script>

<Root>
	<Box resize="none" width={96} height="fit" roundness="md">
		<NumberInput bind:value={numberInputTest} height={6} width={42} roundness="md" placeholder="Pick a number, any number" />
		<br />
		<RangeInput bind:value={numberInputTest} height={6} width={42} roundness="md" />
		<br />
		<br />
		Your number: {numberInputTest}<button on:click={() => numberInputTest++}>+</button>
	</Box>
	<br />
	<Box resize="both" width={96} height={24} roundness="md">
		Boxes can (optionally) be resized
		<Icon icon="example/academic-cap" transform="rotate3d(1, 1, 1, 45deg)" />
		<Icon icon="example/academic-cap" color="accent-9" />
	</Box>
</Root>

<style>
	:global(body) {
		font-family: sans-serif;
	}
</style>
