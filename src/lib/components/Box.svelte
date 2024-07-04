<script lang="ts">
	import { roundnessToCSS, sizeToCSS } from '$lib/helper.js';
	import type { ResizeProperty, RoundnessProperty, SizeProperty } from '$lib/helper.js';

	export let borderless = false;
	export let resize: ResizeProperty = 'none';
	export let width: SizeProperty = 'full';
	export let height: SizeProperty = 'fit';
	export let roundness: RoundnessProperty = 'none';
	export let transform = '';
</script>

<div
	class="clui-box"
	class:borderless
	style:resize
	style:width={sizeToCSS(width)}
	style:height={sizeToCSS(height)}
	style:border-radius={roundnessToCSS(roundness)}
	style:transform
>
	<slot />
</div>

<style>
	.clui-box {
		overflow: auto;
	}
	.clui-box:not(.borderless) {
		border-width: 1px;
		border-style: solid;
		border-color: var(--base-6);
		background-color: var(--base-2);
	}
</style>
