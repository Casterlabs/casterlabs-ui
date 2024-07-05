<script context="module" lang="ts">
	export type StandardInputProps = {
		borderless?: boolean;
		readOnly?: boolean;
		resize?: ResizeProperty;
		width?: SizeProperty;
		height?: SizeProperty;
		padding?: SizeProperty;
		roundness?: RoundnessProperty;
		transform?: string;
	};
</script>

<script lang="ts">
	import { roundnessToCSS, sizeToCSS } from '$lib/helper.js';
	import type { ResizeProperty, RoundnessProperty, SizeProperty } from '$lib/helper.js';

	interface $$Props extends StandardInputProps {
		// We now have to manually specify our own props. That's what we get :P
		inputElement: HTMLInputElement | null;
		type: string;
		properties?: { [key: string]: any };
		hasLabel?: boolean;
	}

	export const ID = `clui-input-${Math.random().toString(28).substring('.0'.length)}`;

	export let inputElement: HTMLInputElement | null = null;
	export let type: string = 'input';
	export let properties: { [key: string]: any } = {};
	export let hasLabel = false;

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

{#if hasLabel}
	<div class="clui-input-label-container">
		<label for={ID} class="clui-input-label">
			<slot name="label" />
		</label>
		<input
			id={ID}
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
	</div>
{:else}
	<input
		id={ID}
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
{/if}

<style>
	.clui-input-label-container {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.clui-input-label {
		vertical-align: middle;
	}

	.clui-input {
		box-sizing: border-box;
		overflow: auto;
		border: none;
		background-color: transparent;
		color: currentColor;
		vertical-align: middle;
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
