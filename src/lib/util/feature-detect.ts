import { browser } from '$app/environment';

declare type RenderingEngine = 'webkit' | 'blink' | 'gecko' | 'unknown';

let cachedRenderingEngine: RenderingEngine | null = null;
export function getRenderingEngine(): RenderingEngine {
	if (!browser) return 'unknown';

	if (!cachedRenderingEngine) {
		const userAgent = navigator.userAgent || '';

		if (userAgent.includes('Chrome/') || userAgent.includes('Chromium/')) {
			cachedRenderingEngine = 'blink';
		} else if (userAgent.includes('AppleWebKit/') || userAgent.includes('Safari/')) {
			cachedRenderingEngine = 'webkit';
		} else if (userAgent.includes('Gecko/')) {
			cachedRenderingEngine = 'gecko';
		} else {
			cachedRenderingEngine = 'unknown';
		}
	}

	return cachedRenderingEngine;
}
