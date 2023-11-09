import { join } from 'path';
import { skeleton } from '@skeletonlabs/tw-plugin';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			typography: {
				DEFAULT: {
					css: {
						'code::before': {
							content: '""'
						},
						'code::after': {
							content: '""'
						},
						code: {
							fontWeight: 400
						}
					}
				}
			},
			spacing: {
				120: '30rem',
				144: '36rem'
			}
		}
	},
	plugins: [
		require('@tailwindcss/typography'),
		skeleton({
			themes: { preset: ['skeleton'] }
		})
	]
};
