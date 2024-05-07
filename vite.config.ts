import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import path from 'path'
import { UserConfigExport } from 'vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/dist/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createStyleImportPlugin, VxeTableResolve } from 'vite-plugin-style-import'
// import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
// export default ({ command }: ConfigEnv): UserConfigExport => {
export default (): UserConfigExport => {
  return {
    plugins: [
      vue(),
      // antDesign 组件库配置
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false, // css in js
          }),
        ],
      }),
      // VxeTable 组件配置
      createStyleImportPlugin({
        resolves: [VxeTableResolve()],
      }),
      // createStyleImportPlugin({
      //   resolvers: [VxeTableResolve()],
      // }),
      // SVG icons 配置
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        symbolId: 'icon-[dir]-[name]',
      }),
      // viteMockServe({
      //   localEnabled: command === 'serve', // 开发环境时使用mock数据记得注释
      // }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), // 相对路径别名配置，使用 @ 代替 src
      },
    },
    css: {
      preprocessorOptions: {
        // 预处理选项对象 配置Vue项目的预处理器选项
        // 此时variable中的变量即可在项目中使用了。
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/mixins.scss";',
        },
      },
    },
    server: {
      host: true,
      hmr: true,
      // port: 9951,
      proxy: {
        '/dev': {
          // 将带有/dev路径的地址都换成http://127.0.0.1:3001/kmsd-api
          target: 'http://localhost:3001/kmsd-api', // 后端接口地址
          changeOrigin: true, // 是否允许跨越
          rewrite: (path) => path.replace(/^\/dev/, ''),
        },
      },
    },
  }
}
