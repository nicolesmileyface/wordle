import vue from "@vitejs/plugin-vue";

export default {
  resolve: {
    alias: {
      vue: "vue/dist/vue.esm-bundler.js",
    },
  },
  plugins: [vue()],
};
