<template>
  <div class="contain" v-loading="pageLoading">
    <div class="queryLan">
      <common-form-items
        ref="commonForm"
        :FormItems="formItems"
        :FormData="formData"
      ></common-form-items>
      <div class="queryBtns">
        <div>
          <fu-button size="mini" type="success" clearable @click="tableSearch"
            >查询</fu-button
          >
          <fu-button size="mini" type="primary" clearable @click="resetSearch"
            >重置</fu-button
          >
        </div>
      </div>
    </div>
    <fu-table
      id="mainTable"
      :fu-data="tableData"
      :fu-request="tableReq"
      :row-key="'id'"
      max-height="500px"
      border
      @selection-change="handleSelectionChange"
    >
      <fu-table-column type="selection" width="55"> </fu-table-column>
      <fu-table-column label="序号" type="index" align="center" width="50">
      </fu-table-column>
      <fu-table-column
        v-for="(item, index) in tableData.column"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :minWidth="item.width"
        :align="item.align"
        :sortable="item.sortable"
      >
        <template slot-scope="scope">
          <span v-if="item.isTransCode">{{
            tramsFormate(scope.row[item.prop], item.prop)
          }}</span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </fu-table-column>
      <fu-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <div class="operateBtns">
            <span
              v-for="(item, index) in tableOperateBtnGroup"
              :key="index"
              @click.stop="handleRowBtnClick(scope.row)"
            >
              <img :src="item.imgPath" />
              <span>{{ item.text }}</span>
            </span>
          </div>
        </template>
      </fu-table-column>
    </fu-table>
    <fu-pagination
      ref="page"
      @current-change="handleCurrentChange"
      :fu-request="tableReq"
      @size-change="handleSizeChange"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="tableData.pageData.pagerows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.pageData.totalrows"
    ></fu-pagination>
    <custom-dialog
      v-if="customDialog.isShow"
      :isShowDialog="customDialog.isShow"
      :isShowCancel="false"
      :confirmText="'关闭'"
      :title="customDialog.title"
      :width="'80%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
      <div slot="body">
        <merge-cell-table
          :tableId="creditCode"
          :tableReq="customTableReq"
          :fuColumn="customColumn"
        ></merge-cell-table>
      </div>
    </custom-dialog>
  </div>
</template>

<script>
import { Button, Table, TableColumn, Pagination, Message } from "fusion-ui";
import CommonFormItems from "@/components/CommonFormItems";
import { FormItems } from "./FormItems";
import http from "@/utils/http";
import CustomDialog from "@/components/CommonDialog";
import MergeCellTable from "@/components/MergeCellTable";

export default {
  name: "SceneVerification",
  components: {
    FuButton: Button,
    FuTable: Table,
    FuTableColumn: TableColumn,
    FuPagination: Pagination,
    CommonFormItems,
    CustomDialog,
    MergeCellTable,
  },
  props: {},
  data() {
    return {
      pageLoading: false,
      formItems: { ...FormItems },
      formData: {
        creditCode: "",
        companyName: "",
        sceneStatus: "",
        warehousingStatus: "",
      },
      formQuery: {},
      customDialog: {
        isShow: false,
        title: "",
        compType: "",
      },
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
      creditCode: "",
      //表格操作列显示按钮类型
      tableOperateBtnGroup: [
        {
          text: "详情",
          value: "ViewDetail",
          imgPath: require("@/assets/images/table/view-detail.svg"),
        },
      ],
      dicOptions: {
        sceneStatus: [
          {
            text: "已核查",
            value: "0",
          },
          {
            text: "未核查",
            value: "1",
          },
        ],
        warehousingStatus: [
          {
            text: "已入库",
            value: "0",
          },
          {
            text: "未入库",
            value: "1",
          },
        ],
      },
      tableData: {
        column: [
          {
            label: "统一社会信用代码",
            prop: "creditCode",
            width: "200",
            align: "left",
            sortable: true,
          },
          {
            label: "组织机构代码",
            prop: "orgCode",
            width: "200",
            reqUrl: "",
            align: "left",
            sortable: true,
          },
          {
            label: "单位详细名称",
            prop: "companyName",
            width: "200",
            reqUrl: "",
            align: "left",
          },

          {
            label: "法定代表人",
            prop: "legalPerson",
            width: "200",
            isInput: true,
            align: "left",
          },
          {
            label: "详细地址",
            prop: "detailedAddress",
            width: "200",
            reqUrl: "",
            align: "left",
          },
          {
            label: "长途区号",
            prop: "areaCode",
            width: "150",
            reqUrl: "",
            align: "left",
          },
          {
            label: "固定电话",
            prop: "fixedPhone",
            width: "150",
            reqUrl: "",
            align: "left",
          },
          {
            label: "线下核查人员",
            prop: "sceneId",
            width: "200",
            reqUrl: "",
            align: "left",
          },
          {
            label: "线下核查状态",
            prop: "sceneStatus",
            width: "200",
            reqUrl: "",
            align: "left",
            isTransCode: true,
          },
          {
            label: "线下核查时间",
            prop: "sceneTime",
            width: "150",
            reqUrl: "",
            align: "left",
          },
          {
            label: "入库状态",
            prop: "warehousingStatus",
            width: "150",
            reqUrl: "",
            align: "left",
            isTransCode: true,
          },
        ],
        pageData: {
          page: 1,
          pagerows: 10,
          totalrows: 0,
        },
        rows: [],
      },
      customDialog: {
        isShow: false,
        title: "",
        compType: "",
      },
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
    tableReq() {
      return {
        url: "/api/nkgl/v1/xchcjg/queryList.do",
        params: [
          {
            vtype: "pagination",
            name: "pagerows",
            data: this.tableData.pageData.pagerows,
          },
          {
            vtype: "pagination",
            name: "totalrows",
            data: 0,
          },
          {
            vtype: "pagination",
            name: "page",
            data: this.tableData.pageData.page,
          },
          {
            vtype: "pagination",
            name: "sortName",
            data: "",
          },
          {
            vtype: "pagination",
            name: "sortFlag",
            data: "",
          },
          {
            vtype: "formpanel",
            name: "condition",
            data: {
              creditCode: this.formQuery.creditCode,
              companyName: this.formQuery.companyName,
              sceneStatus: this.formQuery.sceneStatus,
              warehousingStatus: this.formQuery.warehousingStatus,
            },
          },
          {
            vtype: "pagination",
            name: "queryType",
            data: "dataOnly",
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
    /**
     * @description  表格列转码
     * @param {String} val
     * @param {String} prop
     * @returns {String} newValue
     */
    tramsFormate(val, prop) {
      let newValue = "";
      for (let key in this.dicOptions) {
        if (key == prop) {
          this.dicOptions[key].some((item) => {
            if (item.value == val) {
              newValue = item.text;
              return true;
            }
          });
        }
      }
      return newValue;
    },
    /**
     * @description 切换弹窗显示状态
     * @param {Boolean} val
     */
    changeIsShowDialog(val) {
      this.customDialog.isShow = val;
    },
    /**
     * @description 弹窗操作按钮事件
     * @param {String} val ---- confirm/cancel 确认/取消
     * @param {Object} data 表单数据
     */
    operation(val) {
      this.customDialog.isShow = false;
    },
    //详情查看
    handleRowBtnClick(row) {
      let { creditCode } = row;
      this.creditCode = creditCode;
      this.customDialog.isShow = true;
      this.customDialog.title = "详情";
    },
    /**
     * @description 表单查询事件
     */
    tableSearch() {
      let getFormData = this.$refs.commonForm.formData;
      this.formQuery = { ...getFormData };
    },
    /**
     * @description 重置查询条件
     */
    resetSearch() {
      this.$refs.commonForm.clearFormData();
    },
    /**
     * @description 多选表格change事件
     * @param {Array} val
     */
    handleSelectionChange(val) {
      // this.selectedTableData = val;
    },
    handleCurrentChange(val) {
      this.tableData.pageData.page = val;
    },
    //每页多少条
    handleSizeChange(val) {
      this.tableData.pageData.pagerows = val;
      console.log(`每页 ${val} 条`);
    },
  },
};
</script>

<style lang="less" scoped>
.contain {
  .header {
    padding: 10px 0 10px 20px;
  }
  .queryLan {
    padding: 5px 20px 0;
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
    .queryBtns {
      display: flex;
      justify-content: center;
      padding-bottom: 10px;
    }
  }
  // .operateBtns {
  //   color: #409eff;
  //   display: flex;
  //   white-space: nowrap;
  //   > span {
  //     display: flex;
  //     align-items: center;
  //     flex-direction: row;
  //     margin-right: 10px;
  //     cursor: pointer;
  //   }
  //   i {
  //     cursor: pointer;
  //   }
  //   img {
  //     cursor: pointer;
  //     margin-right: 10px;
  //   }
  // }
  // /deep/ .el-table .operateBtns .iconfont {
  //   margin-right: 5px;
  // }
  // .el-dropdown-link {
  //   cursor: pointer;
  //   color: #409eff;
  // }
  // .el-icon-arrow-down {
  //   font-size: 14px;
  // }
}
</style>
