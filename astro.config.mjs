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
			label: 'About DAY',
			autogenerate: { directory: 'about-day', collapsed: true },
		},
		{
			label: 'About the Handbook',
			autogenerate: { directory: 'about-handbook', collapsed: true },
		},
		{
			label: 'Diversity & Inclusion',
			autogenerate: { directory: 'diversity-inclusion', collapsed: true },
		},
		{
			label: 'Engineering',
			autogenerate: { directory: 'engineering', collapsed: true },
		},
		{
			label: 'Finance & Fundraising',
			autogenerate: { directory: 'finance-fundraising', collapsed: true },
		},
		{
			label: 'Literature',
			autogenerate: { directory: 'literature', collapsed: true },
		},
		{
			label: 'Marketing',
			autogenerate: { directory: 'marketing', collapsed: true },
		},
		{
			label: 'Podcast',
			autogenerate: { directory: 'podcast', collapsed: true },
		},
		{
			label: 'Policy',
			autogenerate: { directory: 'policy', collapsed: true },
		},
		{
			label: 'Social Media',
			autogenerate: { directory: 'social-media', collapsed: true },
		},
	],
	}),
	],
});
