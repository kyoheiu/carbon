/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			text: '#111827', // gray-900
			codetext: '#111827', // gray-900
			lightbuttontext: '#f9fafb', // gray-50
			background: '#f9fafb', // gray-50
			codebackground: '#f3f4f6', // gray-100
			itembackground: '#e5e7eb', // gray-200
			hr: '#e5e7eb', // gray-200
			subtle: '#4b5563', // gray-600
			desc: '#6b7280', // gray-500
			further: '#9ca3af', // gray-400
			basecolor: '#2563eb', // blue-600
			baseborder: '#60a5fa', // blue-400
			hovertitle: '#2563eb', // blue-600
			warning: '#b91c1c', // red-700
			link: '#0369a1' // blue-700
			// logo color: #374151 (gray-700)
		},
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
	plugins: [require('@tailwindcss/typography')]
};
