<template>
  <div class="contain">
    <div class="header">
      <fu-button type="primary" size="mini" @click="createRulesClick"
        >新建规则</fu-button
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
    <component-table
      row-key="id"
      ref="urgeQueryTable"
      tableId="urgeQueryTable"
      :reqUrl="reqTableUrl"
      :reqParams="reqTableParams"
      :fuColumn="fuColumn"
      :staticTableData="staticTableData"
      :isHasSelection="true"
      :isNeedOperation="true"
      :operationWidth="'150'"
      :dynamicSlotName="'operate'"
    >
      <template slot-scope="scope" slot="ruleState">
        <fu-switch
          v-model="scope.row.ruleState"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="0"
          active-text="启用"
          inactive-text="停用"
          @change="changeRuleState(scope.row)"
        >
        </fu-switch>
      </template>
      <template slot-scope="scope" slot="urgingMethod">
        {{ changeCode(scope.row.urgingMethod, "urgingMethod") }}
      </template>
      <template slot-scope="scope" slot="wordsId">
        {{ changeCode(scope.row.wordsId, "wordsId") }}
      </template>
      <template slot-scope="row" slot="operate">
        <div class="operateBtns">
          <span
            v-for="(item, index) in tableOperateBtnGroup"
            :key="index"
            @click.stop="handleRowBtnClick(row.data, item.value)"
          >
            <img :src="item.imgPath" />
            <span>{{ item.text }}</span>
          </span>
        </div>
      </template>
    </component-table>
    <custom-dialog
      v-if="customDialog.isShow"
      :isShowDialog="customDialog.isShow"
      :isShowOperation="false"
      :title="customDialog.title"
      :width="'70%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
      <div slot="body">
        <edit-urge-rules
          :isEdit="isEdit"
          :postFormData="postFormData"
          @afrashTableData="afrashTableData"
          @changeIsShowDialog="changeIsShowDialog"
        ></edit-urge-rules>
      </div>
    </custom-dialog>
  </div>
</template>

<script>
import { Button, Switch, Message, MessageBox } from "fusion-ui";
import CommonFormItems from "@/components/CommonFormItems";
import CustomDialog from "@/components/CommonDialog";
import ComponentTable from "@/components/CommonTable";
import { FormItems } from "./FormItems";
import EditUrgeRules from "./components/EditUrgeRules";
import http from "@/utils/http";

export default {
  name: "UrgeRulesManage",
  components: {
    FuButton: Button,
    FuSwitch: Switch,
    CommonFormItems,
    CustomDialog,
    ComponentTable,
    EditUrgeRules,
  },
  props: {},
  data() {
    return {
      formItems: { ...FormItems },
      formData: {
        ruleName: "",
        urgingMethod: "",
        ruleState: "",
      },
      queryFormData: {},
      postFormData: {},
      //是否编辑
      isEdit: false,
      //详情弹窗
      customDialog: {
        isShow: false,
        title: "",
        compType: "",
      },
      creditCode: "",
      //已选中行
      selectedTableData: [],
      //当前选中该行
      currentRowdata: {},
      staticTableData: {
        rows: [],
      },
      //表格操作列显示按钮类型
      tableOperateBtnGroup: [
        {
          text: "编辑",
          value: "edit",
          imgPath: require("@/assets/images/table/view-detail.svg"),
        },
        {
          text: "删除",
          value: "delete",
          imgPath: require("@/assets/images/table/assign-code.svg"),
        },
      ],
      //字典项集合
      dicOptions: {
        urgingMethod: [],
        wordsId: [],
      },
    };
  },
  computed: {
    reqTableUrl() {
      return "/api/cbgl/v1/notification/urgingRule/page/condition.do";
    },
    reqTableParams() {
      return [
        {
          data: {
            urgingMethod: this.queryFormData.urgingMethod,
            ruleName: this.queryFormData.ruleName,
            ruleState: this.queryFormData.ruleState,
          },
          name: "formpanel",
          vtype: "formpanel",
        },
      ];
    },
    // 数据列表
    fuColumn() {
      return [
        {
          label: "催报规则名称",
          prop: "ruleName",
          width: "150",
          align: "left",
        },
        {
          label: "催报规则描述",
          prop: "ruleDesc",
          width: "200",
          align: "left",
        },
        {
          label: "催报方式",
          prop: "urgingMethod",
          width: "150",
          align: "left",
          slot: "urgingMethod",
        },
        {
          label: "催报话术",
          prop: "wordsId",
          width: "120",
          align: "left",
          slot: "wordsId",
        },
        {
          label: "催报规则状态",
          prop: "ruleState",
          width: "100",
          align: "left",
          slot: "ruleState",
        },
        {
          label: "最近一次执行时间",
          prop: "lastExecutionTime",
          width: "100",
          align: "left",
        },
      ];
    },
  },
  watch: {},
  beforeCreate() {},
  created() {
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
    changeRuleState(row) {
      let postData = {
        data: [
          {
            data: {
              ...row,
            },
            name: "formpanel",
            vtype: "formpanel",
          },
          {
            name: "reportIds",
            vtype: "attr",
            data: row.reportIds ? row.reportIds.split(",") : [],
          },
        ],
      };

      http
        .post("/api/cbgl/v1/notification/urgingRule/updateRule.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          if (res.message == "success") {
            Message.success("更新成功");
            //刷新表格
            this.afrashTableData();
          }
        })
        .catch((err) => {
          Message.error(`更新失败!，${err.errorMessage}`);
        });
    },
    //获取字典项数据
    getDicOptions() {
      //获取催报方式
      this.getUrgeMethodsOption();
    },
    //获取催报方式
    getUrgeMethodsOption() {
      http.post("/api/cbgl/v1/tdpzgl/queryAllChannel.do").then((res) => {
        let result = res.data[0].data;
        if (result && result.length) {
          result = result.map((item) => {
            return {
              ...item,
              text: item.channelName,
              value: item.channelName,
            };
          });
          this.dicOptions.urgingMethod = result;
          result.forEach((item) => {
            this.getWordsIdOption(item.value);
          });
          this.formItems.data.some((item) => {
            if (item.prop == "urgingMethod") {
              item.option = result;
              return true;
            }
          });
        }
      });
    },
    //获取催报话术
    getWordsIdOption(val) {
      http
        .post("/api/cbgl/v1/hsgl/queryListByChannel.do", {
          postData: JSON.stringify({
            data: [
              {
                name: "languageMethod",
                vtype: "attr",
                data: val,
              },
            ],
          }),
        })
        .then((res) => {
          let resultData = res.data[0].data;
          resultData = resultData.map((item) => {
            return {
              ...item,
              text: item.languageName,
              value: item.languageId,
            };
          });
          resultData.forEach((item) => {
            let languageId = item.languageId;
            if (this.dicOptions.wordsId.length) {
              let flag = true;
              this.dicOptions.wordsId.some((ite) => {
                if (languageId == ite.languageId) {
                  flag = false;
                  return true;
                }
              });
              if (flag) {
                this.dicOptions.wordsId.push(item);
              }
            } else {
              this.dicOptions.wordsId.push(item);
            }
          });
        });
    },
    /**
     * @description  转码
     */
    changeCode(val, type) {
      let newVal = "";
      if (this.dicOptions[type]) {
        this.dicOptions[type].some((item) => {
          if (val == item.value) {
            newVal = item.text;
            return true;
          }
        });
      }
      return newVal;
    },
    /**
     * @description  新建规则
     */
    createRulesClick() {
      this.isEdit = false;
      this.customDialog.isShow = true;
    },
    /**
     * @description 表格操作栏点击事件
     * @param {}
     * @returns {}
     */
    handleRowBtnClick(row, value) {
      if (value == "edit") {
        http
          .post(
            `/api/cbgl/v1/notification/urgingRule/queryRule/${row.ruleId}.do`
          )
          .then((res) => {
            let resData = res.data;
            let result = {},
              reportIdsArr = [];
            if (resData) {
              resData.forEach((item) => {
                if (item.name == "form") {
                  result = item.data;
                } else {
                  reportIdsArr = item.data;
                }
              });
            }
            let newObj = {
              ruleName: result.ruleName,
              ruleDesc: result.ruleDesc,
              rule: result.rule,
              urgingMethod: result.urgingMethod,
              ruleState: result.ruleState,
              wordsId: result.wordsId,
              whiteCreditCodes: result.whiteCreditCodes,
              surveyItemId: result.surveyItemId,
              chanelId: result.chanelId,
              reportIds: reportIdsArr,
              ruleId: row.ruleId,
            };
            if (result.rule) {
              let ruleArr = result.rule.split(",");
              this.postFormData = {
                ...newObj,
                ruleTime: ruleArr[0],
                ruleMd: ruleArr[1],
                ruleHour: ruleArr[2],
              };
            } else {
              this.postFormData = {
                ...newObj,
                ruleTime: "",
                ruleMd: "",
                ruleHour: "",
              };
            }
            this.customDialog.isShow = true;
            this.customDialog.title = "编辑催报规则";
            this.isEdit = true;
          });
      } else if (value == "delete") {
        MessageBox.confirm("此操作将删除该条记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            http
              .post(
                `/api/cbgl/v1/notification/urgingRule/remove/${row.ruleId}.do`
              )
              .then((res) => {
                if (res.message == "success") {
                  Message.success("删除成功");
                  //刷新表格
                  this.afrashTableData();
                }
              })
              .catch((err) => {
                Message.error(`删除失败!，${err.errorMessage}`);
              });
          })
          .catch(() => {});
      }
    },
    /**
     * @description  刷新表格数据
     */
    afrashTableData() {
      this.$refs.urgeQueryTable.reloadTable();
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
    /**
     * @description 表单查询事件
     */
    tableSearch() {
      let getFormData = this.$refs.commonForm.formData;
      this.queryFormData = { ...getFormData };
    },
    /**
     * @description 重置查询条件
     */
    resetSearch() {
      this.$refs.commonForm.clearFormData();
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
    display: flex;
    align-items: center;
    .contain {
      display: flex;
      width: 80%;
    }
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
