<template>
  <div class="contain">
    <div class="pageMain">
      <div class="main">
        <div class="area">
          <div class="leftArea">
            <administrative-tree
              @treeNodeClick="treeNodeClick"
            ></administrative-tree>
          </div>
          <div class="rightArea">
            <fu-tabs
              v-model="activeTabName"
              type="border-card"
              @tab-click="handleClick"
            >
              <fu-tab-pane
                v-for="item in tabPaneList"
                :key="item.value"
                :name="item.value"
                :label="item.text"
              >
                <fu-dropdown
                  trigger="click"
                  style="margin-right: 10px"
                  @visible-change="changeVisible"
                >
                  <fu-button type="primary" size="mini">显示设置</fu-button>
                  <fu-dropdown-menu slot="dropdown">
                    <fu-input
                      size="mini"
                      placeholder="输入关键字进行过滤"
                      v-model="filterText"
                      clearable
                    >
                    </fu-input>

                    <fu-tree
                      v-if="mountedOver"
                      :fu-data="reqTablecolumn"
                      show-checkbox
                      class="filter-tree"
                      :filter-node-method="filterNode"
                      :check-on-click-node="true"
                      node-key="id"
                      :default-checked-keys="defaultChecked"
                      :ref="'SelectTreeComponent'"
                      @check-change="handleCheckChange"
                    >
                    </fu-tree>
                  </fu-dropdown-menu>
                </fu-dropdown>
                <fu-button
                  type="success"
                  size="mini"
                  @click="heightLevelFilteClick"
                  >高级筛选</fu-button
                >
                <fu-button v-if="isShowBtn" type="primary" size="mini"
                  >申请</fu-button
                >
                <fu-button v-if="isShowBtn" type="primary" size="mini"
                  >受理</fu-button
                >
                <fu-button v-if="isShowBtn" type="primary" size="mini"
                  >审核</fu-button
                >
                <fu-button
                  v-if="isShowBtn"
                  type="primary"
                  size="mini"
                  @click="joinSampleClick"
                  >加入样本</fu-button
                >
                <fu-button
                  v-if="isShowBtn"
                  type="primary"
                  size="mini"
                  @click="exportClick"
                  plain
                  >导出</fu-button
                >
              </fu-tab-pane>
            </fu-tabs>
            <div>
              <main-table
                ref="mainTable"
                :activeTab="activeTabName"
                :tablecolumn="showTablecolumn"
                :selectAdministrativeTreeValue="selectAdministrativeTreeValue"
                :dicOptions="dicOptions"
                :filterCondition="filterCondition"
              ></main-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <custom-dialog
      v-if="customDialog.isShow"
      :isShowDialog="customDialog.isShow"
      :title="customDialog.title"
      :width="customDialog.compType == 'ExportTable' ? '50%' : '80%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
      <div slot="body">
        <high-level-condition
          ref="dialogForm"
          :conditionOptions="highLevelColumns"
          v-if="customDialog.compType == 'HighLevelFilte'"
        ></high-level-condition>
        <export-table
          ref="dialogForm"
          v-if="customDialog.compType == 'ExportTable'"
          :tablecolumn="showTablecolumn"
          :formItems="exportFormItems"
          :formData="exportFormData"
        ></export-table>
      </div>
    </custom-dialog>
  </div>
</template>

<script>
import {
  Button,
  Tabs,
  TabPane,
  Dropdown,
  DropdownMenu,
  Tree,
  Input,
  Message,
} from "fusion-ui";
import AdministrativeTree from "./components/AdministrativeTree";
import MainTable from "./components/MainTable";
import CustomDialog from "@/components/CommonDialog";
import HighLevelCondition from "@/components/HighlevelCondition";
import ExportTable from "@/components/ExportTable";
import http from "@/utils/http";
import { postDicData } from "@/utils/tool";
import { queryExportParams, queryExportParamsCh } from "@/service";
export default {
  name: "BaseUnitMsgQuery",
  components: {
    FuButton: Button,
    FuTabs: Tabs,
    FuTabPane: TabPane,
    FuDropdown: Dropdown,
    FuDropdownMenu: DropdownMenu,
    FuTree: Tree,
    FuInput: Input,
    AdministrativeTree,
    MainTable,
    HighLevelCondition,
    CustomDialog,
    ExportTable,
  },
  // extends: null,
  // minxins: [],
  props: {},
  data() {
    return {
      //当前选中的行政区划树节点
      selectAdministrativeTreeValue: "",
      //所属按钮类别
      activeTabName: "now",
      //表格显示设置相关
      mountedOver: false,
      filterText: "",
      reqTablecolumn: [
        {
          id: 1,
          label: "统一社会信用代码",
          prop: "creditCode",
          width: "200",
          align: "left",
          sortable: true,
        },
        {
          id: 2,
          label: "组织机构代码",
          prop: "orgCode",
          width: "150",
          align: "left",
          sortable: true,
        },
        {
          id: 3,
          label: "单位详细名称",
          prop: "companyName",
          width: "120",
          reqUrl: "",
          align: "left",
        },
        {
          id: 4,
          label: "法定代表人",
          prop: "legalPerson",
          width: "100",
          reqUrl: "",
          align: "left",
        },
        {
          id: 6,
          label: "详细地址",
          prop: "detailedAddress",
          width: "100",
          reqUrl: "",
          align: "left",
        },
        {
          id: 7,
          label: "长途区号",
          prop: "areaCode",
          width: "100",
          reqUrl: "",
          align: "left",
        },
        {
          id: 8,
          label: "固定电话",
          prop: "fixedPhone",
          width: "100",
          reqUrl: "",
          align: "left",
        },
        {
          id: 9,
          label: "主要业务活动",
          prop: "businessActivities1",
          width: "150",
          reqUrl: "",
          align: "left",
        },
        {
          id: 10,
          label: "行业代码",
          prop: "industryCode",
          width: "100",
          reqUrl: "",
          align: "left",
          isTransCode: true,
        },
        {
          id: 11,
          label: "登记注册类型",
          prop: "registrationType",
          width: "150",
          reqUrl: "",
          align: "left",
        },
        {
          id: 12,
          label: "企业控股情况",
          prop: "holdings",
          width: "150",
          reqUrl: "",
          align: "left",
        },
        {
          id: 13,
          label: "企业规模",
          prop: "enterpriseSize",
          width: "100",
          reqUrl: "",
          align: "left",
          isTransCode: true,
        },
        {
          id: 14,
          label: "类型",
          prop: "type",
          width: "100",
          reqUrl: "",
          align: "left",
          isTransCode: true,
        },
        {
          id: 15,
          label: "是否规上",
          prop: "isUp",
          width: "100",
          reqUrl: "",
          align: "left",
          isTransCode: true,
        },
        {
          id: 16,
          label: "手工标签",
          prop: "manualLabel",
          width: "100",
          reqUrl: "",
          align: "left",
          isTransCode: true,
        },
        {
          id: 17,
          label: "自动标签",
          prop: "autoLabel",
          width: "100",
          reqUrl: "",
          align: "left",
        },
      ],
      showTablecolumn: [],
      defaultChecked: [],
      tabPaneList: [
        {
          text: "现有所属",
          value: "now",
        },
        {
          text: "历史所属",
          value: "history",
        },
      ],
      isShowBtn: true,
      customDialog: {
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
      //高级筛选
      filterCondition: {},
      //字典项option
      dicOptions: {
        industryCode: [],
        enterpriseSize: [],
        type: [
          {
            text: "法人单位",
            value: "0",
          },
          {
            text: "产业活动单位",
            value: "1",
          },
        ],
        isUp: [
          {
            text: "是",
            value: "0",
          },
          {
            text: "否",
            value: "1",
          },
        ],
        // manualLabel: [],
      },
      //字典项映射字段
      dicShineCodeArr: [
        {
          text: "行业代码",
          value: "industryCode",
          key: "IndustryCode",
          option: [],
        },
        {
          text: "企业规模",
          value: "enterpriseSize",
          key: "EnterpriseSize",
          option: [],
        },
      ],
      //高级筛选字段列表
      highLevelColumns: [],
    };
  },
  computed: {},
  watch: {
    filterText(val) {
      this.$refs["SelectTreeComponent"][0].$refs.el.filter(val);
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.initData();
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    async initData() {
      //初始化表格显示列
      this.initTableColumn();
      //获取导出相关数据
      this.initExportData();
      //获取代码表字典项集合
      this.getDicOptions();
      //获取高级筛选字段列表
      this.getHighLevelColumns();
    },
    //获取高级筛选字段列表
    getHighLevelColumns() {
      http
        .get("/api/nkgl/v1/directory/getAadvancedFilterColumn.do")
        .then((res) => {
          let result = res.data[0].data;
          this.highLevelColumns = result.map((item) => {
            return {
              ...item,
              label: item.text,
              prop: item.value,
            };
          });
        });
    },
    async getDicOptions() {
      let dicIds = "",
        dicIdsArr = [];
      this.dicShineCodeArr.forEach((item) => {
        dicIdsArr.push(item.key);
      });
      dicIds = dicIdsArr.join(",");
      let { data } = await postDicData(dicIds);
      data.forEach((item, index) => {
        this.dicShineCodeArr.some((code, i) => {
          if (i == index) {
            code.option = item.data;
            return true;
          }
        });
      });
      for (let key in this.dicOptions) {
        this.dicShineCodeArr.some((ite) => {
          if (key == ite.value) {
            this.dicOptions[key] = ite.option;
            return true;
          }
        });
      }
      this.$set(this, "dicOptions", this.dicOptions);
    },
    initTableColumn() {
      this.reqTablecolumn.some((item, index) => {
        if (index == 4) {
          return true;
        } else {
          this.showTablecolumn.push(item);
          this.defaultChecked.push(item.id);
        }
      });
    },
    async initExportData() {
      let allData = await queryExportParams("jbdwmlxx");
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
    //获取导出的格式及字段
    updateExportFormData(data) {
      return data;
    },
    /**
     * @description
     * @param {}
     * @returns {}
     */
    treeNodeClick(node) {
      this.selectAdministrativeTreeValue = node.value;
    },
    /**
     * @description 加入样本库
     * @param {}
     * @returns {}
     */
    joinSampleClick() {
      let selectData = this.$refs.mainTable.selectTableData;
      if (selectData.length) {
        let idArr = [];
        selectData.forEach((item) => {
          if (item.messageId) idArr.push(item.messageId);
        });
        let postData = {
          data: [
            {
              name: "messageId",
              vtype: "attr",
              data: idArr,
            },
          ],
        };
        http
          .post("/api/nkgl/v1/directory/addToYBK.do", {
            postData: JSON.stringify(postData),
          })
          .then((res) => {
            if (res.message == "success") {
              Message.success("加入成功");
            }
          })
          .catch((err) => {
            Message.error(`加入失败!，${JSON.parse(err.response).data}`);
          });
      } else {
        Message.warning("请先选择表格数据!");
        return;
      }
    },
    /**
     * @description 导出
     * @param {}
     * @returns {}
     */
    exportClick() {
      this.customDialog.isShow = true;
      this.customDialog.title = "导出";
      this.customDialog.compType = "ExportTable";
      this.exportFormData = {
        type: "",
        columns: this.exportDefaultColumns,
      };
      this.exportFormItems.some(async (item) => {
        if (item.prop == "type") {
          let { data } = await postDicData("ExportFormat");
          item.option = data[0].data;
        }
      });
    },
    /**
     * @description 显示设置————对显示设置中树节点 进行过滤操作
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    /**
     * @description 显示设置————选择显示的列
     */
    handleCheckChange(data, checked, indeterminate) {
      if (checked) {
        //勾选
        this.showTablecolumn.push(data);
        this.defaultChecked.push(data.id);
      } else {
        //取消勾选
        if (
          this.$refs["SelectTreeComponent"][0].$refs.el.getCheckedKeys()
            .length === 0
        ) {
          this.mountedOver = true;
        }
        let index = this.showTablecolumn.findIndex(
          (item) => item.prop === data.prop
        );
        if (index !== -1) {
          this.showTablecolumn.splice(index, 1);
          this.defaultChecked.splice(index, 1);
        }
      }
    },
    changeVisible(bool) {
      this.mountedOver = bool;
    },
    /**
     * @description 高级筛选事件
     * @param {}
     * @returns {}
     */
    heightLevelFilteClick() {
      this.customDialog.isShow = true;
      this.customDialog.title = "高级筛选";
      this.customDialog.compType = "HighLevelFilte";
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
      if (val == "confirm") {
        //确认处理逻辑---data 表单数据   type 弹窗组件类型
        if (this.$refs.dialogForm.submit) {
          this.$refs.dialogForm.submit((data, type) => {
            this.customDialog.isShow = false;
            if (type == "ExportTable") {
              //处理导出逻辑
              window.open(
                `/api/nkgl/v1/directory/export.do?columns=${data.columns}&type=${data.type}`
              );
            }
          });
        } else {
          //高级筛选处理逻辑
          this.getCondition();
        }
      } else {
        //取消处理逻辑
        this.customDialog.isShow = false;
      }
    },
    /**
     * @description 获取高级筛选的条件
     */
    getCondition() {
      this.$refs.mainTable.resetSearch();
      let filterColumnsArr = [];
      this.highLevelColumns.forEach((item) => {
        filterColumnsArr.push(item.prop);
      });
      let whereInfos = JSON.parse(
        JSON.stringify(this.$refs.dialogForm.jsonData)
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
          this.customDialog.isShow = false;
          this.filterCondition = {
            orderColumns: [],
            showColumns: filterColumnsArr,
            whereInfos: whereInfos,
            selectDqCode: "",
          };
        }
      } else {
        this.customDialog.isShow = false;
      }
    },
    //高级筛选校验
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
    /**
     * @description 所属按钮组tab切换
     */
    handleClick() {
      this.isShowBtn = this.activeTabName == "now" ? true : false;
    },
  },
};
</script>

<style lang="less" scoped>
.contain {
  font-size: 14px;
}
.pageTitle {
  height: 49px;
  color: #666666;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding-left: 20px;
  i {
    width: 2px;
    height: 16px;
    background-color: rgb(26, 188, 156);
    margin-right: 5px;
  }
}
.pageMain {
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  .main {
    height: 100%;
    width: 100%;
    border: 1px solid #ccc;
    .title {
      height: 50px;
      color: #333;
      display: flex;
      align-items: center;
      padding-left: 15px;
      background-color: #f3f3f3;
      border-bottom: 1px solid #ccc;
      box-sizing: border-box;
    }
    .area {
      display: flex;
      height: 100%;
      .leftArea {
        width: 300px;
        height: 100%;
        box-sizing: border-box;
        border-right: 1px solid #cecece;
      }
      .rightArea {
        width: calc(100% - 280px);
        padding: 5px 10px;
      }
    }
  }
}
</style>
