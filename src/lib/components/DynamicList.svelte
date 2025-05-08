<script lang="ts">
	import { NumericalIdGenerator, type Id } from '$lib/ids.js';
	import { mount, onMount, unmount, type Component, type Snippet } from 'svelte';

	const ID_ATTR = 'data-clui-list-item-id';
	const ID_GENERATOR = new NumericalIdGenerator();

	declare type ItemData = any;

	declare type ItemRenderer = Component<() => ItemData, any, any> | Snippet<[ItemData]>;

	interface Props {
		/**
		 * An amount (in pixels) which will be used by the observer to determine which elements are visible.
		 * Basically, a higher value results in more items on the top and bottom that will be considered "visible".
		 * This is to make scrolling the list smoother as higher bleed values prevent elements from popping into existience.
		 */
		bleed?: number;

		startWith?: ItemData[];
		itemRenderer: ItemRenderer;

		itemsVisible?: number;
	}

	let { bleed = 0, itemRenderer, startWith, itemsVisible = $bindable(0) }: Props = $props();

	let unorderedList: HTMLElement;
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

				itemsVisible = Object.keys(visibleItems).length;
			});
		};

		observer = new IntersectionObserver(callback, {
			root: unorderedList,
			rootMargin: `${bleed}px 0px ${bleed}px 0px`
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

<ul bind:this={unorderedList} style="overflow-y: auto; height: 100%; margin: 0;"></ul>
