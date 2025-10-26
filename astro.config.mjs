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
		label: 'About the Handbook',
		autogenerate: { directory: 'about-handbook' },
	},
	{
		label: 'About Dear Asian Youth',
		autogenerate: { directory: 'about-day' },
	},
	{
		label: 'Operations',
		autogenerate: { directory: 'operations' },
	},
	{
		label: 'Diversity & Inclusion',
		autogenerate: { directory: 'diversity-inclusion' },
	},
	{
		label: 'Engineering',
		autogenerate: { directory: 'engineering' },
	},
	{
		label: 'Finance & Fundraising',
		autogenerate: { directory: 'finance-fundraising' },
	},
	{
		label: 'Literature',
		autogenerate: { directory: 'literature' },
	},
	{
		label: 'Marketing',
		autogenerate: { directory: 'marketing' },
	},
	{
		label: 'Podcast',
		autogenerate: { directory: 'podcast' },
	},
	{
		label: 'Policy',
		autogenerate: { directory: 'policy' },
	},
	{
		label: 'Social Media',
		autogenerate: { directory: 'social-media' },
	},
],
	}),
	],
});
