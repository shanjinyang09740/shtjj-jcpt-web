<template>
  <div>
    <fu-tabs
      v-model="activeTabName"
      type="border-card"
      @tab-click="handleClick"
    >
      <fu-tab-pane
        v-for="item in tabPaneList"
        :key="item.value"
        :name="item.value"
        :label="item.text"
      >
        <merge-cell-table
          v-if="currentComp == 'MergeCellTable'"
          :tableId="creditCode"
          :tableReq="customTableReq"
          :fuColumn="customColumn"
        ></merge-cell-table>
        <mlk-msg
          :tableId="creditCode"
          :tableType="type"
          v-if="currentComp == 'MlkMsg'"
        ></mlk-msg>
      </fu-tab-pane>
    </fu-tabs>
  </div>
</template>

<script>
import { Tabs, TabPane } from "fusion-ui";
import MergeCellTable from "@/components/MergeCellTable";
import MlkMsg from "../MlkMsg";

export default {
  name: "ViewDetail",
  components: {
    FuTabs: Tabs,
    FuTabPane: TabPane,
    MergeCellTable,
    MlkMsg,
  },
  props: {
    creditCode: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeTabName: "MlkMsg",
      currentComp: "MlkMsg",
      tabPaneList: [
        {
          text: "名录库信息",
          value: "MlkMsg",
        },
        {
          text: "全部信息",
          value: "MergeCellTable",
        },
      ],
      customColumn: [
        {
          label: "分组",
          prop: "fzData",
          width: "200",
          align: "left",
        },
        {
          label: "指标",
          prop: "zbData",
          width: "300",
          align: "left",
        },
        {
          label: "名录数据",
          prop: "mlData",
          width: "300",
          align: "left",
        },
      ],
    };
  },
  computed: {
    customTableReq() {
      return {
        url: "/api/nkgl/v1/qyxx/queryTyxyById.do",
        params: [
          {
            vtype: "attr",
            name: "id",
            data: this.creditCode,
          },
        ],
      };
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    handleClick() {
      this.currentComp = this.activeTabName;
    },
  },
};
</script>

<style lang="less" scoped></style>
