<template>
  <div class="content">
    <div class="content-left">
      <div class="project">
        调查项目<fu-select
          size="small"
          v-model="survey"
          placeholder="请选择"
          @change="surveyChange"
        >
          <fu-option
            v-for="item in projectOptions"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          >
          </fu-option>
        </fu-select>
      </div>
      <div class="leftTree">
        <component-tree
          v-loading="treeLoading"
          :isNeedFilter="true"
          ref="expQueryTree"
          treeId="expQueryTree"
          :treeData="treeData"
          :defaultProps="defaultProps"
          :expandNodes="expandNodes"
          @node-click="nodeClick"
        ></component-tree>
      </div>
    </div>
    <div class="content-right">
      <div class="header-operation">
        <fu-button size="mini" type="primary" @click="expediting"
          >催报</fu-button
        >
        <fu-button size="mini" type="primary" plain @click="exportExcel"
          >导出</fu-button
        >
      </div>
      <div class="header-query">
        <common-form-items
          ref="queryExpForm"
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
          ref="expQueryTable"
          tableId="expQueryTable"
          :reqUrl="reqTableUrl"
          :reqParams="reqTableParams"
          :fuColumn="fuColumn"
          :isHasSelection="true"
          :isNeedOperation="true"
          operationWidth="80px"
          @deliverySelection="tableSelection"
        >
          <!-- 转码 -->
          <template slot-scope="scope" slot="oneSlot">
            {{ changeCode(scope.row.urgingState, "urgingOption") }}
          </template>
          <template slot-scope="scope" slot="fillSlot">
            {{ changeCode(scope.row.fillState, "fillStateOption") }}
          </template>
          <template slot-scope="row" slot="one">
            <div class="operateBtns">
              <fu-button @click.stop="rowExpediting(row.data)" type="text"
                ><span class="icon iconfont icon-biaoge_liupeizhi"></span>
                催报</fu-button
              >
            </div>
          </template>
        </component-table>
      </div>
    </div>
    <fu-dialog
      v-if="dialogVisible"
      title="催报"
      top="5vh"
      width="600px"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="dialogClose"
    >
      <fu-form
        ref="expeditingForm"
        :fu-data="expeditingForm"
        :rules="rules"
        label-width="100px"
      >
        <fu-form-item label="类型：" prop="urgingType">
          <fu-radio-group v-model="expeditingForm.urgingType">
            <fu-radio label="手动催报"></fu-radio>
          </fu-radio-group>
        </fu-form-item>
        <fu-form-item label="催报方式：" prop="urgingMethod">
          <fu-select
            style="width: 100%"
            v-model="expeditingForm.urgingMethod"
            placeholder="请选择方式"
            @change="methodChange"
          >
            <fu-option
              v-for="item in urgingMethodOptions"
              :key="item.channelId"
              :label="item.channelName"
              :value="item.channelId"
            >
            </fu-option>
          </fu-select>
        </fu-form-item>
        <fu-form-item label="催报话术：" prop="urgingScript">
          <fu-select
            style="width: 100%"
            v-model="expeditingForm.urgingScript"
            placeholder="请选择话术"
          >
            <fu-option
              v-for="item in urgingScriptOptions"
              :key="item.languageId"
              :label="item.languageName"
              :value="item.languageId"
            >
            </fu-option>
          </fu-select>
        </fu-form-item>
      </fu-form>
      <span slot="footer">
        <fu-button type="primary" @click="submit">确定</fu-button>
        <fu-button @click="dialogClose">取消</fu-button>
      </span>
    </fu-dialog>
  </div>
</template>
<script>
import {
  Button,
  Dialog,
  Message,
  Select,
  Option,
  Form,
  FormItem,
  Radio,
  RadioGroup,
} from "fusion-ui";
import CommonFormItems from "@/components/CommonFormItems";
import ComponentTree from "@/components/CommonTree";
import ComponentTable from "@/components/CommonTable";
import { post, get } from "@/utils/http";
import { queryData } from "@/service/index";
export default {
  name: "ExpeditingProgress",
  components: {
    FuForm: Form,
    FuFormItem: FormItem,
    FuButton: Button,
    FuDialog: Dialog,
    FuSelect: Select,
    FuOption: Option,
    FuRadio: Radio,
    FuRadioGroup: RadioGroup,
    ComponentTree,
    ComponentTable,
    CommonFormItems,
  },
  data() {
    return {
      // 调查项目选项
      projectOptions: [],
      // 调查项目
      survey: "",
      treeLoading: false,
      // 报告期
      bgqOption: [],
      // 左侧树
      treeData: [],
      expandNodes: [],
      defaultProps: {
        children: "children",
        label: "name",
        id: "id",
      },
      // 当前节点id
      nodeId: "",
      // 当前节点是否分类
      isClassify: "",
      // 当前节点数据
      folder: {},
      formData: {
        bgq: "",
        companyName: "",
        creditCode: "",
        fillState: "",
        manageOrg: "",
        urgingState: "",
      },
      queryForm: {
        bgq: "",
        companyName: "",
        creditCode: "",
        fillState: "",
        manageOrg: "",
        urgingState: "",
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
            label: "填报状态",
            prop: "fillState",
            type: "select",
            disabled: false,
            size: "mini",
            placeholder: "",
            option: [],
          },
          {
            label: "催报状态",
            prop: "urgingState",
            type: "select",
            disabled: false,
            size: "mini",
            placeholder: "",
            option: [],
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
            label: "管理机构",
            prop: "manageOrg",
            type: "select-tree",
            disabled: false,
            size: "mini",
            placeholder: "",
            option: [],
            normalData: [],
          },
        ],
        rules: {},
      },
      selections: [],
      // 数据列表
      fuColumn: [
        {
          prop: "reportNumber",
          label: "表号",
          width: "150px",
          align: "center",
          headerAlign: "center",
        },
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
          prop: "manageCode",
          label: "管理机构",
          width: "100px",
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
          prop: "fillState",
          label: "填报状态",
          width: "80px",
          align: "left",
          headerAlign: "center",
          slot: "fillSlot",
        },
        {
          prop: "fillDateStart",
          label: "填报开始时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "fillDateEnd",
          label: "填报截止时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "fillTime",
          label: "填报时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "acceptanceTimeStreet",
          label: "街道验收时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "acceptanceTimeArea",
          label: "区验收时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "acceptanceTimeProvince",
          label: "省级验收时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "urgingMethod",
          label: "催报方式",
          width: "100px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "urgingTime",
          label: "催报时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "urgingState",
          label: "催报状态",
          width: "100px",
          align: "center",
          headerAlign: "center",
          slot: "oneSlot",
        },
        {
          prop: "urgingFrequency",
          label: "催报次数",
          width: "100px",
          align: "center",
          headerAlign: "center",
        },
      ],
      // 催报弹框
      dialogVisible: false,
      expeditingForm: {
        urgingType: "手动催报",
        urgingMethod: "",
        urgingScript: "",
      },
      rules: {
        urgingType: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        urgingMethod: [
          { required: true, message: "请选择催报方式", trigger: "change" },
        ],
        urgingScript: [
          { required: true, message: "请选择催报话术", trigger: "change" },
        ],
      },
      isUrgingOne: true,
      // 催报方式
      urgingMethodOptions: [],
      // 催报话术
      urgingScriptOptions: [],
      // 催报当前行
      selectRow: {},
      urgingOption: [
        {
          text: "未催报",
          value: "0",
        },
        {
          text: "已催报",
          value: "1",
        },
      ],
      fillStateOption: [
        {
          text: "已上报",
          value: "1",
        },
        {
          text: "暂存",
          value: "2",
        },
        {
          text: "未上报",
          value: "0",
        },
      ],
    };
  },
  computed: {
    reqTableUrl() {
      if (!this.nodeId) {
        return "";
      } else {
        return `/api/cbgl/v1/urging/progress/page/condition.do?id=${this.nodeId}&isClassify=${this.isClassify}`;
      }
    },
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
  watch: {
    nodeId: {
      handler(val) {
        get(
          `/api/cbgl/v1/urging/progress/bgqDropDownList.do?id=${val}&isClassify=${this.isClassify}`
        ).then((res) => {
          let bgqOptions = res.data[0].data;
          this.$set(this.formItems.data[4], "option", bgqOptions);
        });
      },
    },
  },
  created() {
    this.initSelect();
    this.$set(this.formItems.data[2], "option", this.fillStateOption);
    this.$set(this.formItems.data[3], "option", this.urgingOption);
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
     * @description 初始化左侧树
     */
    async initTree(val) {
      get(`/api/cbgl/v1/report/classify/queryByItemId.do?itemId=${val}`).then(
        (res) => {
          let tree = res.data[0].data;
          this.treeData = this.transformTozTreeFormat(tree);
          // 默认高亮选中节点
          if (this.treeData.length) {
            this.expandNodes.push(this.treeData[0].id);
            this.nodeClick(this.treeData[0]);
            this.$nextTick(() => {
              this.$refs["expQueryTree"].setCurrentKeyHeightLight(
                this.treeData[0].id
              );
            });
          }
          this.treeLoading = false;
        }
      );
    },
    /**
     * @description 初始化下拉框
     */
    initSelect() {
      get("/api/cbgl/v1/investigationItem/dropDownList.do").then((res) => {
        this.projectOptions = res.data[0].data.rows;
        this.survey = this.projectOptions[0].value;
        this.initTree(this.survey);
      });
      post("/api/cbgl/v1/tdpzgl/queryAllChannel.do", {
        postData: JSON.stringify({
          data: [],
        }),
      }).then((res) => {
        this.urgingMethodOptions = res.data[0].data;
      });
    },
    /**
     * @description 初始化左侧树
     */
    async initManageOrgTree() {
      let treeRes = await queryData("AdministrativeDivision");
      let tree = treeRes.data[0].data;
      this.$set(this.formItems.data[5], "normalData", tree);
      let treeOption = this.transformTozTreeFormat(tree);
      this.$set(this.formItems.data[5], "option", treeOption);
    },
    /**
     * @description 调查项目change事件
     */
    surveyChange(val) {
      this.initTree(val);
    },
    /**
     * @description 催报方式change事件
     */
    methodChange(val) {
      this.expeditingForm.urgingScript = "";
      let param = "";
      this.urgingMethodOptions.forEach((item) => {
        if (item.channelId === val) {
          param = item.channelName;
        }
      });
      post("/api/cbgl/v1/hsgl/queryListByChannel.do", {
        postData: JSON.stringify({
          data: [
            {
              name: "languageMethod",
              vtype: "attr",
              data: param,
            },
          ],
        }),
      }).then((res) => {
        this.urgingScriptOptions = res.data[0].data;
      });
    },
    /**
     * @description 将普通的数组转换为父子结构
     */
    transformTozTreeFormat(sNodes) {
      let i, l;
      let r = [];
      let tmpMap = {};
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i].id] = sNodes[i];
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        let p = tmpMap[sNodes[i].pId];
        if (p && sNodes[i].id != sNodes[i].pId) {
          let children = this.nodeChildren(p);
          if (!children) {
            children = this.nodeChildren(p, []);
          }
          children.push(sNodes[i]);
        } else {
          r.push(sNodes[i]);
        }
      }
      return r;
    },
    nodeChildren(node, newChildren) {
      if (typeof newChildren !== "undefined") {
        node.children = newChildren;
      }
      return node.children;
    },
    updateFormData(val) {
      this.exportFormData = val;
    },

    // 树节点点击事件
    nodeClick(data) {
      this.nodeId = data.id;
      this.isClassify = data.situationId ? false : true;
      this.folder = data;
    },
    /**
     * @description 表单查询
     */
    tableSearch() {
      let getFormData = this.$refs.queryExpForm.formData;
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
      this.$refs.queryExpForm.clearFormData();
      this.queryForm = {
        bgq: "",
        companyName: "",
        creditCode: "",
        fillState: "",
        manageOrg: "",
        urgingState: "",
      };
    },
    tableSelection(val) {
      this.selections = val;
    },
    changeFormItems(data) {
      this.formItems = data;
    },
    /**
     * @description 单条催报
     */
    rowExpediting(row) {
      this.isUrgingOne = true;
      let urgingDate = new Date(row.urgingTime).getTime();
      let nowDate = new Date().getTime();
      let date = (nowDate - urgingDate) / 1000 / 60;
      if (date < 30) {
        Message.warning("30分钟后才可以再次催报");
        return;
      }
      this.selectRow = row;
      this.dialogVisible = true;
    },
    /**
     * @description 多条催报
     */
    expediting() {
      if (this.selections.length === 0) {
        Message.warning("请选择要催报的数据");
        return;
      }
      this.isUrgingOne = false;
      this.dialogVisible = true;
    },
    dialogClose() {
      this.dialogVisible = false;
      this.expeditingForm = {};
    },
    submit() {
      let params = [];
      if (this.isUrgingOne) {
        params.push(this.selectRow);
      } else {
        params = this.selections;
      }
      let scriptParams = {},
        chanelParams = {};
      this.urgingScriptOptions.forEach((item) => {
        if (item.languageId === this.expeditingForm.urgingScript) {
          scriptParams = item;
        }
      });
      this.urgingMethodOptions.forEach((item) => {
        if (item.channelId === this.expeditingForm.urgingMethod) {
          chanelParams = item;
        }
      });
      post("/api/cbgl/v1/urging/progress/reminder.do", {
        postData: JSON.stringify({
          data: [
            {
              data: {
                chanelId: this.expeditingForm.urgingMethod,
                wordsId: this.expeditingForm.urgingScript,
                urgingMethod: chanelParams.channelType,
                words: scriptParams.languageName,
                chanelName: chanelParams.channelName,
              },
              name: "formpanel",
              vtype: "formpanel",
            },
            {
              data: params,
              name: "params",
              vtype: "attr",
            },
          ],
        }),
      })
        .then((res) => {
          this.$refs["expQueryTable"].reloadTable();
          Message.success("催报成功");
          this.dialogClose();
        })
        .catch((err) => {
          let response = JSON.parse(err.response);
          Message.error(`催报失败，${response.data}`);
          this.dialogClose();
        });
    },
    /**
     * @description 导出
     */
    exportExcel() {
      window.open(
        `/api/cbgl/v1/urging/progress/export.do?id=${this.nodeId}&isClassify=${this.isClassify}&bgq=${this.queryForm.bgq}&companyName=${this.queryForm.companyName}&creditCode=${this.queryForm.creditCode}&fillState=${this.queryForm.fillState}&manageOrg=${this.queryForm.manageOrg}&urgingState=${this.queryForm.urgingState}`
      );
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  display: flex;
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
  .content-left {
    width: 300px;
    border: 1px solid #ccc;
    .project {
      text-align: center;
      margin-top: 10px;
    }
    .leftTree {
      height: calc(100% - 50px);
    }
  }
  .content-right {
    width: calc(100% - 300px);
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-left: none;
  }
  .header-operation {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    padding-left: 10px;
  }
  .header-query {
    padding: 10px;
  }
  .data-list {
    padding: 10px;
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
