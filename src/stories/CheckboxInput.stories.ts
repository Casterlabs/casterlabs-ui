import type { Meta, StoryObj } from '@storybook/svelte';
import { CheckboxInput } from '$lib/components';

const meta = {
	title: 'Example/CheckboxInput',
	component: CheckboxInput,
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ['autodocs'],
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
		layout: 'fullscreen'
	}
} satisfies Meta<CheckboxInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {}
};
