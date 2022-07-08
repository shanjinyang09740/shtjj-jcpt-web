<template>
  <fu-table
    :ref="tableId"
    :fu-id="tableId"
    :fu-request="tableReq"
    :span-method="arraySpanMethod"
    :max-height="maxHeight"
    border
    style="width: 100%"
  >
    <fu-table-column
      v-for="item in fuColumn"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
      :sortable="item.sortable ? 'custom' : false"
      :min-width="item.width"
      :fixed="item.fixedType || false"
      :header-align="item.headerAlign || 'left'"
      :align="item.align || 'left'"
      show-overflow-tooltip
    >
    </fu-table-column>
  </fu-table>
</template>
<script>
import { Table, TableColumn } from "fusion-ui";
export default {
  components: {
    FuTable: Table,
    FuTableColumn: TableColumn,
  },
  props: {
    // 当一个页面需要引入多个commonTable时，需要定义不同的id
    tableId: {
      type: String,
      required: true,
    },
    tableReq: {
      type: Object,
      default: () => {
        return {
          url: "",
          params: [],
        };
      },
    },
    /**
     * @description 固定显示的表格列数据 主要是为了适应当前表格
     */
    fuColumn: {
      type: Array,
      default: () => {
        return [];
      },
    },
    maxHeight: {
      type: String,
      default: "550px",
    },
  },
  data() {
    return {
      // 合并列表对象
      mergeObj: {},
    };
  },
  computed: {
    //获取表格的rows
    currentRows() {
      return this.$store.state.reqData[this.tableId].rows;
    },
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      this.mergeCell();
      if (columnIndex === 0) {
        if (this.mergeObj[column.property][rowIndex]) {
          return {
            rowspan: this.mergeObj[column.property][rowIndex],
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    mergeCell() {
      let numerical = 0;
      for (let key in this.currentRows[0]) {
        this.mergeObj[key] = [];
        this.currentRows.forEach((item, index) => {
          if (index === 0) {
            this.mergeObj[key].push(1);
          } else {
            if (item[key] === this.currentRows[index - 1][key]) {
              this.mergeObj[key][numerical] += 1;
              this.mergeObj[key].push(0);
            } else {
              numerical = index;
              this.mergeObj[key].push(1);
            }
          }
        });
      }
    },
  },
};
</script>
