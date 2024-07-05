<script lang="ts">
	import NumberInput from './NumberInput.svelte';
	import InternalInput, { type StandardInputProps } from './_InternalInput.svelte';

	interface $$Props extends StandardInputProps {
		// We now have to manually specify our own props. That's what we get :P
		value?: number;
		min?: number;
		max?: number;
		step?: number;
	}

	import { sizeToCSS } from '$lib/helper.js';
	import { onMount, createEventDispatcher } from 'svelte';
	import Debouncer from '$lib/debouncer.js';
	import RangeInput from './RangeInput.svelte';

	const dispatch = createEventDispatcher();
	const debouncer = new Debouncer();

	export let value = 0;
	export let min = NaN;
	export let max = NaN;
	export let step = 1;
	min && max && step; // Silence typescript.

	export let ID: string = '';
</script>

<!-- I hate having to repeat myself like this. Oh well. -->
{#if $$slots.label}
	<div class="clui-input-label-container">
		<label for={ID} class="clui-input-label">
			<slot name="label" />
		</label>

		<div class="clui-input-range-container" style:width={sizeToCSS($$restProps.width)}>
			<div class="clui-input-range-sister" style:padding={sizeToCSS($$restProps.padding || 0.5)}>
				<!-- Note that this is the REAL input element for screen readers! -->
				<NumberInput
					bind:ID
					bind:value
					{...$$restProps}
					width="full"
					borderless={true}
					padding={0}
					on:update={(v) => dispatch('update', v)}
					on:update-debounced={(v) => dispatch('update-debounced', v)}
					on:update-unfocused={(v) => dispatch('update-unfocused', v)}
				/>

				<div class="clui-input-range-sister-dummy" aria-hidden="true">
					<!-- We use this as a calculation for the width of this part. -->
					{value}
				</div>
			</div>

			{#if $$slots.unit}
				<div class="clui-input-range-unit" style="padding-right: 4px;">
					<span style="font-size: .85em;">
						<slot name="unit" />
					</span>
				</div>
			{/if}

			<div aria-hidden="true" style:display="content">
				<RangeInput
					bind:value
					borderless={true}
					{...$$restProps}
					width="full"
					on:update={(v) => dispatch('update', v)}
					on:update-debounced={(v) => dispatch('update-debounced', v)}
					on:update-unfocused={(v) => dispatch('update-unfocused', v)}
				/>
			</div>
		</div>
	</div>
{:else}
	<div class="clui-input-range-container" style:width={sizeToCSS($$restProps.width)}>
		<div class="clui-input-range-sister" style:padding={sizeToCSS($$restProps.padding || 0.5)}>
			<!-- Note that this is the REAL input element for screen readers! -->
			<NumberInput
				bind:ID
				bind:value
				{...$$restProps}
				width="full"
				borderless={true}
				padding={0}
				on:update={(v) => dispatch('update', v)}
				on:update-debounced={(v) => dispatch('update-debounced', v)}
				on:update-unfocused={(v) => dispatch('update-unfocused', v)}
			/>

			<div class="clui-input-range-sister-dummy" aria-hidden="true">
				<!-- We use this as a calculation for the width of this part. -->
				{value}
			</div>
		</div>

		{#if $$slots.unit}
			<div class="clui-input-range-unit" style="padding-right: 4px;">
				<span style="font-size: .85em;">
					<slot name="unit" />
				</span>
			</div>
		{/if}

		<div aria-hidden="true" style:display="content">
			<RangeInput
				bind:value
				borderless={true}
				{...$$restProps}
				width="full"
				on:update={(v) => dispatch('update', v)}
				on:update-debounced={(v) => dispatch('update-debounced', v)}
				on:update-unfocused={(v) => dispatch('update-unfocused', v)}
			/>
		</div>
	</div>
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
	.clui-input-range-unit {
		padding-top: 0.15em;
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
</style>
