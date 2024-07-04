export type IconProvider = (iconName: string) => Promise<string> | string;

const providers: { [key: string]: IconProvider } = {};

export function registerProvider(providerName: string, provider: IconProvider) {
	providers[providerName] = provider;
}

export async function lookupIcon(providerName: string, iconName: string): Promise<string> {
	const provider = providers[providerName];

	if (!provider) {
		return `<div style="background-color: red; color: white; height: 100%; width: 100%;" title="MISSING ICON">X</div>`;
	}

	try {
		return await provider(iconName);
	} catch (e) {
		console.error('Unable to load icon:', e);
		return `<div style="background-color: red; color: white; height: 100%; width: 100%;" title="ICON ERROR">!</div>`;
	}
}
