<script lang="ts" module>
	export interface VirtualSelectOption {
		value: any;
		label: string;
		/** Prevents the option from being selected. */
		disabled?: boolean;
		/** Extra CSS classes applied to the option element. */
		class?: string;
		/** Inline styles applied to the option element. */
		style?: string;
	}

	interface Props {
		/**
		 * Removes the borders from the element. This has the side effect of also making the element
		 * transparent and also removes the outline when focused/active.
		 */
		borderless?: boolean;

		disabled?: boolean;

		placeholder?: string;
		options: VirtualSelectOption[];
		value?: any;
		/** Sets the element's id, also used as a base for internal ARIA relationship ids. */
		id?: string;
		name?: string;
		class?: string;
		style?: string;

		/** Extra CSS classes applied to the dropdown panel. */
		listClass?: string;
		/** Inline styles applied to the dropdown panel. */
		listStyle?: string;

		'aria-label'?: string;
		'aria-labelledby'?: string;
		onchange?: (value: any) => void;
	}
</script>

<script lang="ts">
	let {
		borderless,
		disabled,
		placeholder = '',
		options,
		value = $bindable(),
		id,
		name,
		class: className,
		style,
		listClass,
		listStyle,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledby,
		onchange
	}: Props = $props();

	// Stable unique IDs scoped to this instance for ARIA relationships.
	const _uid = `clui-select-${Math.random().toString(36).slice(2, 9)}`;
	const triggerId = $derived(id ?? _uid);
	const listboxId = `${_uid}-listbox`;
	const optId = (i: number) => `${_uid}-opt-${i}`;

	// -------------------------------------------------------------------------
	// State
	// -------------------------------------------------------------------------

	let isOpen = $state(false);
	let highlightedIndex = $state(-1);
	let triggerEl: HTMLButtonElement;
	let listboxEl = $state<HTMLDivElement | undefined>(undefined);

	// Panel geometry (fixed-position coordinates)
	let panelTop = $state(0);
	let panelLeft = $state(0);
	let panelWidth = $state(0);
	let panelMaxHeight = $state(300);

	// -------------------------------------------------------------------------
	// Derived
	// -------------------------------------------------------------------------

	const selectedOption = $derived(options.find((o) => o.value === value) ?? null);
	const displayLabel = $derived(selectedOption?.label ?? placeholder);
	const activeDescendant = $derived(
		isOpen && highlightedIndex >= 0 ? optId(highlightedIndex) : undefined
	);

	// -------------------------------------------------------------------------
	// Positioning
	// -------------------------------------------------------------------------

	const GAP = 4; // px gap between trigger bottom/top and panel
	const MAX_H = 300; // max panel height before scrolling

	function computePosition() {
		if (!triggerEl) return;
		const r = triggerEl.getBoundingClientRect();
		const below = window.innerHeight - r.bottom - GAP;
		const above = r.top - GAP;

		panelLeft = r.left;
		panelWidth = r.width;

		if (below >= 80 || below >= above) {
			// Open below
			panelTop = r.bottom + GAP;
			panelMaxHeight = Math.min(MAX_H, Math.max(80, below));
		} else {
			// Flip above
			panelMaxHeight = Math.min(MAX_H, Math.max(80, above));
			panelTop = r.top - GAP - panelMaxHeight;
		}
	}

	// -------------------------------------------------------------------------
	// Open / Close
	// -------------------------------------------------------------------------

	function openDropdown() {
		if (disabled) return;
		const sel = options.findIndex((o) => o.value === value);
		highlightedIndex =
			sel >= 0 && !options[sel].disabled ? sel : options.findIndex((o) => !o.disabled);
		isOpen = true;
		computePosition();
	}

	function closeDropdown(returnFocus = true) {
		isOpen = false;
		highlightedIndex = -1;
		if (returnFocus) triggerEl?.focus();
	}

	function commitOption(opt: VirtualSelectOption) {
		if (opt.disabled) return;
		const prev = value;
		value = opt.value;
		if (prev !== value) onchange?.(value);
		closeDropdown();
	}

	// -------------------------------------------------------------------------
	// Navigation helpers
	// -------------------------------------------------------------------------

	function nextEnabled(from: number) {
		for (let i = 1; i <= options.length; i++) {
			const idx = (from + i) % options.length;
			if (!options[idx].disabled) return idx;
		}
		return from;
	}

	function prevEnabled(from: number) {
		const start = from < 0 ? options.length : from;
		for (let i = 1; i <= options.length; i++) {
			const idx = (start - i + options.length) % options.length;
			if (!options[idx].disabled) return idx;
		}
		return from;
	}

	function firstEnabled() {
		return options.findIndex((o) => !o.disabled);
	}

	function lastEnabled() {
		for (let i = options.length - 1; i >= 0; i--) {
			if (!options[i].disabled) return i;
		}
		return -1;
	}

	// -------------------------------------------------------------------------
	// Type-ahead
	// -------------------------------------------------------------------------

	let typeBuffer = '';
	let typeTimer = 0;

	function doTypeahead(char: string) {
		clearTimeout(typeTimer);
		typeBuffer += char.toLowerCase();

		// Search starting after the current highlight, wrapping around.
		const start = highlightedIndex >= 0 ? highlightedIndex + 1 : 0;
		const wrapped = [...options.slice(start), ...options.slice(0, start)];
		const hit = wrapped.findIndex(
			(o) => !o.disabled && o.label.toLowerCase().startsWith(typeBuffer)
		);

		if (hit >= 0) highlightedIndex = (start + hit) % options.length;

		typeTimer = window.setTimeout(() => {
			typeBuffer = '';
		}, 500);
	}

	// -------------------------------------------------------------------------
	// Keyboard handler
	// -------------------------------------------------------------------------

	function onKeydown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				if (!isOpen) openDropdown();
				else highlightedIndex = nextEnabled(highlightedIndex);
				break;

			case 'ArrowUp':
				e.preventDefault();
				if (!isOpen) {
					openDropdown();
					highlightedIndex = lastEnabled();
				} else {
					highlightedIndex = prevEnabled(highlightedIndex);
				}
				break;

			case 'Enter':
			case ' ':
				e.preventDefault();
				if (!isOpen) openDropdown();
				else if (highlightedIndex >= 0) commitOption(options[highlightedIndex]);
				break;

			case 'Escape':
				e.preventDefault();
				if (isOpen) closeDropdown();
				break;

			case 'Tab':
				if (isOpen) closeDropdown(false);
				break;

			case 'Home':
				if (isOpen) {
					e.preventDefault();
					const first = firstEnabled();
					if (first >= 0) highlightedIndex = first;
				}
				break;

			case 'End':
				if (isOpen) {
					e.preventDefault();
					const last = lastEnabled();
					if (last >= 0) highlightedIndex = last;
				}
				break;

			default:
				if (isOpen && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
					doTypeahead(e.key);
				}
		}
	}

	// -------------------------------------------------------------------------
	// Effects
	// -------------------------------------------------------------------------

	// Scroll the highlighted option into view whenever it changes while open.
	$effect(() => {
		if (!isOpen || highlightedIndex < 0) return;
		// Use rAF to ensure the DOM has updated and the listbox is bound.
		requestAnimationFrame(() => {
			const item = listboxEl?.querySelector<HTMLElement>(`[data-index="${highlightedIndex}"]`);
			item?.scrollIntoView({ block: 'nearest' });
		});
	});

	// Recompute fixed-position coordinates on scroll / resize while open.
	$effect(() => {
		if (!isOpen) return;
		const recompute = () => computePosition();
		window.addEventListener('scroll', recompute, { passive: true, capture: true });
		window.addEventListener('resize', recompute, { passive: true });
		return () => {
			window.removeEventListener('scroll', recompute, { capture: true });
			window.removeEventListener('resize', recompute);
		};
	});

	// Close on pointer-down outside both the trigger and the panel.
	$effect(() => {
		if (!isOpen) return;
		function onPointerDown(e: PointerEvent) {
			const t = e.target as Node;
			if (!triggerEl?.contains(t) && !listboxEl?.contains(t)) {
				closeDropdown(false);
			}
		}
		document.addEventListener('pointerdown', onPointerDown);
		return () => document.removeEventListener('pointerdown', onPointerDown);
	});

	// -------------------------------------------------------------------------
	// Portal action — moves the node to document.body so it is never clipped
	// by an overflow:hidden ancestor.
	// -------------------------------------------------------------------------

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				node.remove();
			}
		};
	}
</script>

<!-- Trigger -->
<button
	bind:this={triggerEl}
	type="button"
	role="combobox"
	aria-haspopup="listbox"
	aria-expanded={isOpen}
	aria-controls={listboxId}
	aria-activedescendant={activeDescendant}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabelledby}
	id={triggerId}
	{disabled}
	class="clui-select {className ?? ''}"
	class:borderless
	{style}
	onclick={() => (isOpen ? closeDropdown() : openDropdown())}
	onkeydown={onKeydown}
>
	<span class="clui-select-value" class:placeholder={!selectedOption}>{displayLabel}</span>
	<span class="clui-select-chevron" class:open={isOpen} aria-hidden="true"></span>
</button>

<!-- Hidden form input for native form submission support -->
{#if name}
	<input type="hidden" {name} value={value ?? ''} />
{/if}

<!-- Dropdown panel (portaled to document.body, positioned via fixed coords) -->
{#if isOpen}
	<div
		use:portal
		bind:this={listboxEl}
		id={listboxId}
		role="listbox"
		tabindex="-1"
		aria-label={ariaLabel}
		aria-labelledby={ariaLabelledby ?? (ariaLabel ? undefined : triggerId)}
		class="clui-select-listbox {listClass ?? ''}"
		style="position: fixed; top: {panelTop}px; left: {panelLeft}px; min-width: {panelWidth}px; width: fit-content; max-width: calc(100vw - {panelLeft}px - 8px); max-height: {panelMaxHeight}px; {listStyle ??
			''}"
	>
		{#each options as option, i}
			<div
				id={optId(i)}
				role="option"
				aria-selected={option.value === value}
				aria-disabled={option.disabled ?? false}
				data-index={i}
				class="clui-select-option {option.class ?? ''}"
				class:highlighted={i === highlightedIndex}
				class:selected={option.value === value}
				class:disabled={option.disabled}
				style={option.style}
				onpointerdown={(e) => {
					// Prevent the trigger from losing focus so keyboard navigation stays active.
					e.preventDefault();
					commitOption(option);
				}}
				onpointermove={() => {
					if (!option.disabled) highlightedIndex = i;
				}}
			>
				{option.label}
			</div>
		{/each}
	</div>
{/if}

<style>
	/* =========================================================================
	   Trigger
	   ========================================================================= */

	button.clui-select {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: var(--clui-padding);
		border-radius: var(--clui-radius, 0);
		border: 0.0625rem solid transparent;
		background-color: transparent;
		color: currentColor;
		font-size: 0.8rem;
		font-family: inherit;
		text-align: left;
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		appearance: none;
		-webkit-appearance: none;
		box-sizing: border-box;
	}

	button.clui-select:not(.borderless) {
		border-color: var(--clui-color-base-7);
		background-color: var(--clui-color-base-3);
		color: var(--clui-color-base-12);
	}

	button.clui-select:disabled {
		cursor: not-allowed;
		color: var(--clui-color-base-11);
	}

	button.clui-select:not(.borderless):not(:disabled):hover {
		border-color: var(--clui-color-base-8);
	}

	button.clui-select:not(.borderless):focus-visible {
		outline: 0.125rem solid var(--clui-color-accent-8);
		outline-offset: 0;
		border-color: var(--clui-color-base-2);
	}

	button.clui-select.borderless:focus-visible {
		outline: none;
	}

	/* -------------------------------------------------------------------------
	   Value label
	   ------------------------------------------------------------------------- */

	.clui-select-value {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	button.clui-select:not(.borderless) .clui-select-value.placeholder {
		color: var(--clui-color-base-11);
	}

	button.clui-select.borderless .clui-select-value.placeholder {
		opacity: 0.5;
	}

	/* -------------------------------------------------------------------------
	   Chevron
	   ------------------------------------------------------------------------- */

	.clui-select-chevron {
		display: inline-block;
		flex-shrink: 0;
		width: 0.3rem;
		height: 0.3rem;
		border-right: 0.125rem solid currentColor;
		border-bottom: 0.125rem solid currentColor;
		transform: translateY(-25%) rotate(45deg);
		/* transition: transform 150ms ease; */
	}

	.clui-select-chevron.open {
		transform: translateY(25%) rotate(-135deg);
	}

	/* =========================================================================
	   Dropdown panel + options
	   These elements are portaled to document.body and therefore require
	   :global() to escape Svelte's scoped CSS.
	   ========================================================================= */

	:global(.clui-select-listbox) {
		overflow-y: auto;
		z-index: var(--clui-z-index-popup, 9999);
		box-sizing: border-box;
		font-size: 0.8rem;
		color: var(--clui-color-base-12);
		background-color: var(--clui-color-base-3);
		border: 0.0625rem solid var(--clui-color-base-7);
		border-radius: var(--clui-radius, 0);
		box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.25);
	}

	:global(.clui-select-option) {
		padding: var(--clui-padding);
		cursor: pointer;
		user-select: none;
		-webkit-user-select: none;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		box-sizing: border-box;
	}

	:global(.clui-select-option.highlighted) {
		background-color: var(--clui-color-base-4);
	}

	:global(.clui-select-option.selected) {
		background-color: var(--clui-color-base-5);
		color: var(--clui-color-accent-11);
	}

	:global(.clui-select-option.selected.highlighted) {
		background-color: var(--clui-color-base-4);
	}

	:global(.clui-select-option.disabled) {
		color: var(--clui-color-base-11);
		cursor: not-allowed;
		pointer-events: none;
	}
</style>
