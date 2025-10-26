# Dear Asian Youth Handbook

The living documentation for Dear Asian Youth—a single source of truth that grows and evolves with our organization. Built with the philosophy that documentation should be accessible, comprehensive, and always up-to-date.

Built with [Starlight](https://starlight.astro.build) and [Astro](https://astro.build).

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |

## 📚 Project Structure

```
.
├── public/           # Static assets (favicons, etc.)
├── src/
│   ├── assets/       # Images and other assets
│   ├── content/
│   │   └── docs/     # Documentation pages (MDX/Markdown)
│   └── content.config.ts
└── astro.config.mjs  # Astro configuration
```

## 📝 Adding Content

Add `.md` or `.mdx` files to `src/content/docs/` to create new pages. The file structure matches the URL structure.

## 🔗 Learn More

- [Starlight Documentation](https://starlight.astro.build/)
- [Astro Documentation](https://docs.astro.build)
