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
            :label="item.label"
            :value="item.value"
          >
          </fu-option>
        </fu-select>
      </div>
      <div class="leftTree">
        <component-tree
          v-loading="treeLoading"
          :isNeedFilter="true"
          ref="repQueryTree"
          treeId="repQueryTree"
          :treeData="treeData"
          :defaultProps="defaultProps"
          :expandNodes="expandNodes"
          @node-click="nodeClick"
        ></component-tree>
      </div>
    </div>
    <div class="content-right">
      <div class="header-query">
        <common-form-items
          ref="queryRepForm"
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
          ref="repQueryTable"
          tableId="repQueryTable"
          :reqUrl="reqTableUrl"
          :reqParams="reqTableParams"
          :fuColumn="fuColumn"
          :isHasSelection="true"
          :isNeedOperation="false"
          @deliverySelection="tableSelection"
        >
          <!-- 转码 -->
          <!-- <template slot-scope="scope" slot="oneSlot">
            {{ changeCode(scope.row.industryCode) }}
          </template> -->
        </component-table>
      </div>
    </div>
  </div>
</template>
<script>
import { Button, Select, Option } from "fusion-ui";
import CommonFormItems from "@/components/CommonFormItems";
import ComponentTree from "@/components/CommonTree";
import ComponentTable from "@/components/CommonTable";
import { get } from "@/utils/http";
export default {
  name: "sampleQuery",
  components: {
    FuButton: Button,
    FuSelect: Select,
    FuOption: Option,
    ComponentTree,
    ComponentTable,
    CommonFormItems,
  },
  data() {
    return {
      projectOptions: [],
      // 调查项目
      survey: "",
      treeLoading: false,
      // 行政区划代码
      administrativeDivision: "",
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
        fillTimeStart1: "",
        fillTimeStart2: "",
        fillTimeEnd1: "",
        fillTimeEnd2: "",
        acceptanceTimeStreet1: "",
        acceptanceTimeStreet2: "",
        acceptanceTimeArea1: "",
        acceptanceTimeArea2: "",
        acceptanceTimeProvince1: "",
        acceptanceTimeProvince2: "",
      },
      queryForm: {
        bgq: "",
        fillTimeStart1: "",
        fillTimeStart2: "",
        fillTimeEnd1: "",
        fillTimeEnd2: "",
        acceptanceTimeStreet1: "",
        acceptanceTimeStreet2: "",
        acceptanceTimeArea1: "",
        acceptanceTimeArea2: "",
        acceptanceTimeProvince1: "",
        acceptanceTimeProvince2: "",
      },
      formItems: {
        labelWidth: "125px",
        name: "baseForm",
        data: [
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
            label: "填报开始时间",
            prop: "fillTimeStart",
            modelDataStartKey: "fillTimeStart1",
            modelDataEndKey: "fillTimeStart2",
            type: "date-picker-double",
            disabled: false,
            placeholder: "",
            size: "mini",
          },
          {
            label: "填报截止时间",
            prop: "fillTimeEnd",
            modelDataStartKey: "fillTimeEnd1",
            modelDataEndKey: "fillTimeEnd2",
            type: "date-picker-double",
            disabled: false,
            placeholder: "",
            size: "mini",
          },
          {
            label: "街道验收开始时间",
            prop: "acceptanceTimeStreet",
            modelDataStartKey: "acceptanceTimeStreet1",
            modelDataEndKey: "acceptanceTimeStreet2",
            type: "date-picker-double",
            disabled: false,
            placeholder: "",
            size: "mini",
          },
          {
            label: "区验收开始时间",
            prop: "acceptanceTimeArea",
            modelDataStartKey: "acceptanceTimeArea1",
            modelDataEndKey: "acceptanceTimeArea2",
            type: "date-picker-double",
            disabled: false,
            placeholder: "",
            size: "mini",
          },
          {
            label: "省级验收开始时间",
            prop: "acceptanceTimeProvince",
            modelDataStartKey: "acceptanceTimeProvince1",
            modelDataEndKey: "acceptanceTimeProvince2",
            type: "date-picker-double",
            disabled: false,
            placeholder: "",
            size: "mini",
          },
        ],
        rules: {},
      },
      selectionIds: [],
      // 数据列表
      fuColumn: [
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
          prop: "fillDateStart",
          label: "填报开始时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "fillDateEnd",
          label: "填报截至时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "acceptanceTimeStreet",
          label: "街道验收开始时间",
          width: "120px",
          align: "center",
          headerAlign: "center",
          slot: "oneSlot",
        },
        {
          prop: "acceptanceTimeArea",
          label: "区验收开始时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "acceptanceTimeProvince",
          label: "省级验收开始时间",
          width: "120px",
          align: "center",
          headerAlign: "center",
        },
      ],

      // 催报弹框
      dialogVisible: false,
      expeditingForm: {},
      rules: [],
    };
  },
  computed: {
    reqTableUrl() {
      if (!this.nodeId) {
        return "";
      } else {
        return `/api/cbgl/v1/report/situation/page/condition.do?id=${this.nodeId}&isClassify=${this.isClassify}`;
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
          `/api/cbgl/v1/report/situation/bgqDropDownList.do?id=${val}&isClassify=${this.isClassify}`
        ).then((res) => {
          let bgqOptions = res.data[0].data;
          this.$set(this.formItems.data[0], "option", bgqOptions);
        });
      },
    },
  },
  created() {
    this.initSelect();
  },
  methods: {
    /**
     * @description 调查项目change事件
     */
    surveyChange(val) {
      this.initTree(val);
    },
    changeCode(val) {
      let text = val;
      // this.industryCode.forEach((item) => {
      //   if (item.value === val) {
      //     text = item.text;
      //   }
      // });
      return text;
    },
    /**
     * @description 初始化左侧树
     */
    async initTree(val) {
      get(
        `/api/cbgl/v1/report/classify/queryByItemId/custom.do?itemId=${val}`
      ).then((res) => {
        let tree = res.data[0].data;
        this.treeData = this.transformTozTreeFormat(tree);
        // 默认高亮选中节点
        if (this.treeData.length) {
          this.expandNodes.push(this.treeData[0].id);
          this.nodeClick(this.treeData[0]);
          this.$nextTick(() => {
            this.$refs["repQueryTree"].setCurrentKeyHeightLight(
              this.treeData[0].id
            );
          });
        }
        this.treeLoading = false;
      });
    },
    /**
     * @description 初始化下拉框
     */
    async initSelect() {
      get("/api/cbgl/v1/investigationItem/dropDownList.do").then((res) => {
        this.projectOptions = res.data[0].data.rows;
        this.survey = this.projectOptions[0].value;
        this.initTree(this.survey);
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
      let getFormData = this.$refs.queryRepForm.formData;
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
      this.$refs.queryRepForm.clearFormData();
      this.queryForm = {
        bgq: "报告期",
        fillTimeStart1: "填报开始时间1",
        fillTimeStart2: "填报开始时间2",
        fillTimeEnd1: "填报结束时间1",
        fillTimeEnd2: "填报结束时间2",
        acceptanceTimeStreet1: "街道验收时间1",
        acceptanceTimeStreet2: "街道验收时间2",
        acceptanceTimeArea1: "区验收时间1",
        acceptanceTimeArea2: "区验收时间2",
        acceptanceTimeProvince1: "省验收时间1",
        acceptanceTimeProvince2: "省验收时间2",
      };
    },
    tableSelection(val) {
      this.selectionIds = val.map((item) => {
        return item.ybkId;
      });
    },
    changeFormItems(data) {
      this.formItems = data;
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
