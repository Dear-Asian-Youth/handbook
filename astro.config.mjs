// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';

// https://astro.build/config
export default defineConfig({
	integrations: [
		mermaid(),
				starlight({
	title: 'Dear Asian Youth Handbook',
	editLink: {
		baseUrl: 'https://github.com/Dear-Asian-Youth/handbook/edit/main/',
	},
	social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Dear-Asian-Youth/handbook' }],
	customCss: ['./src/styles/custom.css'],
	components: {
		PageSidebar: './src/components/PageSidebar.astro',
	},
			sidebar: [
	{
		label: 'All Docs',
		autogenerate: { directory: '.', collapsed: false },
	},
	],
	}),
	],
});
