<script lang="ts" module>
	interface Props {
		id?: string;

		class?: string;
		style?: string;

		/**
		 * Removes the borders from the element. This has the side effect of also making the element transparent EXCEPT when hovered.
		 */
		borderless?: boolean;
		disabled?: boolean;
		onclick?: () => void;
	}
</script>

<script lang="ts">
	let {
		//
		id,
		class: clazz,
		style,
		borderless = false,
		disabled = false,
		onclick
	}: Props = $props();
</script>

<button {id} {disabled} {style} class={clazz} class:borderless {onclick}>
	<!-- svelte-ignore slot_element_deprecated -->
	<slot />
</button>

<style>
	button {
		border-radius: var(--clui-radius, 0);
		border-width: 0.0625rem;
		border-style: solid;
		border-color: transparent;
		background-color: transparent;
		color: currentColor;
		cursor: pointer;
		font-size: 0.8rem;
	}

	button[disabled] {
		cursor: not-allowed;
	}

	button:not(.borderless) {
		border-color: var(--clui-color-base-7);
		background-color: var(--clui-color-base-3);
		color: var(--clui-color-base-12);
	}

	/* Hover */

	button:not(.borderless):not([disabled]):hover {
		border-color: var(--clui-color-base-8);
	}

	button.borderless:not([disabled]):hover {
		background-color: var(--clui-color-base-4);
	}

	/* Focus */

	button:focus {
		outline: none;
	}
	button:not(.borderless):not([readonly]):focus {
		outline-width: 0.125rem;
		outline-style: solid;
		outline-color: var(--clui-color-accent-8);
		border-color: var(--clui-color-base-2);
	}
</style>
