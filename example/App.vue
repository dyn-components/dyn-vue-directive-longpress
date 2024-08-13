<script setup lang="ts">
import { getCurrentInstance } from "vue";
import DynDirective from "../src";

// 使用 Vue 的全局 API 注册自定义指令
const app = getCurrentInstance()!.appContext.app;
app.directive("dyn-directive", DynDirective);

const onLongpress = () => {
  console.log("longpress");
};

const onClick = () => {
  console.log("click");
};
</script>

<template>
  <main class="dyn-container" v-dyn-directive:1000="onLongpress" @click="onClick">
    hello
  </main>
</template>

<style lang="scss" scoped>
.dyn-container {
}
</style>
