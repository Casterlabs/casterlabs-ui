<script lang="ts">
	import invertedScroller from '$lib/actions/inverted-scroller.svelte.js';
	import { type Id, NumericalIdGenerator } from '$lib/util/ids.js';

	import { type Component, type Snippet, mount, onMount, unmount } from 'svelte';

	const ID_ATTR = 'data-clui-list-item-id';
	const ID_GENERATOR = new NumericalIdGenerator();

	declare type ItemData = any;

	declare type ItemRenderer = Component<() => ItemData, any, any> | Snippet<[ItemData]>;

	interface Props {
		/**
		 * An amount (in % of the viewarea's height) which will be used by the observer to determine which elements are visible.
		 * Basically, a higher value results in more items on the top and bottom that will be considered "visible".
		 * This is to make scrolling the list smoother as higher bleed values prevent elements from popping into existience.
		 */
		bleed?: number;

		inverted?: boolean;

		startWith?: ItemData[];
		itemRenderer: ItemRenderer;

		isAtStart?: boolean;
	}

	let {
		bleed = 0,
		inverted = false,
		itemRenderer,
		startWith,
		isAtStart = $bindable(true)
	}: Props = $props();

	let scrollContainer: HTMLElement = $state({} as HTMLElement);
	let unorderedList: HTMLElement = $state({} as HTMLElement);
	let observer: IntersectionObserver;

	let allItems: Record<Id, TrackedItem> = {};
	let visibleItems: Record<Id, TrackedItem> = {};
	let hiddenItems: Record<Id, TrackedItem> = {};

	class TrackedItem {
		public id: Id;

		public data: ItemData;
		private li: HTMLLIElement;
		private component?: Record<string, any>;

		constructor(li: HTMLLIElement, data: ItemData) {
			this.id = ID_GENERATOR.generate();
			this.data = data;

			this.li = li;
			this.li.setAttribute(ID_ATTR, this.id);

			allItems[this.id] = this;
		}

		get mounted() {
			return this.component ? true : false;
		}

		public mount(intro?: boolean): void {
			if (this.component) {
				// console.debug(`[ListRenderer | ${this.id}]`, 'Element is already mounted!');
				return;
			}
			// console.debug(`[ListRenderer | ${this.id}]`, 'Mounting element.');

			visibleItems[this.id] = this;
			delete hiddenItems[this.id];

			this.li.style.height = 'auto';

			this.component = mount(itemRenderer, {
				target: this.li,
				props: () => this.data,
				intro: intro
			});
		}

		public unmount(height: number): void {
			if (!this.component) {
				// console.debug(`[ListRenderer | ${this.id}]`, "Element isn't mounted!");
				return;
			}
			// console.debug(`[ListRenderer | ${this.id}]`, 'Unmounting element.');

			delete visibleItems[this.id];
			hiddenItems[this.id] = this;

			this.li.style.height = height + 'px';

			unmount(this.component, {
				outro: false
			});
			this.component = undefined;
		}

		public destroy() {
			this.unmount(0);

			delete allItems[this.id];
			delete visibleItems[this.id];
			delete hiddenItems[this.id];

			observer.unobserve(this.li);
			this.li.remove();
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
			root: unorderedList,
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
		const li = document.createElement('li');
		const tracked = new TrackedItem(li, data);

		unorderedList.appendChild(li);
		tracked.mount(true);
		observer.observe(li);
	}

	/**
	 * Note that this function is useless if `data` is an object. It is only recommended to use this function if you're using some form of identifier, such as a string or a number.
	 */
	export function removeItem(data: ItemData) {
		for (const tracked of Object.values(allItems)) {
			if (tracked.data === data) {
				tracked.destroy();
				return;
			}
		}
	}
</script>

{#if inverted}
	<div
		class="inverted-scroller"
		bind:this={scrollContainer}
		use:invertedScroller={(b) => {
			isAtStart = b;
		}}
	>
		<ul bind:this={unorderedList} class="inverted-scroller-child"></ul>
	</div>
{:else}
	<ul
		bind:this={scrollContainer}
		bind:this={unorderedList}
		onscrollcapture={() => {
			isAtStart = scrollContainer.scrollTop == 0;
		}}
		class="regular-scroller"
	></ul>
{/if}

<style>
	ul {
		margin: 0;
	}

	.regular-scroller {
		overflow-y: auto;
		height: 100%;
	}

	.inverted-scroller {
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.inverted-scroller-child {
		position: relative;
		height: fit-content;
		overflow-y: hidden;
	}

	.inverted-scroller,
	.inverted-scroller > .inverted-scroller-child {
		transform: scaleY(-1);
	}
</style>
