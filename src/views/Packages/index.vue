<template>
  <div class="package_child">
    <pagination-child :backData="backData"></pagination-child>
  </div>
</template>

<script>
import PaginationChild from "@/views/Packages/PackageChild/Pagination";
export default {
  name: "Packages",
  mounted() {
    this.ajaxbackData();
  },
  data() {
    return {
      backData: {
        total: 0,
        currentPage: 0,
        pageSize: 0
      }
    };
  },
  methods: {
    ajaxbackData() {
      this.backData.total = 222;
      this.backData.currentPage = 1;
      this.backData.pageSize = 5;
    }
  },
  watch: {
    backData: {
      handler(newName, oldName) {
        console.log("newName", newName, "oldName", oldName);
      },
      deep: true
    }
  },
  components: {
    PaginationChild
  }
};
</script>
