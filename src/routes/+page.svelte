<script lang="ts">
	import { Box, Button, Divider, Input, InvertedScroller, DynamicList } from '$lib/index.js';

	const SCROLL_ITEMS = 1000;

	let numberInputValue = 0;
	let numberInputStep = 1;
	let numberInputMin = 0;
	let numberInputMax = 100;

	let textInputValue = '';

	let checkboxInputValue = false;

	let isScrollerAtBottom = true;
	let scroller: InvertedScroller;

	let dynamicListBleed = 300;
	let dynamicList1: DynamicList;
	let dynamicList2: DynamicList;
</script>

<h1>Casterlabs UI Test Page</h1>

Page Zoom:
<Input
	type="number"
	step={1}
	min={0}
	placeholder="16"
	borderless
	style="width: 8ch;"
	oninput={(e: Event) => {
		// @ts-ignore
		const newValue = e.target.value ?? 16;
		document.documentElement.style.fontSize = newValue + 'px';
	}}
/>
Roundness:
<Input
	type="number"
	step={1}
	min={0}
	placeholder="0"
	borderless
	style="width: 8ch;"
	oninput={(e: Event) => {
		// @ts-ignore
		const newValue = e.target.value ?? 4;
		// @ts-ignore
		document.documentElement.style.setProperty('--clui-radius', newValue + 'px');
	}}
/>

<h2>Number Input</h2>

<Input
	type="number"
	bind:value={numberInputValue}
	step={numberInputStep}
	min={numberInputMin}
	max={numberInputMax}
	placeholder="Borderless"
	borderless
/>
<Input
	type="number"
	bind:value={numberInputValue}
	step={numberInputStep}
	min={numberInputMin}
	max={numberInputMax}
	placeholder="Regular"
/>
<Input
	type="number"
	bind:value={numberInputValue}
	step={numberInputStep}
	min={numberInputMin}
	max={numberInputMax}
	placeholder="Readonly"
	readonly
/>
<Input
	type="number"
	bind:value={numberInputValue}
	step={numberInputStep}
	min={numberInputMin}
	max={numberInputMax}
	placeholder="Disabled"
	disabled
/>

<h2>Range Input</h2>

<Input
	type="range"
	bind:value={numberInputValue}
	step={numberInputStep}
	min={numberInputMin}
	max={numberInputMax}
/>

<Input
	type="range"
	bind:value={numberInputValue}
	step={numberInputStep}
	min={numberInputMin}
	max={numberInputMax}
	borderless
/>

<Input
	type="range"
	bind:value={numberInputValue}
	step={numberInputStep}
	min={numberInputMin}
	max={numberInputMax}
	disabled
/>

<h2>Text Input</h2>

<Input type="text" bind:value={textInputValue} placeholder="Borderless" borderless />
<Input type="text" bind:value={textInputValue} placeholder="Regular" />
<Input type="text" bind:value={textInputValue} placeholder="Readonly" readonly />
<Input type="text" bind:value={textInputValue} placeholder="Disabled" disabled />

<h2>Checkbox</h2>

<Input type="checkbox" bind:checked={checkboxInputValue} />
<Input type="checkbox" bind:checked={checkboxInputValue} disabled />

<h2>Button</h2>

<Button onclick={() => alert('Clicked!')} borderless>Borderless</Button>
<Button onclick={() => alert('Clicked!')}>Regular</Button>
<Button onclick={() => alert('Clicked!')} disabled>Disabled</Button>

<h2>Box</h2>

<Box sides={['top', 'bottom', 'left', 'right']}>I'm a box!</Box>
<br />
<Box resize="both" style="overflow: hidden;" sides={['top', 'bottom', 'left', 'right']}>
	I'm a <i>resizable</i> box!
</Box>

<h2>Divider</h2>

Horizontal:
<Divider direction="horizontal" />
<br />
Vertical:
<Divider direction="vertical" size="3rem" />

<h2>Inverted Scroller</h2>

Is at bottom?
<b>{isScrollerAtBottom ? 'Yes' : 'No'}</b>
{#if !isScrollerAtBottom}
	<Button onclick={() => scroller.jumpToBottom()}>Jump</Button>
{/if}

<br />
<br />

<div style="display: flex; flex-direction: row; width: 100%; height: 10rem;">
	<Box style="flex: 1; height: 100%; padding: 0;" sides={['top', 'bottom', 'left', 'right']}>
		<InvertedScroller bind:this={scroller} bind:isAtBottom={isScrollerAtBottom}>
			<ul>
				<li><b>(end of list)</b></li>
				{#each Array(SCROLL_ITEMS) as _, idx}
					<li>Item {idx + 1}</li>
				{/each}
				<li><b>This is an InvertedScroller (in a Box)</b></li>
			</ul>
		</InvertedScroller>
	</Box>
	<Box
		style="flex: 1; height: 100%; padding: 0; overflow-y: auto;"
		sides={['top', 'bottom', 'right']}
	>
		<ul>
			<li><b>This is a regular scrollable div (in a Box)</b></li>
			{#each Array(SCROLL_ITEMS) as _, idx}
				<li>Item {idx + 1}</li>
			{/each}
			<li><b>(end of list)</b></li>
		</ul>
	</Box>
</div>

<h2>Dynamic List</h2>

<p>
	This element unmounts the given snippet if the item isn't visible in the viewport and remounts it
	when it becomes visible. This is useful for heavy list-based UIs that have a lot of items. You can
	pass it either a Component to mount or a snippet (which gets wrapped and mounted).

	<br />
	<br />

	The bleed value determines how far an element has to be outside of the view area before it gets
	unmounted (specified in % of viewarea height). Higher values allow you to have a seamless
	experience when scrolling at the cost of additional DOM elements.
</p>

<p>
	Bleed: <Input
		type="number"
		bind:value={dynamicListBleed}
		step={10}
		min={0}
		placeholder="Bleed"
		style="width: calc(0.85ch * {dynamicListBleed.toString()
			.length} + .25rem); appearance: textfield;"
	/>%
	<Button
		onclick={() => {
			dynamicList1.jumpToStart();
			dynamicList2.jumpToStart();
		}}
	>
		Jump to start
	</Button>
</p>

<div style="display: flex; flex-direction: row; width: 100%; height: 10rem;">
	{#key dynamicListBleed}
		<Box style="flex: 1; height: 100%; padding: 0;" sides={['top', 'bottom', 'left', 'right']}>
			<DynamicList
				bind:this={dynamicList1}
				startWith={['This is an regular DynamicList (in a Box)', ...Array(1_000).keys()]}
				bleed={dynamicListBleed / 100}
			>
				{#snippet itemRenderer(item: number | string)}
					{#if typeof item == 'number'}
						This is item #{item}
					{:else}
						<b>{item}</b>
					{/if}
				{/snippet}
			</DynamicList>
		</Box>
		<Box
			style="flex: 1; height: 100%; padding: 0; overflow-y: auto;"
			sides={['top', 'bottom', 'right']}
		>
			<DynamicList
				bind:this={dynamicList2}
				inverted
				startWith={[...Array(1_000).keys(), 'This is an inverted DynamicList (in a Box)']}
				bleed={dynamicListBleed / 100}
			>
				{#snippet itemRenderer(item: number | string)}
					{#if typeof item == 'number'}
						This is item #{item}
					{:else}
						<b>{item}</b>
					{/if}
				{/snippet}
			</DynamicList>
		</Box>
	{/key}
</div>
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

<style>
	h2 {
		margin-top: 4rem;
	}
</style>
