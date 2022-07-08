<template>
  <fu-table
    id="mainTable"
    :fu-data="tableData"
    :row-key="'id'"
    max-height="500px"
    border
  >
    <fu-table-column label="序号" type="index" align="center" width="50">
    </fu-table-column>
    <fu-table-column
      v-for="(item, index) in tableData.column"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :minWidth="item.width"
      :align="item.align"
    >
    </fu-table-column>
  </fu-table>
</template>

<script>
import { Table, TableColumn } from "fusion-ui";
export default {
  name: "ChangeNote",
  components: { FuTable: Table, FuTableColumn: TableColumn },
  props: {},
  data() {
    return {
      tableData: {
        column: [
          {
            label: "变更时间",
            prop: "changeTime",
            width: "120",
            align: "left",
          },
          {
            label: "变更事项",
            prop: "changeItem",
            width: "150",
            align: "left",
          },
          {
            label: "变更前内容",
            prop: "bgqnr",
            width: "200",
            reqUrl: "",
            align: "left",
          },
          {
            label: "变更后内容",
            prop: "bghnr",
            width: "200",
            reqUrl: "",
            align: "left",
          },
        ],
        rows: [
          {
            changeTime: "2022-05-31",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {},
};
</script>

<style lang="less" scoped></style>
