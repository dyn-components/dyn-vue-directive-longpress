import { resolve } from "path";
import { defineConfig, loadEnv, ConfigEnv } from "vite";
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import Components from "unplugin-vue-components/vite";
import DynComponents, { unpluginDynVueDirectivesResolver } from 'dyn-components'
import dts from "vite-plugin-dts";

export default defineConfig(async (params: ConfigEnv) => {
  const { command, mode } = params;
  const ENV = loadEnv(mode, process.cwd());
  console.log("node version", process.version);
  console.info(
    `running mode: ${mode}, command: ${command}, ENV: ${JSON.stringify(ENV)}`
  );
  return {
    plugins: [
      vue(),
      vueJsx(),
      libInjectCss(),
      Components({
        resolvers: [unpluginDynVueDirectivesResolver()],
      }),
      DynComponents(),
      dts({ rollupTypes: true, tsconfigPath: resolve(__dirname, './tsconfig.app.json') })
    ],
    define: {
      '__DEV__': mode === 'development', // 自定义开发模式标识
      '__PROD__': mode === 'production', // 自定义生产模式标识
    },
    resolve: {
      alias: {
        '@': '/src',
        dyn_components: "/dyn_components",
      }
    },
    base: "./",
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "directive-longpress",
        fileName: (format: string) => `directive-longpress.${format}.js`,
        formats: ["es", "umd"] as any,
      },
      emptyOutDir: true,
      sourcemap: mode === "development",
      minify: mode !== "development",
      rollupOptions: {
        // 如果内部使用了Dyn组件,可参考echarts-gl配置: https://github.com/dyn-components/dyn-vue-echarts-gl/blob/2d59314111ea01092f2ea72eedcc1ecdd77b308c/vite-lib.config.ts#L49
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue'
          }
        }
      }
    }
  };
});
