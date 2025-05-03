<script lang="ts">
	import { Box, Button, Divider, Input, InvertedScroller } from '$lib/index.js';

	let numberInputValue = 0;
	let numberInputStep = 1;
	let numberInputMin = 0;
	let numberInputMax = 100;

	let textInputValue = '';

	let checkboxInputValue = false;

	let isScrollerAtBottom = true;
	let scroller: InvertedScroller;
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
	oninput={(e) => {
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
	oninput={(e) => {
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

<Box style="height: 5rem; padding: 0;" sides={['top', 'bottom', 'left', 'right']}>
	<InvertedScroller bind:this={scroller} bind:isAtBottom={isScrollerAtBottom}>
		<ul>
			<li>(end of list)</li>
			{#each Array(100) as _, idx}
				<li>Item {idx + 1}</li>
			{/each}
			<li>This is an inverted scroller (in a Box)</li>
		</ul>
	</InvertedScroller>
</Box>
<br />
<Box style="height: 5rem; padding: 0; overflow-y: auto;" sides={['top', 'bottom', 'left', 'right']}>
	<ul>
		<li>This is a regular scroller (in a Box)</li>
		{#each Array(100) as _, idx}
			<li>Item {idx + 1}</li>
		{/each}
		<li>(end of list)</li>
	</ul>
</Box>

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
