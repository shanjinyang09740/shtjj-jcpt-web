<template>
  <div>
    <div class="queryLan">
      <common-form-items
        ref="MultFormItems"
        :FormItems="formItems"
        :FormData="formData"
        @changeFormItems="changeFormItems"
      ></common-form-items>
      <div class="queryBtns">
        <div>
          <fu-button size="mini" type="success" clearable @click="tableSearch"
            >查询</fu-button
          >
          <fu-button size="mini" type="primary" clearable @click="resetSearch"
            >重置</fu-button
          >
          <fu-button size="mini" type="primary" clearable @click="saveNewModel"
            >保存为新模版</fu-button
          >
          <fu-button size="mini" type="primary" clearable @click="updateModel"
            >更新模板</fu-button
          >
        </div>
      </div>
    </div>
    <fu-table
      ref="mainTable"
      :fu-request="tableReq"
      :row-key="'id'"
      max-height="550px"
      border
      @selection-change="handleSelectionChange"
    >
      <fu-table-column type="selection" width="55"> </fu-table-column>
      <fu-table-column label="序号" type="index" align="center" width="50">
      </fu-table-column>
      <fu-table-column
        v-for="(item, index) in tablecolumn"
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
              @click.stop="
                handleRowBtnClick(scope.row, scope.$index, item.value)
              "
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
      :title="customDialog.title"
      :isShowCancel="false"
      :confirmText="'关闭'"
      :width="'80%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
      <div slot="body">
        <view-detail
          :creditCode="currentCreditCode"
          :type="currentType"
          v-if="customDialog.compType == 'ViewDetail'"
        ></view-detail>
        <change-note v-if="customDialog.compType == 'ChangeNote'"></change-note>
      </div>
    </custom-dialog>
  </div>
</template>

<script>
import {
  Button,
  Table,
  TableColumn,
  Pagination,
  MessageBox,
  Message,
} from "fusion-ui";
import CommonFormItems from "@/components/CommonFormItems";
import { FormItems } from "./js/FormItems";
import http from "@/utils/http";
import { postDicData, transformTozTreeFormat } from "@/utils/tool";
import CustomDialog from "@/components/CommonDialog";
import ViewDetail from "../ViewDetail";
import ChangeNote from "../ChangeNote";

export default {
  name: "MainTable",
  components: {
    FuButton: Button,
    FuTable: Table,
    FuTableColumn: TableColumn,
    FuPagination: Pagination,
    CommonFormItems,
    CustomDialog,
    ViewDetail,
    ChangeNote,
  },
  props: {
    //表格展示列
    tablecolumn: {
      type: Array,
      default: () => [],
    },
    //当前Tab选项
    activeTab: {
      type: String,
      default: "",
    },
    //当前选中的行政区划树节点
    selectAdministrativeTreeValue: {
      type: String,
      default: "",
    },
    //字典项数据集
    dicOptions: {
      type: Object,
      default: () => {},
    },
    //高级筛选条件
    filterCondition: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      formItems: { ...FormItems },
      formData: {
        creditCode: "",
        companyName: "",
        isup: "",
        enterpriseSize: "",
        industryCode: "",
        manualLabel: "",
        template: "",
      },
      formQuery: {},
      //当前表格选中数据
      selectTableData: [],
      currentCreditCode: "",
      currentType: "",
      customDialog: {
        isShow: false,
        title: "",
        compType: "",
      },
      //表格操作列显示按钮类型
      tableOperateBtnGroup: [
        {
          text: "详情",
          value: "ViewDetail",
          imgPath: require("@/assets/images/table/view-detail.svg"),
        },
        {
          text: "变更记录",
          value: "ChangeNote",
          imgPath: require("@/assets/images/table/change-note.svg"),
        },
      ],
      tableData: {
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
    tableReq() {
      return {
        url: "/api/nkgl/v1/directory/query.do",
        params: [
          {
            vtype: "formpanel",
            name: "formpanel",
            data: {
              creditCode: this.formQuery.creditCode,
              companyName: this.formQuery.companyName,
              isup: this.formQuery.isup,
              enterpriseSize: this.formQuery.enterpriseSize,
              type: this.formQuery.type,
              industryCode: this.formQuery.industryCode,
              manualLabel: this.formQuery.manualLabel,
            },
          },
          {
            vtype: "attr",
            name: "type",
            data: this.activeTab,
          },
          {
            vtype: "attr",
            name: "administrativeDivision",
            data: this.selectAdministrativeTreeValue,
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
          {
            vtype: "json",
            name: "condition",
            data: {
              filter: this.filterCondition,
            },
          },
        ],
      };
    },
  },
  watch: {},
  beforeCreate() {},
  created() {
    this.initData();
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
    changeFormItems(data) {
      this.formItems = data;
    },
    /**
     * @description 初始化数据
     * @param {}
     * @returns {}
     */
    initData() {
      //获取表单option数据
      this.getFormOptions();
    },
    handleRowBtnClick(row, $index, value) {
      this.currentCreditCode = row.creditCode;
      this.currentType = row.type;
      this.customDialog.isShow = true;
      this.tableOperateBtnGroup.some((item) => {
        if (item.value == value) {
          this.customDialog.title = item.text;
          this.customDialog.compType = item.value;
          return true;
        }
      });
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
     * @description 获取表单option数据
     */
    getFormOptions() {
      let dicObj = {
        enterpriseSize: "EnterpriseSize",
        industryCode: "IndustryCode",
      };
      this.formItems.data.forEach(async (item) => {
        let _type = item.type,
          _prop = item.prop;
        //请求option数据
        if (dicObj[_prop]) {
          let { data } = await postDicData(dicObj[_prop]);
          let result = data[0].data;
          if (_type == "select-tree") {
            item.normalData = result;
            item.option = transformTozTreeFormat([...result]);
          } else {
            item.option = result;
          }
          this.$set(this, "formItems", this.formItems);
        }
        if (_prop == "template") {
          //模板查询接口
          this.getTemplateOption(_prop);
        }
      });
    },
    /**
     * @description 模板查询并更新视图
     * @param {String} _prop 模板查询字段+
     */
    getTemplateOption(_prop) {
      http.post("/api/nkgl/v1/template/query.do").then((res) => {
        let result = res.data[0].data;
        this.formItems.data.some((item) => {
          if (item.prop == _prop) {
            item.option = result;
            return true;
          }
        });
        this.$set(this, "formItems", this.formItems);
      });
    },
    /**
     * @description 表单查询事件
     */
    tableSearch() {
      let getFormData = this.$refs.MultFormItems.formData;
      let newObj = {};
      for (let key in getFormData) {
        let _value = getFormData[key];
        if (Array.isArray(_value)) {
          newObj[key] = _value.length ? _value.join(",") : "";
        } else {
          newObj[key] = _value;
        }
      }
      this.formQuery = { ...newObj };
    },
    /**
     * @description 重置查询条件
     */
    resetSearch() {
      this.$refs.MultFormItems.clearFormData();
      this.formQuery = {};
    },
    /**
     * @description 保存为新模版
     * @param {}
     * @returns {}
     */
    saveNewModel() {
      //获取查询条件
      let getFormData = this.$refs.MultFormItems.formData;
      MessageBox.prompt("请输入模板名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(\w|[\u4e00-\u9fa5]){2,}$/,
        inputErrorMessage: "仅支持汉字、数字、字母、下划线,且不得少于两位",
      })
        .then(({ value }) => {
          let postData = {
            data: [
              {
                name: "templateName",
                vtype: "attr",
                data: value,
              },
              {
                name: "templateValue",
                vtype: "attr",
                data: getFormData,
              },
            ],
          };
          http
            .post("/api/nkgl/v1/template/save.do", {
              postData: JSON.stringify(postData),
            })
            .then((res) => {
              if (res.message == "success") {
                Message.success("保存成功");
                this.getTemplateOption("template");
              } else {
                Message.error("保存失败");
              }
            })
            .catch((err) => {
              Message.error(`保存失败!，${err.errorMessage}`);
            });
        })
        .catch(() => {
          Message({
            type: "info",
            message: "取消输入",
          });
        });
    },
    /**
     * @description 更新模版
     */
    updateModel() {
      let getFormData = this.$refs.MultFormItems.formData;
      let templateId = getFormData["template"];
      if (!templateId) {
        Message.warning("请先选择查询模板");
        return;
      }
      let postData = {
        data: [
          { name: "templateId", vtype: "attr", data: templateId },
          {
            name: "template",
            vtype: "formpanel",
            data: getFormData,
          },
        ],
      };
      http
        .post("/api/nkgl/v1/template/update.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          if (res.message == "success") {
            Message.success("更新成功");
            this.getTemplateOption("template");
          } else {
            Message.error("更新失败");
          }
        })
        .catch((err) => {
          Message.error(`更新失败!，${err.errorMessage}`);
        });
    },
    /**
     * @description 多选表格change事件
     * @param {Array} val
     */
    handleSelectionChange(val) {
      this.selectTableData = val;
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
.queryLan {
  padding-top: 5px;
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
  .queryBtns {
    display: flex;
    justify-content: center;
    padding-bottom: 10px;
  }
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.el-icon-arrow-down {
  font-size: 14px;
}
</style>
