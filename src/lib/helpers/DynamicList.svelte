<script lang="ts" module>
	import type { Component, Snippet } from 'svelte';

	declare type ItemData = any;
	declare type ItemId = string;
	declare type ItemRenderer = Component<() => ItemData, any, any> | Snippet<[ItemData]>;
	declare type ItemIdGenerator = (data: ItemData) => ItemId;

	interface Props {
		/**
		 * An amount (in % of the viewarea's height) which will be used by the observer to determine which elements are visible.
		 * Basically, a higher value results in more items on the top and bottom that will be considered "visible".
		 * This is to make scrolling the list smoother as higher bleed values prevent elements from popping into existience.
		 */
		bleed?: number;

		inverted?: boolean;

		/**
		 * By default, this uses the identity of each Item. For complex types (e.g objects) you should use your own generator.
		 * Your supplied generator *should* return the same unique identifier for the same item ***IF*** you wish to be able to remove them later. Duplicate item ids will not be added.
		 */
		itemIdGenerator?: ItemIdGenerator;
		itemRenderer: ItemRenderer;
		startWith?: ItemData[];

		isAtStart?: boolean;
		scrollContainer?: HTMLElement;
	}
</script>

<script lang="ts">
	import invertedScroller from '$lib/actions/inverted-scroller.svelte.js';

	import { mount, onMount, unmount } from 'svelte';

	const ID_ATTR = 'data-clui-list-item-id';
	const IDENTITY: ItemIdGenerator = (data) => String(data);

	let {
		bleed = 0,

		inverted = false,

		itemIdGenerator = IDENTITY,
		itemRenderer,
		startWith,

		isAtStart = $bindable(true),
		scrollContainer = $bindable({} as HTMLElement)
	}: Props = $props();

	let observer: IntersectionObserver;

	let allItems: Record<ItemId, TrackedItem> = {};
	let visibleItems: Record<ItemId, TrackedItem> = {};
	let hiddenItems: Record<ItemId, TrackedItem> = {};

	class TrackedItem {
		public id: ItemId;

		public data: ItemData;
		private li: HTMLLIElement;
		private component?: Record<string, any>;

		constructor(li: HTMLLIElement, id: ItemId, data: ItemData) {
			this.id = id;
			this.data = data;

			this.li = li;
			this.li.setAttribute(ID_ATTR, this.id);

			allItems[this.id] = this;
		}

		public mount(intro?: boolean): void {
			if (this.component) {
				// console.debug(`[ListRenderer | ${this.id}]`, 'Element is already mounted!');
				return;
			}
			// console.debug(`[ListRenderer | ${this.id}]`, 'Mounting element.');

			visibleItems[this.id] = this;
			delete hiddenItems[this.id];

			this.li.style.height = 'fit-content';

			this.component = mount(itemRenderer, {
				target: this.li,
				props: () => this.data,
				intro: intro
			});
		}

		public unmount(height: number, outro?: boolean): void {
			if (!this.component) {
				// console.debug(`[ListRenderer | ${this.id}]`, "Element isn't mounted!");
				return;
			}
			// console.debug(`[ListRenderer | ${this.id}]`, 'Unmounting element.');

			delete visibleItems[this.id];
			hiddenItems[this.id] = this;

			this.li.style.height = height + 'px';

			unmount(this.component, {
				outro: outro
			});
			this.component = undefined;
		}

		public destroy() {
			observer.unobserve(this.li);
			this.unmount(0, true);
			this.li.remove();

			delete allItems[this.id];
			delete visibleItems[this.id];
			delete hiddenItems[this.id];
		}
	}

	onMount(() => {
		const callback: IntersectionObserverCallback = (entries) => {
			entries.forEach((entry) => {
				const id = (entry.target as HTMLLIElement).getAttribute(ID_ATTR) as string;
				const isVisible = entry.isIntersecting;

				if (isVisible) {
					const trackedItem = hiddenItems[id];
					if (!trackedItem) return; // Already mounted.

					trackedItem.mount();
				} else {
					const trackedItem = visibleItems[id];
					if (!trackedItem) return; // Already unmounted.

					const height = entry.boundingClientRect.height; // The height of the element when it is fully visible.
					trackedItem.unmount(height);
				}
			});
		};

		const bleedPercent = (bleed * 100).toFixed(2);
		observer = new IntersectionObserver(callback, {
			root: scrollContainer,
			rootMargin: `${bleedPercent}% 0px ${bleedPercent}% 0px`
		});

		startWith?.forEach(addItem);

		return () => {
			observer.disconnect();

			for (const item of Object.values(visibleItems)) {
				// console.debug("We're going away! Unmounting:", item.id);
				item.unmount(0);
			}
		};
	});

	export function jumpToStart(behavior: ScrollBehavior = 'smooth') {
		scrollContainer.scrollTo({
			top: 0, // When we're inverted, `top` becomes our bottom.
			behavior
		});
	}

	export function addItem(data: ItemData) {
		const id = itemIdGenerator(data);
		if (allItems[id]) return; // Already exists.

		const li = document.createElement('li');
		const tracked = new TrackedItem(li, id, data);

		if (inverted) {
			scrollContainer.insertBefore(li, scrollContainer.firstChild);
		} else {
			scrollContainer.appendChild(li);
		}

		tracked.mount(true);
		observer.observe(li);
	}

	export function removeItem(id: ItemId) {
		const tracked = allItems[id];
		tracked?.destroy();
	}
</script>

{#if inverted}
	<ul
		class="inverted-scroller"
		bind:this={scrollContainer}
		use:invertedScroller={(b) => {
			isAtStart = b;
		}}
	></ul>
{:else}
	<ul
		bind:this={scrollContainer}
		onscrollcapture={() => {
			isAtStart = scrollContainer.scrollTop == 0;
		}}
		class="regular-scroller"
	></ul>
{/if}

<style>
	ul {
		margin: 0;
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}

	:global(ul > li) {
		position: relative;
	}

	.inverted-scroller,
	:global(.inverted-scroller > li) {
		transform: scaleY(-1);
	}
</style>
