<!-- svelte-ignore slot_element_deprecated -->
<slot />

<style>
	:global(:root) {
		/* https://www.radix-ui.com/colors/docs/palette-composition/scales */
		--clui-color-base-1: #121113; /* background-app */
		--clui-color-base-2: #1a191b; /* background-subtle */
		--clui-color-base-3: #232225; /* element-background */
		--clui-color-base-4: #2b292d; /* element-hovered */
		--clui-color-base-5: #323035; /* element-active  */
		--clui-color-base-6: #3c393f; /* border-subtle */
		--clui-color-base-7: #49474e; /* border-element */
		--clui-color-base-8: #625f69; /* border-hovered */
		--clui-color-base-9: #6f6d78; /* solid */
		--clui-color-base-10: #7c7a85; /* solid-hovered */
		--clui-color-base-11: #b5b2bc; /* text-low */
		--clui-color-base-12: #eeeef0; /* text-high */

		--clui-color-accent-1: #fffcfd; /* background-app */
		--clui-color-accent-2: #fef7f9; /* background-subtle */
		--clui-color-accent-3: #ffe9f0; /* element-background */
		--clui-color-accent-4: #fedce7; /* element-hovered */
		--clui-color-accent-5: #facedd; /* element-active  */
		--clui-color-accent-6: #f3bed1; /* border-subtle */
		--clui-color-accent-7: #eaacc3; /* border-element */
		--clui-color-accent-8: #e093b2; /* border-hovered */
		--clui-color-accent-9: #e93d82; /* solid */
		--clui-color-accent-10: #df3478; /* solid-hovered */
		--clui-color-accent-11: #cb1d63; /* text-low */
		--clui-color-accent-12: #621639; /* text-high */
	}

	:global(html) {
		background: var(--clui-color-base-1);
		color: var(--clui-color-base-12);
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
	}
</style>
