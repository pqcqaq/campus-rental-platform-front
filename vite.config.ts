import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
export default defineConfig({
  base: './',
  plugins: [
    uni(),
    AutoImport({
      imports: [
        'vue',
        'uni-app',
        'pinia',
        {
          from: 'uni-mini-router',
          imports: ['createRouter', 'useRouter', 'useRoute']
        }
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/store'],
      eslintrc: {
        enabled: true,
        globalsPropValue: true
      }
    })
  ]
})
