<template>
  <div id="app">
    <div id="nav">
      <component-child></component-child>
    </div>
    <!-- <router-view/> -->
  </div>
</template>
<script>
import ComponentChild from "@/views/Packages";
export default {
  components: {
    ComponentChild
  }
};
</script>
<style>
</style>
