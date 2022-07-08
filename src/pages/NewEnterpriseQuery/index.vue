<template>
  <div class="content">
    <div class="header-operation">
      <fu-button size="mini" type="primary" plain @click="exportExcel"
        >导出</fu-button
      >
    </div>
    <div class="header-query">
      <advanced-query
        :columns="queryColumns"
        :showTopResetButton="true"
        :hideAdvancedQuery="true"
        @search="tableSearch"
        @resetFormAfter="
          () => {
            this.queryForm = {};
          }
        "
        size="mini"
      ></advanced-query>
    </div>
    <div class="data-list">
      <component-table
        row-key="id"
        tableId="enterpriseTable"
        :reqUrl="reqTableUrl"
        :reqParams="reqTableParams"
        :fuColumn="fuColumn"
        :isHasSelection="true"
        operationWidth="75px"
      >
        <template slot-scope="row" slot="one">
          <div class="operateBtns">
            <fu-button @click.stop="detail(row.data)" type="text"
              ><span class="icon iconfont icon-biaoge_xiangqing"></span>
              详情</fu-button
            >
          </div>
        </template>
      </component-table>
    </div>
    <fu-dialog
      :modal-append-to-body="false"
      title="详情"
      :visible.sync="dialogVisible"
      width="70%"
      top="2vh"
    >
      <merge-cell-table
        tableId="detailTable"
        :tableReq="tableReq"
        :fuColumn="tableColumn"
        maxHeight="600px"
      ></merge-cell-table>
      <span slot="footer" class="dialog-footer">
        <fu-button @click="dialogVisible = false">关 闭</fu-button>
      </span>
    </fu-dialog>
    <fu-dialog
      :modal-append-to-body="false"
      title="导出"
      :visible.sync="exportDialogVisible"
      width="50%"
    >
      <export-table
        :formItems="exportFormItems"
        :formData="exportFormData"
        @updateFormData="updateFormData"
      ></export-table>
      <span slot="footer" class="dialog-footer">
        <fu-button type="primary" @click="confirm">确 定</fu-button>
        <fu-button @click="exportDialogVisible = false">取 消</fu-button>
      </span>
    </fu-dialog>
  </div>
</template>
<script>
import { Button, Dialog, Message } from "fusion-ui";
import AdvancedQuery from "@/components/AdvancedQuery";
import MergeCellTable from "@/components/MergeCellTable";
import ComponentTable from "@/components/CommonTable";
import ExportTable from "@/components/ExportTable";

import {
  queryData,
  queryExportParams,
  queryExportParamsCh,
} from "@/service/index";
export default {
  name: "Enterprise",
  components: {
    FuButton: Button,
    FuDialog: Dialog,
    ComponentTable,
    AdvancedQuery,
    MergeCellTable,
    ExportTable,
  },
  data() {
    return {
      // 查询表单
      queryColumns: [
        {
          label: "数据来源",
          modelDataKey: "dataSource",
          type: "input",
          labelWidth: "80px",
          defaultValue: "",
          isSearchShow: true,
        },
        {
          label: "统一社会信用代码",
          modelDataKey: "creditCode",
          type: "input",
          labelWidth: "128px",
          defaultValue: "",
          isSearchShow: true,
        },
        {
          label: "单位详细名称",
          modelDataKey: "companyName",
          type: "input",
          labelWidth: "98px",
          defaultValue: "",
          isSearchShow: true,
        },
        {
          label: "更新时间",
          labelWidth: "68px",
          type: "date-picker", //日期组件
          isSearchShow: true,
          modelDataStartKey: "startTime", //开始日期对应key值
          modelDataEndKey: "endTime", //结束日期对应key值
        },
      ],
      queryForm: {
        dataSource: "",
        creditCode: "",
        companyName: "",
        startTime: "",
        endTime: "",
      },
      // 数据列表
      reqTableUrl: "/api/nkgl/v1/qyxx/queryList.do",
      fuColumn: [
        {
          prop: "dataSource",
          label: "数据来源",
          width: "80px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "creditCode",
          label: "统一社会信用代码",
          width: "140px",
          align: "center",
          headerAlign: "center",
          sortable: true,
        },
        {
          prop: "statGroupAlias",
          label: "组织机构代码",
          width: "110px",
          align: "center",
          headerAlign: "center",
          sortable: true,
        },
        {
          prop: "companyName",
          label: "单位详细名称",
          width: "110px",
          align: "left",
          headerAlign: "center",
        },
        {
          prop: "legalPerson",
          label: "法定代表人",
          width: "100px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "detailedAddress",
          label: "详细地址",
          width: "200px",
          align: "left",
          headerAlign: "center",
        },
        {
          prop: "areaCode",
          label: "长途区号",
          width: "80px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "fixedPhone",
          label: "固定电话",
          width: "80px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "updateTime",
          label: "更新时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
      ],
      dialogVisible: false,
      exportDialogVisible: false,
      // 查询详情id
      detailId: "",
      tableColumn: [
        {
          prop: "fzData",
          label: "分组",
          headerAlign: "center",
        },
        {
          prop: "zbData",
          label: "指标",
          headerAlign: "center",
        },
        {
          prop: "mlData",
          label: "名录数据",
          headerAlign: "center",
        },
      ],
      //导出相关
      exportFormData: {
        formate: "xlsx",
        codes: [],
      },
      // 导出列表
      generateData: [],
      // 导出格式
      exportFormat: [],
    };
  },
  computed: {
    reqTableParams() {
      return [
        {
          vtype: "attr",
          name: "lable",
          data: this.queryForm,
        },
        {
          vtype: "pagination",
          name: "queryType",
          data: "dataOnly",
        },
      ];
    },
    exportFormItems() {
      return [
        {
          label: "导出格式",
          prop: "formate",
          type: "select",
          disabled: false,
          placeholder: "请选择",
          size: "medium",
          option: this.exportFormat,
        },
        {
          label: "导出字段",
          prop: "codes",
          type: "transfer",
          disabled: false,
          size: "medium",
          placeholder: "",
          option: this.generateData,
        },
      ];
    },
    tableReq() {
      return {
        url: "/api/nkgl/v1/qyxx/queryTyxyById.do",
        params: [
          {
            vtype: "attr",
            name: "id",
            data: this.detailId,
          },
        ],
      };
    },
  },
  async created() {
    let res = await queryData("ExportFormat");
    this.exportFormat = res.data[0].data;
    this.$set(this.exportFormData, "formate", this.exportFormat[0].value);
    this.getExportList();
  },
  methods: {
    /**
     * @description 获取导出列表信息
     */
    async getExportList() {
      let result = await queryExportParams("xzzcqyxxcx");
      let exportAllList = result.data[0].data;
      let exportDefultList = result.data[1].data;
      let val = await queryExportParamsCh();
      let list = val.data[0].data;
      let exportAllListCh = exportAllList.map((item) => {
        let data = list.filter((i) => {
          return i.zbcode === item;
        });
        if (data.length) {
          return data[0].zbname;
        } else {
          return item;
        }
      });
      this.generateData = [];
      exportAllListCh.forEach((param, index) => {
        this.generateData.push({
          label: param,
          key: index,
          pinyin: exportAllList[index],
        });
      });
      exportAllList.forEach((param, index) => {
        if (exportDefultList.includes(param)) {
          this.exportFormData.codes.push(index);
        }
      });
    },
    updateFormData(val) {
      this.exportFormData = val;
    },
    /**
     * @description 表单查询
     */
    tableSearch(form) {
      this.queryForm = JSON.parse(JSON.stringify(form));
    },
    /**
     * @description 导出
     */
    exportExcel() {
      this.exportDialogVisible = true;
    },
    confirm() {
      let data = [];
      this.generateData.forEach((item) => {
        if (this.exportFormData.codes.includes(item.key)) {
          data.push(item.pinyin);
        }
      });
      window.open(
        `/api/nkgl/v1/qyxx/exportExcelQyxx.do?tableHead=${JSON.stringify(
          data
        )}&fileType=${this.exportFormData.formate}&dataSource=${
          this.queryForm.dataSource
        }&creditCode=${this.queryForm.creditCode}&companyName=${
          this.queryForm.companyName
        }&startTime=${this.queryForm.startTime}&endTime=${
          this.queryForm.endTime
        }`
      );
    },
    /**
     * @description 详情
     */
    detail(row) {
      this.detailId = row.creditCode;
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  .header-operation {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
  }
  .header-query {
    width: 100%;
    padding: 10px;
  }
  .data-list {
    .list-header {
      height: 50px;
      line-height: 50px;
      background-color: #f3f3f3;
      padding-left: 20px;
    }
  }
  .el-table .operateBtns .iconfont {
    margin-right: 3px;
  }
}
</style>
