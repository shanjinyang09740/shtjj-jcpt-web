<template>
  <div class="content">
    <div class="header-operation">
      <fu-button size="mini" type="primary" plain @click="exportExcel"
        >导出</fu-button
      >
    </div>
    <div class="header-query">
      <common-form-items
        ref="queryMesForm"
        :FormItems="formItems"
        :FormData="formData"
        @changeFormItems="changeFormItems"
      ></common-form-items>
      <div class="queryBtn">
        <fu-button size="mini" type="success" @click="tableSearch"
          >查询</fu-button
        >
        <fu-button size="mini" type="primary" @click="resetForm"
          >重置</fu-button
        >
      </div>
    </div>
    <div class="data-list">
      <component-table
        row-key="id"
        ref="mesQueryTable"
        tableId="mesQueryTable"
        :reqUrl="reqTableUrl"
        :reqParams="reqTableParams"
        :fuColumn="fuColumn"
        :isHasSelection="false"
        :isNeedOperation="false"
      >
        <!-- 转码 -->
        <template slot-scope="scope" slot="isSendSlot">
          {{ changeCode(scope.row.isSend, "isSendOption") }}
        </template>
        <template slot-scope="row" slot="one">
          <div class="operateBtns">
            <fu-button @click.stop="rowExpediting(row.data)" type="text"
              ><span class="icon iconfont icon-biaoge_xiangqing"></span>
              催报</fu-button
            >
          </div>
        </template>
      </component-table>
    </div>
  </div>
</template>
<script>
import { Button, Message } from "fusion-ui";
import CommonFormItems from "@/components/CommonFormItems";
import ComponentTable from "@/components/CommonTable";
import { post, get } from "@/utils/http";
import { queryData } from "@/service/index";
export default {
  name: "sampleQuery",
  components: {
    FuButton: Button,
    ComponentTable,
    CommonFormItems,
  },
  data() {
    return {
      reqTableUrl: "/api/cbgl/v1/notification/page/condition.do",
      options: [],
      // 调查项目
      survey: "",
      // 报告期
      bgqOption: [],
      formData: {
        bgq: "",
        companyName: "",
        creditCode: "",
        isSend: "",
        reportName: "",
        reportNumber: "",
        type: "",
      },
      queryForm: {
        bgq: "",
        companyName: "",
        creditCode: "",
        isSend: "",
        reportName: "",
        reportNumber: "",
        type: "",
      },
      formItems: {
        labelWidth: "125px",
        name: "baseForm",
        data: [
          {
            label: "统一社会信用代码",
            prop: "creditCode",
            type: "input",
            disabled: false,
            placeholder: "",
            size: "mini",
          },
          {
            label: "单位详细名称",
            prop: "companyName",
            type: "input",
            disabled: false,
            placeholder: "",
            size: "mini",
          },
          {
            label: "表名",
            prop: "reportName",
            type: "input",
            disabled: false,
            placeholder: "",
            size: "mini",
          },
          {
            label: "表号",
            prop: "reportNumber",
            type: "input",
            disabled: false,
            placeholder: "",
            size: "mini",
          },
          {
            label: "报告期",
            prop: "bgq",
            type: "select",
            disabled: false,
            size: "mini",
            placeholder: "",
            option: [],
          },
          {
            label: "类型",
            prop: "type",
            type: "select",
            disabled: false,
            size: "mini",
            placeholder: "",
            option: [],
          },
          {
            label: "消息是否下发",
            prop: "isSend",
            type: "select",
            disabled: false,
            size: "mini",
            placeholder: "",
            option: [],
          },
        ],
        rules: {},
      },
      selectionIds: [],
      // 数据列表
      fuColumn: [
        {
          prop: "creditCode",
          label: "统一社会信用代码",
          width: "180px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "orgCode",
          label: "组织机构代码",
          width: "130px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "companyName",
          label: "单位详细名称",
          width: "180px",
          align: "left",
          headerAlign: "center",
        },
        {
          prop: "reportName",
          label: "表名",
          width: "150px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "reportNumber",
          label: "表号",
          width: "150px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "bgq",
          label: "报告期",
          width: "150px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "markName",
          label: "标记名称",
          width: "80px",
          align: "left",
          headerAlign: "center",
        },
        {
          prop: "type",
          label: "类型",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "chanelName",
          label: "通知方式",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "words",
          label: "话术",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "isSend",
          label: "消息是否下发",
          width: "110px",
          align: "center",
          headerAlign: "center",
          slot: "isSendSlot",
        },
        {
          prop: "sendTime",
          label: "消息下发时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
      ],
      isSendOption: [
        {
          text: "是",
          value: "1",
        },
        {
          text: "否",
          value: "0",
        },
      ],
    };
  },
  computed: {
    reqTableParams() {
      return [
        {
          data: this.queryForm,
          name: "formpanel",
          vtype: "formpanel",
        },
      ];
    },
  },
  created() {
    this.initSelect();
    this.$set(this.formItems.data[6], "option", this.isSendOption);
  },
  methods: {
    changeCode(val, option) {
      let text = val;
      this[option].forEach((item) => {
        if (item.value === val) {
          text = item.text;
        }
      });
      return text;
    },
    /**
     * @description 初始化下拉框
     */
    async initSelect() {
      get("/api/cbgl/v1/notification/bgqDropDownList.do").then((re) => {
        let data = re.data[0].data;
        this.$set(this.formItems.data[4], "options", data);
      });
      let res = await queryData("NotificationType");
      this.$set(this.formItems.data[5], "option", res);
    },
    updateFormData(val) {
      this.exportFormData = val;
    },
    /**
     * @description 表单查询
     */
    tableSearch() {
      let getFormData = this.$refs.queryMesForm.formData;
      let newObj = {};
      for (let key in getFormData) {
        let _value = getFormData[key];
        if (Array.isArray(_value)) {
          newObj[key] = _value.length ? _value.join(",") : "";
        } else {
          newObj[key] = _value;
        }
      }
      this.queryForm = { ...newObj };
    },
    /**
     * @description 表单重置
     */
    resetForm() {
      this.$refs.queryMesForm.clearFormData();
      this.queryForm = {
        bgq: "",
        companyName: "",
        creditCode: "",
        isSend: "",
        reportName: "",
        reportNumber: "",
        type: "",
      };
    },
    changeFormItems(data) {
      this.formItems = data;
    },
    /**
     * @description 导出
     */
    exportExcel() {
      window.open(
        `/api/cbgl/v1/notification/export.do?bgq=${this.queryForm.bgq}&companyName=${this.queryForm.companyName}&creditCode=${this.queryForm.creditCode}&isSend=${this.queryForm.isSend}&reportName=${this.queryForm.reportName}&reportNumber=${this.queryForm.reportNumber}&type=${this.queryForm.type}`
      );
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  height: calc(100% - 20px);
  .header-operation {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
  }
  .header-query {
    padding: 10px 20px;
  }
  .data-list {
    .list-header {
      height: 50px;
      line-height: 50px;
      background-color: #f3f3f3;
      padding-left: 20px;
    }
  }
}
.queryBtn {
  text-align: center;
}
.underline {
  text-decoration: underline;
}
</style>
