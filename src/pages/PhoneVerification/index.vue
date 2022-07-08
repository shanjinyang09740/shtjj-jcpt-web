<template>
  <div class="contain">
    <div class="header">
      <fu-button type="primary" size="mini" @click="initiateCallClick"
        >发起外呼</fu-button
      >
      <fu-button type="primary" size="mini" @click="callResultImportClick"
        >外呼结果导入</fu-button
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
    <custom-dialog
      v-if="customDialog.isShow"
      :isShowDialog="customDialog.isShow"
      :isShowCancel="false"
      :confirmText="'关闭'"
      :title="customDialog.title"
      :width="'80%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="
        () => {
          this.customDialog.isShow = false;
        }
      "
    >
      <div slot="body">
        <merge-cell-table
          :tableId="creditCode"
          :tableReq="customTableReq"
          :fuColumn="customColumn"
        ></merge-cell-table>
      </div>
    </custom-dialog>
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
    <upload-dialog
      v-if="uploadDialog.isShow"
      :isShowDialog="uploadDialog.isShow"
      :confirmText="'关闭'"
      :isShowCancel="false"
      :title="uploadDialog.title"
      @on-result-change="changeIsShowDialog"
      @child-operation="
        () => {
          this.uploadDialog.isShow = false;
        }
      "
    >
      <div slot="body">
        <import-file ref="importFile"></import-file>
      </div>
    </upload-dialog>
  </div>
</template>

<script>
import { Button, Table, TableColumn, Pagination, Message } from "fusion-ui";
import CommonFormItems from "@/components/CommonFormItems";
import { FormItems } from "./FormItems";
import { postDicData } from "@/utils/tool";
import http from "@/utils/http";
import CustomDialog from "@/components/CommonDialog";
import ExportDialog from "@/components/CommonDialog";
import UploadDialog from "@/components/CommonDialog";
import ExportTable from "@/components/ExportTable";
import MergeCellTable from "@/components/MergeCellTable";
import ImportFile from "./components/ImportFile";
import { queryExportParams, queryExportParamsCh } from "@/service";

export default {
  name: "PhoneVerification",
  components: {
    FuButton: Button,
    FuTable: Table,
    FuTableColumn: TableColumn,
    FuPagination: Pagination,
    CommonFormItems,
    CustomDialog,
    MergeCellTable,
    ExportDialog,
    ExportTable,
    UploadDialog,
    ImportFile,
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
      customDialog: {
        isShow: false,
        title: "",
        compType: "",
      },
      exportDialog: {
        isShow: false,
        title: "",
        compType: "",
      },
      uploadDialog: {
        isShow: false,
        title: "导入",
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
        {
          text: "发起外呼",
          value: "InitiateCall",
          imgPath: require("@/assets/images/table/initiate-call.svg"),
        },
      ],
      selectedTableData: [],
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
            label: "外呼状态",
            prop: "callStatus",
            width: "150",
            reqUrl: "",
            align: "left",
            isTransCode: true,
          },
          {
            label: "外呼时间",
            prop: "callTime",
            width: "100",
            reqUrl: "",
            align: "left",
          },
          {
            label: "电话核实结果",
            prop: "callResult",
            width: "200",
            reqUrl: "",
            align: "left",
            isTransCode: true,
          },
          {
            label: "身份核实结果",
            prop: "idResult",
            width: "200",
            reqUrl: "",
            align: "left",
            isTransCode: true,
          },
          {
            label: "地址核实结果",
            prop: "addressResult",
            width: "200",
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
      //字典项option
      dicOptions: {
        callStatus: [],
        callResult: [],
        idResult: [],
        addressResult: [],
        isNaku: [
          {
            text: "是",
            value: "0",
          },
          {
            text: "否",
            value: "1",
          },
        ],
      },
    };
  },
  computed: {
    tableReq() {
      return {
        url: "/api/nkgl/v1/qyxx/queryList.do",
        params: [
          {
            vtype: "attr",
            name: "lable",
            data: {
              dataSource: this.formQuery.dataSource,
              creditCode: this.formQuery.creditCode,
              companyName: this.formQuery.companyName,
              startTime: this.formQuery.startTime,
              endTime: this.formQuery.endTime,
              idResult: this.formQuery.idResult,
              callResult: this.formQuery.callResult,
              callStatus: this.formQuery.callStatus,
              addressResult: this.formQuery.addressResult,
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
  created() {
    //初始化查询条件option信息
    this.initQueryOption();
    //获取导出相关数据
    this.initExportData();
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
    async initExportData() {
      let allData = await queryExportParams("dhhcqkxxcx");
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
     * @description 切换弹窗显示状态
     * @param {Boolean} val
     */
    changeIsShowDialog(val) {
      this.customDialog.isShow = val;
      this.exportDialog.isShow = val;
      this.uploadDialog.isShow = val;
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
    /**
     * @description 初始化查询条件option信息
     */
    initQueryOption() {
      this.formItems.data.forEach((item) => {
        this.fillOption(item.prop, item);
      });
    },
    fillOption(prop, item) {
      switch (prop) {
        case "callStatus":
          this.getOption(item, "OutgoingCallStatus", prop);
          break;
        case "callResult":
          this.getOption(item, "PhoneVerificationResult", prop);
          break;
        case "idResult":
          this.getOption(item, "IdVerificationResult", prop);
          break;
        case "addressResult":
          this.getOption(item, "IdVerificationResult", prop);
          break;
      }
    },
    async getOption(item, key, prop) {
      let { data } = await postDicData(key);
      let result = data[0].data;
      item.option = result;
      for (let code in this.dicOptions) {
        if (prop == code) {
          this.dicOptions[code] = result;
        }
      }
      this.$set(this, "formItems", this.formItems);
    },
    //发起外呼
    initiateCallClick() {
      if (this.selectedTableData.length) {
        console.log("发起外呼...");
      } else {
        Message.warning("请先选择要外呼的数据");
      }
    },
    /**
     * @description 操作栏点击事件
     * @param {}
     * @returns {}
     */
    handleRowBtnClick(row, value) {
      let { creditCode } = row;
      this.creditCode = creditCode;
      if (value == "ViewDetail") {
        this.customDialog.isShow = true;
        this.customDialog.title = "详情";
      } else {
        //TUDO
        console.log("行内发起外呼...");
      }
    },
    //外呼结果导入
    callResultImportClick() {
      this.uploadDialog.isShow = true;
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
