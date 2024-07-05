<script lang="ts">
	import { roundnessToCSS, sizeToCSS } from '$lib/helper.js';
	import type { ResizeProperty, RoundnessProperty, SizeProperty } from '$lib/helper.js';

	export let inputElement: HTMLInputElement | null = null;
	export let type: string = 'input';
	export let properties: { [key: string]: any } = {};

	export let borderless = false;
	export let readOnly = false;
	export let resize: ResizeProperty = 'none';
	export let width: SizeProperty = 'fit';
	export let height: SizeProperty = 'fit';
	export let padding: SizeProperty = 0.5;
	export let roundness: RoundnessProperty = 'none';
	export let transform = '';

	$: properties,
		(() => {
			if (!inputElement) return;
			for (const [key, value] of Object.entries(properties)) {
				switch (typeof value) {
					case 'boolean':
					case 'undefined':
						if (value) {
							inputElement.setAttribute(key, '');
						} else {
							inputElement.removeAttribute(key);
						}
						continue;

					default:
						inputElement.setAttribute(key, value.toString());
						continue;
				}
			}
		})();
</script>

<input
	bind:this={inputElement}
	{type}
	class="clui-input"
	class:borderless
	style:resize
	style:width={sizeToCSS(width)}
	style:height={sizeToCSS(height)}
	style:padding={sizeToCSS(padding)}
	style:border-radius={roundnessToCSS(roundness)}
	style:transform
	readonly={readOnly}
	disabled={readOnly}
/>

<style>
	.clui-input {
		box-sizing: border-box;
		overflow: auto;
		border: none;
		background-color: transparent;
		color: currentColor;
	}
	.clui-input:not(.borderless) {
		border-width: 1px;
		border-style: solid;
		border-color: var(--base-7);
		background-color: var(--base-2);
		color: var(--base-12);
	}
	.clui-input:not(.borderless):hover {
		border-color: var(--base-8);
	}

	.clui-input:focus {
		outline: none;
	}
	.clui-input:focus:not(.borderless) {
		outline-width: 2px;
		outline-style: solid;
		outline-color: var(--accent-8);
		border-color: var(--base-2);
	}
</style>
