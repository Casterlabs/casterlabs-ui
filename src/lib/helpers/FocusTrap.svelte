<script lang="ts" module>
	interface Props {
		class?: string;
		style?: string;
		onblur?: () => void;
		onfocus?: () => void;
		focused?: boolean;
	}

	function isDescendant(parent: HTMLElement, child?: Node) {
		let node: Node | null | undefined = child;
		while (node) {
			if (node == parent) {
				return true;
			}
			node = node.parentNode;
		}

		return false;
	}
</script>

<script lang="ts">
	let {
		//
		class: clazz,
		style,
		onblur,
		onfocus,
		focused = $bindable(false)
	}: Props = $props();

	let div: HTMLElement;

	function focusGained(e: FocusEvent) {
		if (focused) return; // We already HAVE focus.

		focused = true;
		onfocus?.();
	}

	function focusLost(e: FocusEvent) {
		if (!focused) return; // We've already LOST focus.

		// @ts-ignore
		const target = e.relatedTarget as Node;

		// If the newly focused element is NOT one of ours.
		if (!isDescendant(div, target)) {
			focused = false;
			onblur?.();
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	{style}
	class={clazz}
	bind:this={div}
	onclick={focusGained}
	onfocusin={focusGained}
	onfocusout={focusLost}
	tabindex="-1"
>
	<!-- svelte-ignore slot_element_deprecated -->
	<slot />
</div>
