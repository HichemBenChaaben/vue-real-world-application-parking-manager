import { defineConfig } from 'vitepress'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'parking business',
  description: 'A VitePress Site',
  vite: {
    plugins: [
      createStyleImportPlugin({
        libs: [
          {
            libraryName: 'tailwindcss',
            resolveStyle: (name) => {
              console.log('name...', name)
              return `../tailwind.config.css`
            }
          }
        ]
      })
    ]
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/vuejs/vitepress' }]
  }
})
