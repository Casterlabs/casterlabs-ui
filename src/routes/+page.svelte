<script lang="ts">
	import {
		Box,
		Button,
		Divider,
		DynamicList,
		FocusTrap,
		Input,
		InvertedScroller,
		LongPressListener,
		VirtualSelect,
		type VirtualSelectOption
	} from '$lib/index.js';

	import NativeSelect from '$lib/components/NativeSelect.svelte';
	import TextArea from '$lib/components/TextArea.svelte';

	const SCROLL_ITEMS = 1000;

	const SELECT_OPTIONS: VirtualSelectOption[] = [
		{ value: 1, label: 'Option 1' },
		{ value: 2, label: 'Option 2' },
		{ value: 3, label: 'Option 3' },
		{ value: 4, label: 'Option 4 (disabled)', disabled: true },
		{ value: 5, label: 'Option 5 (styled)', style: 'color: salmon;' }
	];

	let pageZoom = $state(16);
	let roundness = $state(2);
	let padding = $state(2);

	$effect(() => {
		document.documentElement.style.fontSize = pageZoom + 'px';
		document.documentElement.style.setProperty('--clui-radius', roundness + 'px');
		document.documentElement.style.setProperty('--clui-padding', padding + 'px');
	});

	let numberInputValue = $state(0);
	let numberInputStep = 1;
	let numberInputMin = 0;
	let numberInputMax = 100;

	let textInputValue = $state('');

	let selectValue = $state('');

	let checkboxInputValue = $state(false);

	let isScrollerAtBottom = $state(true);
	let scroller: InvertedScroller;

	let dynamicList1: DynamicList;
	let dynamicList2: DynamicList;

	let focusTrapHasFocus: boolean = $state(false);
</script>

{#snippet itemRenderer(item: number | string)}
	{#if typeof item == 'number'}
		This is item #{item + 1}
	{:else}
		<b>{item}</b>
	{/if}
{/snippet}

<h1>Casterlabs UI Test Page</h1>

Page Zoom:
<Input
	type="number"
	step={1}
	min={0}
	placeholder="16"
	borderless
	style="width: 8ch;"
	bind:value={pageZoom}
/>
Roundness:
<Input
	type="number"
	step={1}
	min={0}
	placeholder="0"
	borderless
	style="width: 8ch;"
	bind:value={roundness}
/>
Padding:
<Input
	type="number"
	step={0.5}
	min={0}
	placeholder="0"
	borderless
	style="width: 8ch;"
	bind:value={padding}
/>

<h2>Number Input</h2>

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
	placeholder="Borderless"
	borderless
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

<h2>Text Input</h2>

<Input type="text" bind:value={textInputValue} placeholder="Regular" />
<Input type="text" bind:value={textInputValue} placeholder="Borderless" borderless />
<Input type="text" bind:value={textInputValue} placeholder="Readonly" readonly />
<Input type="text" bind:value={textInputValue} placeholder="Disabled" disabled />

<h2>Text Area</h2>

<TextArea bind:value={textInputValue} placeholder="Regular" />
<TextArea bind:value={textInputValue} placeholder="Borderless" borderless />
<TextArea bind:value={textInputValue} placeholder="Readonly" readonly />
<TextArea bind:value={textInputValue} placeholder="Disabled" disabled />

<h2>Native Select</h2>

<NativeSelect bind:value={selectValue}>
	<option value="" disabled selected>Regular</option>

	{#each SELECT_OPTIONS as option}
		<option value={option.value} disabled={option.disabled} style={option.style}>
			{option.label}
		</option>
	{/each}
</NativeSelect>

<NativeSelect borderless bind:value={selectValue}>
	<option value="" disabled selected>Borderless</option>

	{#each SELECT_OPTIONS as option}
		<option value={option.value} disabled={option.disabled} style={option.style}>
			{option.label}
		</option>
	{/each}
</NativeSelect>

<NativeSelect disabled bind:value={selectValue}>
	<option value="" disabled selected>Disabled</option>

	{#each SELECT_OPTIONS as option}
		<option value={option.value} disabled={option.disabled} style={option.style}>
			{option.label}
		</option>
	{/each}
</NativeSelect>

<h2>Virtual Select</h2>

<VirtualSelect placeholder="Regular" options={SELECT_OPTIONS} bind:value={selectValue} />

<VirtualSelect
	borderless
	placeholder="Borderless"
	options={SELECT_OPTIONS}
	bind:value={selectValue}
/>

<VirtualSelect disabled placeholder="Disabled" options={SELECT_OPTIONS} />

<h2>Button</h2>

<Button onclick={() => alert('Clicked!')}>Regular</Button>
<Button onclick={() => alert('Clicked!')} borderless>Borderless</Button>
<Button onclick={() => alert('Clicked!')} disabled>Disabled</Button>

<h2>Checkbox</h2>

<Input type="checkbox" bind:checked={checkboxInputValue} />
<Input type="checkbox" bind:checked={checkboxInputValue} disabled />

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
	disabled
/>

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
				{#each ['(start of list)', ...Array(SCROLL_ITEMS).keys(), 'This is an InvertedScroller (in a Box)'] as item}
					<li>{@render itemRenderer(item)}</li>
				{/each}
			</ul>
		</InvertedScroller>
	</Box>
	<Box
		style="flex: 1; height: 100%; padding: 0; overflow-y: auto;"
		sides={['top', 'bottom', 'right']}
	>
		<ul>
			{#each ['This is a regular scrollable div (in a Box)', ...Array(SCROLL_ITEMS).keys(), '(end of list)'] as item}
				<li>{@render itemRenderer(item)}</li>
			{/each}
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
	Bleed: 300%
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
	<Box style="flex: 1; height: 100%; padding: 0;" sides={['top', 'bottom', 'left', 'right']}>
		<DynamicList
			bind:this={dynamicList1}
			startWith={[
				'This is an regular DynamicList (in a Box)',
				...Array(SCROLL_ITEMS).keys(),
				'(end of list)'
			]}
			bleed={3}
			{itemRenderer}
		>
			<!-- 
				You can also:
					{#snippet itemRenderer(item: any)}
						...
					{/snippet} 
				-->
		</DynamicList>
	</Box>
	<Box
		style="flex: 1; height: 100%; padding: 0; overflow-y: auto;"
		sides={['top', 'bottom', 'right']}
	>
		<DynamicList
			bind:this={dynamicList2}
			inverted
			startWith={[
				'(start of list)',
				...Array(SCROLL_ITEMS).keys(),
				'This is an inverted DynamicList (in a Box)'
			]}
			bleed={3}
			{itemRenderer}
		/>
	</Box>
</div>

<h2>FocusTrap</h2>

Has focus?
<b>{focusTrapHasFocus ? 'Yes' : 'No'}</b>

<FocusTrap bind:focused={focusTrapHasFocus}>
	<Box sides={['top', 'bottom', 'left', 'right']}>
		<p>When you click in this box, it gains focus. When you click out, it loses focus.</p>
		<!-- <Input type="text" bind:value={textInputValue} placeholder="Some focusable input" /> -->
	</Box>
</FocusTrap>

<h2>LongPressListener (for mobile)</h2>

<LongPressListener
	onlongpress={() => {
		alert('Long pressed!');
	}}
>
	<p style="user-select: none; -webkit-user-select: none;">Hold your finger on me!</p>
</LongPressListener>

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
		margin-top: 1rem;
	}
</style>
