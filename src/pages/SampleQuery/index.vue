<template>
  <div class="content">
    <div class="content-left">
      <component-tree
        v-loading="treeLoading"
        :isNeedFilter="true"
        ref="sampleQueryTree"
        treeId="sampleQueryTree"
        :treeData="treeData"
        :defaultProps="defaultProps"
        :expandNodes="expandNodes"
        @node-click="nodeClick"
      ></component-tree>
    </div>
    <div class="content-right">
      <div class="header-operation">
        <fu-button size="mini" type="primary" plain @click="importGroup"
          >导入</fu-button
        >
        <fu-button size="mini" type="primary" plain @click="exportExcel"
          >导出</fu-button
        >
        <fu-button size="mini" type="success" @click="highLevelScreen"
          >高级筛选</fu-button
        >
        <fu-button size="mini" type="primary" @click="addCyk"
          >加入抽样库</fu-button
        >
      </div>
      <div class="header-query">
        <common-form-items
          ref="querySampleForm"
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
          ref="sampleQueryTable"
          tableId="sampleQueryTable"
          :reqUrl="reqTableUrl"
          :reqParams="reqTableParams"
          :fuColumn="fuColumn"
          :isHasSelection="true"
          :isNeedOperation="false"
          @deliverySelection="tableSelection"
        >
          <template slot-scope="scope" slot="oneSlot">
            {{ changeCode(scope.row.industryCode) }}
          </template>
        </component-table>
      </div>
    </div>
    <fu-dialog
      :modal-append-to-body="false"
      title="高级筛选"
      :visible.sync="dialogVisible"
      width="70%"
    >
      <highlevelCondition
        ref="condition"
        :conditionOptions="reqcolumn"
      ></highlevelCondition>
      <span slot="footer" class="dialog-footer">
        <fu-button type="primary" @click="getCondition">确 定</fu-button>
        <fu-button @click="dialogVisible = false">取 消</fu-button>
      </span>
    </fu-dialog>
    <fu-dialog
      v-if="isShowUpload"
      title="导入"
      top="5vh"
      width="400px"
      :visible.sync="isShowUpload"
      :close-on-click-modal="false"
      :append-to-body="true"
      @close="closeUpload"
    >
      <div>
        1.请下载
        <fu-button class="underline" type="text" @click="downloadModel"
          >模板</fu-button
        >
      </div>
      <el-upload
        drag
        action="/api/nkgl/v1/attach/upload.do"
        :on-success="onSuccess"
        :on-progress="onProgress"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer">
        <fu-button :loading="btnLoading" type="primary" @click="submitUpload"
          >确定</fu-button
        >
        <fu-button @click="closeUpload">取消</fu-button>
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
import CommonFormItems from "@/components/CommonFormItems";
import ComponentTree from "@/components/CommonTree";
import ComponentTable from "@/components/CommonTable";
import HighlevelCondition from "@/components/HighlevelCondition/index";
import ExportTable from "@/components/ExportTable";

import {
  queryData,
  querySampleBgq,
  queryExportParams,
  queryExportParamsCh,
} from "@/service/index";
import { post } from "@/utils/http";
export default {
  name: "sampleQuery",
  components: {
    FuButton: Button,
    FuDialog: Dialog,
    ExportTable,
    ComponentTree,
    ComponentTable,
    CommonFormItems,
    HighlevelCondition,
  },
  data() {
    return {
      // 行业代码
      industryCode: [],
      treeLoading: true,
      // 行政区划代码
      administrativeDivision: "",
      // 行业代码
      industryCodeOption: [],
      // 企业规模
      enterpriseSizeOption: [],
      // 报告期
      bgqOption: [],
      // 左侧树
      treeData: [],
      expandNodes: [],
      defaultProps: {
        children: "children",
        label: "text",
        id: "id",
      },
      // 当前节点id
      nodeId: "",
      // 当前节点数据
      folder: {},
      formData: {
        creditCode: "", // 统一社会信用代码
        companyName: "", // 单位详细名称
        enterpriseSize: "", // 企业规模
        reportPeriod: "", // 报告期
        industryCode: "", // 行业代码
      },
      queryType: "directoryMessage",
      queryForm: {
        creditCode: "", // 统一社会信用代码
        companyName: "", // 单位详细名称
        enterpriseSize: "", // 企业规模
        reportPeriod: "", // 报告期
        industryCode: "", // 行业代码
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
            label: "企业规模",
            prop: "enterpriseSize",
            type: "select",
            disabled: false,
            size: "mini",
            placeholder: "",
            option: [],
          },
          {
            label: "报告期",
            prop: "reportPeriod",
            type: "select",
            disabled: false,
            size: "mini",
            placeholder: "",
            option: [],
          },
          {
            label: "行业代码",
            prop: "industryCode",
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
      selectionIds: [],

      // 高级筛选
      dialogVisible: false,
      //初始化请求的表头----
      reqcolumn: [
        {
          list: "",
          codeType: "",
          label: "报告期",
          prop: "REPORT_PERIOD",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "统一社会信用代码",
          prop: "CREDIT_CODE",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "组织机构代码",
          prop: "ORG_CODE",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "单位详细名称",
          prop: "COMPANY_NAME",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "法定代表人",
          prop: "LEGAL_PERSON",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "详细地址",
          prop: "DETAILED_ADDRESS",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "长途区号",
          prop: "AREA_CODE",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "固定电话",
          prop: "FIXED_PHONE",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "主要业务活动1",
          prop: "BUSINESS_ACTIVITIES_1",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "行业代码",
          prop: "INDUSTRY_CODE",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "登记注册类型",
          prop: "REGISTRATION_TYPE",
          type: "TEXT",
        },
        {
          list: "",
          codeType: "",
          label: "企业控股情况",
          prop: "HOLDINGS",
          type: "TEXT",
        },
      ],
      whereInfos: [],

      // 导入
      isShowUpload: false,
      btnLoading: false,
      // 上传的文件id
      upLoadId: "",

      //导出相关
      exportDialogVisible: false,
      exportFormData: {
        formate: "",
        codes: [],
      },
      // 导出列表
      generateData: [],
      // 导出格式
      exportFormat: [],
    };
  },
  computed: {
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
    // 数据列表
    fuColumn() {
      return [
        {
          prop: "reportPeriod",
          label: "报告期",
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
          sortable: true,
        },
        {
          prop: "orgCode",
          label: "组织机构代码",
          width: "130px",
          align: "center",
          headerAlign: "center",
          sortable: true,
        },
        {
          prop: "companyName",
          label: "单位详细名称",
          width: "180px",
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
          width: "90px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "businessActivities1",
          label: "主要业务活动1",
          width: "120px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "industryCode",
          label: "行业代码",
          width: "130px",
          align: "center",
          headerAlign: "center",
          slot: "oneSlot",
        },
        {
          prop: "registrationType",
          label: "登记注册类型",
          width: "130px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "holdings",
          label: "企业控股情况",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
      ];
    },
    reqTableUrl() {
      if (!this.administrativeDivision) {
        return "";
      } else {
        return "/api/nkgl/v1/directory/queryK.do";
      }
    },
    reqTableParams() {
      if (this.queryType === "condition") {
        return [
          {
            vtype: "json",
            name: "condition",
            data: {
              filter: {
                orderColumns: [],
                showColumns: [
                  "REPORT_PERIOD",
                  "CREDIT_CODE",
                  "ORG_CODE",
                  "COMPANY_NAME",
                  "LEGAL_PERSON",
                  "DETAILED_ADDRESS",
                  "AREA_CODE",
                  "FIXED_PHONE",
                  "BUSINESS_ACTIVITIES_1",
                  "INDUSTRY_CODE",
                  "REGISTRATION_TYPE",
                  "HOLDINGS",
                ],
                whereInfos: this.whereInfos,
              },
            },
          },
          {
            name: "directoryMessage",
            vtype: "formpanel",
            data: this.queryForm,
          },
          {
            vtype: "attr",
            name: "administrativeDivision",
            data: this.administrativeDivision,
          },
          { vtype: "attr", name: "type", data: "ybk" },
        ];
      } else {
        return [
          {
            name: "directoryMessage",
            vtype: "formpanel",
            data: this.queryForm,
          },
          {
            vtype: "attr",
            name: "administrativeDivision",
            data: this.administrativeDivision,
          },
          { vtype: "attr", name: "type", data: "ybk" },
        ];
      }
    },
  },
  watch: {
    administrativeDivision: {
      async handler(val) {
        try {
          let bgq = await querySampleBgq(val);
          this.bgqOption = bgq.data[0].data;
        } catch (error) {
          console.log(error);
        }
        this.$set(this.formItems.data[3], "option", this.bgqOption);
      },
    },
  },
  created() {
    this.initTree();
    this.initSelect();
    this.getExportList();
  },
  methods: {
    changeCode(val) {
      let text = val;
      this.industryCode.forEach((item) => {
        if (item.value === val) {
          text = item.text;
        }
      });
      return text;
    },
    /**
     * @description 初始化左侧树
     */
    async initTree() {
      let treeRes = await queryData("AdministrativeDivision");
      let tree = treeRes.data[0].data;
      this.treeData = this.transformTozTreeFormat(tree);
      // 默认高亮选中节点
      if (this.treeData.length) {
        this.expandNodes.push(this.treeData[0].id);
        this.nodeClick(this.treeData[0]);
        this.$nextTick(() => {
          this.$refs["sampleQueryTree"].setCurrentKeyHeightLight(
            this.treeData[0].id
          );
        });
      }
      this.treeLoading = false;
    },
    /**
     * @description 初始化下拉框
     */
    async initSelect() {
      let res = await queryData("IndustryCode,EnterpriseSize,ExportFormat");
      this.industryCode = res.data[0].data;
      this.$set(this.formItems.data[4], "normalData", this.industryCode);
      this.industryCodeOption = this.transformTozTreeFormat(this.industryCode);
      this.enterpriseSizeOption = res.data[1].data;
      this.$set(this.formItems.data[2], "option", this.enterpriseSizeOption);
      this.$set(this.formItems.data[4], "option", this.industryCodeOption);
      this.exportFormat = res.data[2].data;
      this.$set(this.exportFormData, "formate", this.exportFormat[0].value);
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
    /**
     * @description 获取导出列表信息
     */
    async getExportList() {
      let result = await queryExportParams("ybkxx");
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
     * @description
     */
    highLevelScreen() {
      this.dialogVisible = true;
      if (this.$refs.condition) {
        this.$refs.condition.jsonData = JSON.parse(
          JSON.stringify(this.whereInfos)
        );
      }
    },
    /**
     * @description 获取高级筛选的条件
     */
    getCondition() {
      this.resetForm();
      let whereInfos = JSON.parse(
        JSON.stringify(this.$refs.condition.jsonData)
      );
      if (whereInfos[0]) {
        let result = this.validate(whereInfos[0].sets);
        if (!result.type) {
          Message({
            type: "error",
            message: result.mes,
          });
          document.getElementById(result.id).style = "background:red";
        } else {
          this.dialogVisible = false;
          this.whereInfos = whereInfos;
        }
      } else {
        this.dialogVisible = false;
        this.whereInfos = whereInfos;
      }
      this.queryType = "condition";
    },
    validate(sets) {
      let myReturn = {
        type: true,
      };
      sets.forEach((set) => {
        if (set.sets) {
          let result = this.validate(set.sets);
          myReturn = result;
        } else {
          if (
            set.columnName === "" ||
            set.dataType === "" ||
            set.operator === ""
          ) {
            myReturn = {
              type: false,
              id: set.id,
              mes: "筛选条件存在未填写项，请先输入！",
            };
          } else if (set.dataType === "NUMBER") {
            if (/^(\-|\+)?\d+(\.\d+)?$/.test(set.value)) {
              //校验成功
            } else {
              //校验失败 判断连接符 是否为特殊项
              if (set.operator === "isNotNull" || set.operator === "isNull") {
                //此时value值为空 才正确
                if (set.value !== "") {
                  myReturn = {
                    type: false,
                    id: set.id,
                    mes: "value值错误！",
                  };
                }
              } else {
                myReturn = {
                  type: false,
                  id: set.id,
                  mes: "校验失败，请填写数字！",
                };
              }
            }
          } else if (
            set.operator !== "isNotNull" &&
            set.operator !== "isNull"
          ) {
            if (set.value === "") {
              myReturn = {
                type: false,
                id: set.id,
                mes: "筛选值存在未填写项，请先输入！",
              };
            }
          }
        }
      });
      return myReturn;
    },

    // 树节点点击事件
    nodeClick(data) {
      this.nodeId = data.id;
      this.administrativeDivision = data.value;
      this.folder = data;
    },
    /**
     * @description 表单查询
     */
    tableSearch() {
      let getFormData = this.$refs.querySampleForm.formData;
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
      this.queryType = "directoryMessage";
    },
    /**
     * @description 表单重置
     */
    resetForm() {
      this.$refs.querySampleForm.clearFormData();
      this.queryForm = {
        creditCode: "", // 统一社会信用代码
        companyName: "", // 单位详细名称
        enterpriseSize: "", // 企业规模
        reportPeriod: "", // 报告期
        industryCode: "", // 行业代码
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
    /**
     * @description 加入抽样库
     */
    addCyk() {
      if (this.selectionIds.length === 0) {
        Message.warning("请选择要加入的数据");
        return;
      }
      post("/api/nkgl/v1/directory/addToCYK.do", {
        postData: JSON.stringify({
          data: [
            {
              name: "ybkId",
              vtype: "attr",
              data: this.selectionIds,
            },
          ],
        }),
      })
        .then((res) => {
          this.$refs["sampleQueryTable"].reloadTable();
          Message.success("加入抽样库成功");
        })
        .catch((err) => {
          let response = JSON.parse(err.response);
          Message.error(`加入抽样库失败，${response.data}`);
        });
    },

    /**
     * @description 导入
     */
    importGroup() {
      this.isShowUpload = true;
    },
    closeUpload() {
      this.isShowUpload = false;
    },
    submitUpload() {
      post("/api/nkgl/v1/sampleLibrary/import.do?fileId=" + this.upLoadId)
        .then((res) => {
          Message.success(res.data[0].data);
          this.closeUpload();
          this.$refs["sampleQueryTable"].reloadTable();
        })
        .catch((err) => {
          let response = JSON.parse(err.response);
          Message.error(`导入失败，${response.data}`);
        });
    },
    // 上传时的回调
    onProgress() {
      this.btnLoading = true;
    },
    // 分组上传成功回调
    onSuccess(res) {
      this.upLoadId = res.id;
      this.btnLoading = false;
    },
    /**
     * @description 下载模板
     */
    downloadModel() {
      window.open(`/api/nkgl/v1/sampleLibrary/exportTemplate.do`);
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
        `/api/nkgl/v1/sampleLibrary/export.do?columns=${data.join(",")}&type=${
          this.exportFormData.formate
        }`
      );
      this.exportDialogVisible = false;
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
