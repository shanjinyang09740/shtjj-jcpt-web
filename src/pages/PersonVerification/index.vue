<template>
  <div class="contain">
    <div class="header">
      <fu-button type="primary" size="mini" @click="assignCodeClick"
        >赋码</fu-button
      >
      <fu-button type="primary" size="mini" plain @click="exportClick"
        >导出</fu-button
      >
    </div>
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
      <fu-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <div class="operateBtns">
            <span
              v-for="(item, index) in tableOperateBtnGroup"
              :key="index"
              @click.stop="handleRowBtnClick(scope.row, item.value)"
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
    <export-dialog
      v-if="exportDialog.isShow"
      :isShowDialog="exportDialog.isShow"
      :title="exportDialog.title"
      :width="'50%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="exportOperation"
    >
      <div slot="body">
        <export-table
          ref="dialogForm"
          :formItems="exportFormItems"
          :formData="exportFormData"
        ></export-table>
      </div>
    </export-dialog>
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
    <assign-dialog
      v-if="assignDialog.isShow"
      :isShowDialog="assignDialog.isShow"
      :title="assignDialog.title"
      :width="'50%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="assignOperation"
    >
      <div slot="body">
        <per-assign-code
          ref="assignForm"
          v-if="assignDialog.compType == 'PerAssignCode'"
        ></per-assign-code>
        <batch-assign-code
          ref="assignForm"
          v-if="assignDialog.compType == 'BatchAssignCode'"
        ></batch-assign-code>
      </div>
    </assign-dialog>
  </div>
</template>

<script>
import { Button, Table, TableColumn, Pagination, Message } from "fusion-ui";
import CommonFormItems from "@/components/CommonFormItems";
import CustomDialog from "@/components/CommonDialog";
import ExportDialog from "@/components/CommonDialog";
import AssignDialog from "@/components/CommonDialog";
import { postDicData } from "@/utils/tool";
import { FormItems } from "./FormItems";
import http from "@/utils/http";
import { queryExportParams, queryExportParamsCh } from "@/service";
import MergeCellTable from "@/components/MergeCellTable";
import ExportTable from "@/components/ExportTable";
import PerAssignCode from "./components/PerAssignCode";
import BatchAssignCode from "./components/BatchAssignCode";

export default {
  name: "PersonVerification",
  components: {
    FuButton: Button,
    FuTable: Table,
    FuTableColumn: TableColumn,
    FuPagination: Pagination,
    CommonFormItems,
    ExportDialog,
    CustomDialog,
    MergeCellTable,
    ExportTable,
    BatchAssignCode,
    PerAssignCode,
    AssignDialog,
  },
  props: {},
  data() {
    return {
      formItems: { ...FormItems },
      formData: {
        dataSource: "",
        creditCode: "",
        companyName: "",
        callStatus: "",
        startTime: "",
        endTime: "",
        callResult: "",
        idResult: "",
        addressResult: "",
      },
      formQuery: {},
      //详情弹窗
      customDialog: {
        isShow: false,
        title: "",
        compType: "",
      },
      //导出弹窗
      exportDialog: {
        isShow: false,
        title: "",
        compType: "",
      },
      //赋码弹窗
      assignDialog: {
        isShow: false,
        title: "",
        compType: "",
      },
      //导出相关
      exportAllColumns: [],
      exportDefaultColumns: [],
      exportFormData: {
        type: "",
        columns: [],
      },
      exportFormItems: [
        {
          label: "导出格式",
          prop: "type",
          type: "select",
          disabled: false,
          placeholder: "请选择",
          size: "medium",
          option: [],
        },
        {
          label: "导出字段",
          prop: "columns",
          type: "transfer",
          disabled: false,
          size: "medium",
          placeholder: "",
          option: [],
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
      creditCode: "",
      //已选中行
      selectedTableData: [],
      //当前选中该行
      currentRowdata: {},
      //表格操作列显示按钮类型
      tableOperateBtnGroup: [
        {
          text: "详情",
          value: "ViewDetail",
          imgPath: require("@/assets/images/table/view-detail.svg"),
        },
        {
          text: "赋码",
          value: "AssignCode",
          imgPath: require("@/assets/images/table/assign-code.svg"),
        },
      ],
      dicOptions: {
        industryCode: [],
        assignmentStatus: [
          {
            text: "已赋码",
            value: "1",
          },
          {
            text: "未赋码",
            value: "2",
          },
        ],
        idResult: [
          {
            text: "正确",
            value: "0",
          },
          {
            text: "不正确",
            value: "1",
          },
        ],
        addressResult: [
          {
            text: "正确",
            value: "0",
          },
          {
            text: "不正确",
            value: "1",
          },
        ],
      },
      tableData: {
        column: [
          {
            label: "数据来源",
            prop: "dataSource",
            width: "150",
            align: "left",
          },
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
            width: "150",
            reqUrl: "",
            align: "left",
            sortable: true,
          },
          {
            label: "单位详细名称",
            prop: "companyName",
            width: "120",
            reqUrl: "",
            align: "left",
          },
          {
            label: "法定代表人",
            prop: "legalPerson",
            width: "100",
            isInput: true,
            align: "left",
          },
          {
            label: "详细地址",
            prop: "detailedAddress",
            width: "100",
            reqUrl: "",
            align: "left",
          },
          {
            label: "长途区号",
            prop: "areaCode",
            width: "100",
            reqUrl: "",
            align: "left",
          },
          {
            label: "固定电话",
            prop: "fixedPhone",
            width: "100",
            reqUrl: "",
            align: "left",
          },
          {
            label: "更新时间",
            prop: "updateTime",
            width: "150",
            reqUrl: "",
            align: "left",
          },
          {
            label: "建议类型",
            prop: "type",
            width: "100",
            reqUrl: "",
            align: "left",
          },
          {
            label: "是否已纳库",
            prop: "isNaku",
            width: "150",
            reqUrl: "",
            align: "left",
            isTransCode: true,
          },
          {
            label: "身份核实结果",
            prop: "idResult",
            width: "250",
            reqUrl: "",
            align: "left",
            isTransCode: true,
          },
          {
            label: "地址核实结果",
            prop: "addressResult",
            width: "250",
            reqUrl: "",
            align: "left",
            isTransCode: true,
          },
          {
            label: "主要业务活动",
            prop: "businessActivities1",
            width: "250",
            reqUrl: "",
            align: "left",
          },
          {
            label: "行业代码",
            prop: "industryCode",
            width: "250",
            reqUrl: "",
            align: "left",
            isTransCode: true,
          },
          {
            label: "赋码状态",
            prop: "assignmentStatus",
            width: "100",
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
        url: "/api/nkgl/v1/dhhc/queryYWHList.do",
        params: [
          {
            vtype: "attr",
            name: "lable",
            data: {
              dataSource: this.formQuery.dataSource,
              creditCode: this.formQuery.creditCode,
              companyName: this.formQuery.companyName,
              callResult: this.formQuery.callResult,
              addressResult: this.formQuery.addressResult,
              idResult: this.formQuery.idResult,
              assignmentStatus: this.formQuery.assignmentStatus,
            },
          },
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
        ],
      };
    },
  },
  watch: {},
  beforeCreate() {},
  created() {
    //获取导出相关数据
    this.initExportData();
    //获取字典项数据
    this.getDicOptions();
  },
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
    //获取字典项数据
    async getDicOptions() {
      //获取行业代码
      let { data } = await postDicData("IndustryCode");
      this.dicOptions.industryCode = data[0].data;
    },
    async initExportData() {
      let allData = await queryExportParams("drghcqdcx");
      let chnData = await queryExportParamsCh();
      chnData = chnData["data"][0].data;
      allData.data.forEach((item) => {
        if (item.name == "allList") {
          item.data.forEach((ite) => {
            let findItem = chnData.filter((chn) => chn.zbcode == ite)[0];
            findItem &&
              this.exportAllColumns.push({
                label: findItem.zbname,
                value: findItem.zbcode,
                key: findItem.zbcode,
              });
          });
        } else {
          this.exportDefaultColumns.push(...item.data);
        }
      });
      this.exportFormData.columns = this.exportDefaultColumns;
      this.exportFormItems.forEach(async (item) => {
        if (item.prop == "columns") {
          item.option = this.exportAllColumns;
          return true;
        } else if (item.prop == "type") {
          let { data } = await postDicData("ExportFormat");
          item.option = data[0].data;
        }
      });
    },
    /**
     * @description 操作栏点击事件
     * @param {}
     * @returns {}
     */
    handleRowBtnClick(row, value) {
      let { creditCode, phoneVerifyId, industryCode } = row;
      this.creditCode = creditCode;
      if (value == "ViewDetail") {
        this.customDialog.isShow = true;
        this.customDialog.title = "详情";
      } else {
        this.assignDialog.isShow = true;
        this.assignDialog.compType = "PerAssignCode";
        this.currentRowdata = row;
      }
    },
    /**
     * @description 导出弹窗操作按钮事件
     * @param {String} val ---- confirm/cancel 确认/取消
     * @param {Object} data 表单数据
     */
    assignOperation(val) {
      if (val == "confirm") {
        this.$refs.assignForm.submit &&
          this.$refs.assignForm.submit((data, type) => {
            this.assignDialog.isShow = false;
            if (type == "PerAssignCode") {
              this.codesDeal(
                this.currentRowdata.phoneVerifyId,
                data.IndustryCode
              );
            } else if (type == "BatchAssignCode") {
              //执行逻辑---todo
              console.log("批量赋码开始", data);
            }
          });
      } else {
        this.assignDialog.isShow = false;
      }
    },
    /**
     * @description 赋码处理
     * @param {String} phoneVerifyId
     * @param {String} industryCode
     */
    codesDeal(phoneVerifyIds, industryCodes) {
      let postData = {
        data: [
          {
            vtype: "attr",
            name: "id",
            data: phoneVerifyIds,
          },
          {
            vtype: "attr",
            name: "IndustryCode",
            data: industryCodes,
          },
        ],
      };
      http
        .post("api/nkgl/v1/dhhc/updateIndustryCode.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          Message.success("赋码成功");
        })
        .catch((err) => {
          let response = JSON.parse(err.response);
          Message.error(`赋码失败，${response.data}`);
        });
    },
    /**
     * @description 切换弹窗显示状态
     * @param {Boolean} val
     */
    changeIsShowDialog(val) {
      this.customDialog.isShow = val;
      this.exportDialog.isShow = val;
      this.assignDialog.isShow = val;
    },
    /**
     * @description 弹窗操作按钮事件
     * @param {String} val ---- confirm/cancel 确认/取消
     * @param {Object} data 表单数据
     */
    operation(val) {
      this.customDialog.isShow = false;
    },
    /**
     * @description 导出弹窗操作按钮事件
     * @param {String} val ---- confirm/cancel 确认/取消
     * @param {Object} data 表单数据
     */
    exportOperation(val) {
      if (val == "confirm") {
        this.$refs.dialogForm.submit &&
          this.$refs.dialogForm.submit((data, type) => {
            this.customDialog.isShow = false;
            if (type == "ExportTable") {
              //处理导出逻辑
              window.open(
                `/api/nkgl/v1/qyxx/exportExcelQyxx.do?tableHead=${JSON.stringify(
                  data.columns
                )}&fileType=${data.type}`
              );
            }
          });
      } else {
        this.exportDialog.isShow = false;
      }
    },
    //赋码
    assignCodeClick() {
      this.assignDialog.isShow = true;
      this.assignDialog.title = "赋码";
      this.assignDialog.compType = "BatchAssignCode";
    },
    //导出
    exportClick() {
      this.exportDialog.title = "导出";
      this.exportDialog.isShow = true;
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
      this.selectedTableData = val;
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
}
</style>
