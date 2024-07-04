/* ------------------------------------------------------------ */
/* Most of these properties closely match or copy TailwindCSS.  */
/* This is to make the project easier to adopt.                 */
/* (that and I REALLY like Tailwind lol)                        */
/* ------------------------------------------------------------ */

export type PixelUnit = number;
export function pixelUnitToCSS(n: PixelUnit) {
	return n + 'px';
}

export type QRemUnit = number; // Equal to a Tailwind unit
export function qRemUnitToCSS(n: QRemUnit) {
	return n * 0.25 + 'rem';
}

export type ResizeProperty = 'none' | 'both' | 'horizontal' | 'vertical';

/* ------------------------------------------------------------ */
// https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
/* ------------------------------------------------------------ */
export type ColorProperty =
	| 'base-1'
	| 'base-2'
	| 'base-3'
	| 'base-4'
	| 'base-5'
	| 'base-6'
	| 'base-7'
	| 'base-8'
	| 'base-9'
	| 'base-10'
	| 'base-11'
	| 'base-12'
	| 'accent-1'
	| 'accent-2'
	| 'accent-3'
	| 'accent-4'
	| 'accent-5'
	| 'accent-6'
	| 'accent-7'
	| 'accent-8'
	| 'accent-9'
	| 'accent-10'
	| 'accent-11'
	| 'accent-12';

/* ------------------------------------------------------------ */
// https://tailwindcss.com/docs/width
/* ------------------------------------------------------------ */
export type SizeProperty =
	| QRemUnit
	| 'min'
	| 'max'
	| 'fit'
	| 'px'
	| 'full'
	| '1/2'
	| '1/3'
	| '2/3'
	| '1/4'
	| '2/4'
	| '3/4'
	| '1/5'
	| '2/5'
	| '3/5'
	| '4/5'
	| '1/6'
	| '2/6'
	| '3/6'
	| '4/6'
	| '5/6'
	| '1/12'
	| '2/12'
	| '3/12'
	| '4/12'
	| '5/12'
	| '6/12'
	| '7/12'
	| '8/12'
	| '9/12'
	| '10/12'
	| '11/12';
export function sizeToCSS(size: SizeProperty) {
	if (typeof size == 'number') {
		return qRemUnitToCSS(size);
	}
	return {
		min: 'min-content',
		max: 'max-content',
		fit: 'fit-content',
		px: '1px',
		full: '100%',
		'1/2': '50%',
		'1/3': '33.333333%',
		'2/3': '66.666667%',
		'1/4': '25%',
		'2/4': '50%',
		'3/4': '75%',
		'1/5': '20%',
		'2/5': '40%',
		'3/5': '60%',
		'4/5': '80%',
		'1/6': '16.666667%',
		'2/6': '33.333333%',
		'3/6': '50%',
		'4/6': '66.666667%',
		'5/6': '83.333333%',
		'1/12': '8.333333%',
		'2/12': '16.666667%',
		'3/12': '25%',
		'4/12': '33.333333%',
		'5/12': '41.666667%',
		'6/12': '50%',
		'7/12': '58.333333%',
		'8/12': '66.666667%',
		'9/12': '75%',
		'10/12': '83.333333%',
		'11/12': '91.666667%'
	}[size];
}

/* ------------------------------------------------------------ */
// https://tailwindcss.com/docs/border-radius#rounded-corners
/* ------------------------------------------------------------ */
export type RoundnessProperty = PixelUnit | 'none' | 'sm' | 'md' | 'lg' | 'full';
export function roundnessToCSS(size: RoundnessProperty) {
	if (typeof size == 'number') {
		return pixelUnitToCSS(size);
	}
	return {
		none: '0',
		sm: '0.125rem',
		md: '0.375rem',
		lg: '0.5rem',
		full: '100%'
	}[size];
}
