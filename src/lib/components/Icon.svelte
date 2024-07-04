<script lang="ts">
	import { sizeToCSS } from '$lib/helper.js';
	import type { ColorProperty, SizeProperty } from '$lib/helper.js';
	import { lookupIcon } from '$lib/icons.js';

	/**
	 * In the format: providerName/iconName
	 */
	export let icon = '';
	export let size: SizeProperty = 5;
	export let transform = '';
	export let color: ColorProperty = 'base-12';

	$: [providerName, iconName] = icon.split('/');
</script>

<span
	style:display="inline-block"
	style:vertical-align="bottom"
	style:width={sizeToCSS(size)}
	style:height={sizeToCSS(size)}
	style:color="var(--{color})"
	style:transform
>
	{#key providerName}
		{#key iconName}
			{#await lookupIcon(providerName, iconName) then html}
				{@html html}
			{/await}
		{/key}
	{/key}
</span>
