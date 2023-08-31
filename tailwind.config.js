/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		colors: {
			background: '#e5e7eb', // gray-200
			text: '#111827', // gray-900
			itembackground: '#f9fafb', // gray-50
			lightbuttontext: '#f9fafb', // gray-50
			subtle: '#4b5563', // gray-600
			desc: '#6b7280', // gray-500
			further: '#9ca3af', // gray-400
			basecolor: '#0e7490', // cyan-700
			baseborder: '#06b6d4', // cyan-500
			hovertitle: '#2563eb', // blue-600
			warning: '#b91c1c' // red-700
		},
		extend: {
			spacing: {
				120: '30rem',
				144: '36rem'
			}
		}
	},
	plugins: []
};
