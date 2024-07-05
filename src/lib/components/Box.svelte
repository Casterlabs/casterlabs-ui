<script lang="ts">
	import { roundnessToCSS, sizeToCSS } from '$lib/helper.js';
	import type { ResizeProperty, RoundnessProperty, SizeProperty, VerticalAlignProperty } from '$lib/helper.js';

	export let borderless = false;
	export let resize: ResizeProperty = 'none';
	export let width: SizeProperty = 'full';
	export let height: SizeProperty = 'fit';
	export let padding: SizeProperty = 3;
	export let roundness: RoundnessProperty = 'none';
	export let transform = '';
	export let inline = false;
	export let verticalAlign: VerticalAlignProperty = 'bottom';
</script>

<div
	class="clui-box"
	class:borderless
	style:display={inline ? 'inline-block' : 'block'}
	style:resize
	style:width={sizeToCSS(width)}
	style:height={sizeToCSS(height)}
	style:padding={sizeToCSS(padding)}
	style:border-radius={roundnessToCSS(roundness)}
	style:transform
	style:vertical-align={verticalAlign}
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
