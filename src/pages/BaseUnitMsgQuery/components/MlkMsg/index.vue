<template>
  <div v-loading="showLoading">
    <fu-button size="mini" type="primary" clearable @click="exportData"
      >导出</fu-button
    >
    <div class="report" v-html="reportHtml"></div>
  </div>
</template>

<script>
import { Button, Message } from "fusion-ui";
import http from "@/utils/http";

export default {
  name: "MlkMsg",
  components: {
    FuButton: Button,
  },
  props: {
    tableId: {
      type: String,
      default: "",
    },
    tableType: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      reportHtml: "",
      showLoading: false,
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.showLoading = true;
    http
      .post(
        `/api/nkgl/v1/directory/directoryDetail.do?creditCode=${this.tableId}&type=${this.tableType}`
      )
      .then((res) => {
        this.showLoading = false;
        let result = res.data[0].data;
        this.reportHtml = result;
      });
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    exportData() {
      window.open(
        `/api/nkgl/v1/directory/directoryDetail/export.do?creditCode=${this.tableId}&type=${this.tableType}`
      );
    },
  },
};
</script>

<style lang="less" scoped>
.report {
  max-height: 500px;
  overflow: auto;
}
</style>
