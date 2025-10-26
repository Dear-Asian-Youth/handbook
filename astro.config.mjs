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
	social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/dearasianyouth' }],
	customCss: ['./src/styles/custom.css'],
			sidebar: [
	{
		label: 'About the Handbook',
		autogenerate: { directory: 'about-handbook' },
	},
	{
		label: 'About Dear Asian Youth',
		autogenerate: { directory: 'about-day' },
	},
	{
		label: 'Engineering',
		autogenerate: { directory: 'engineering' },
	},
	{
		label: 'Operations',
		autogenerate: { directory: 'operations' },
	},
],
	}),
	],
});
