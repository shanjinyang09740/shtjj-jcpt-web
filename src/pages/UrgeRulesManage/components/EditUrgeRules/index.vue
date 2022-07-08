<template>
  <div class="contain">
    <div class="progressLan">
      <ul>
        <li
          :class="[item.active ? 'active' : '']"
          v-for="(item, index) in progressList"
          :key="item.sortNum"
        >
          <span class="circle">{{ item.sortNum }}</span>
          <span class="words">{{ item.text }}</span>
          <i v-if="index < progressList.length - 1" class="divid"></i>
        </li>
      </ul>
    </div>
    <div class="main">
      <div
        v-for="(item, index) in formItems"
        v-show="item.isShow"
        :key="item.name"
      >
        <fu-form
          class="containForm"
          :fu-data="formData"
          :ref="item.name"
          :rules="item.rules"
          :label-width="item.labelWidth"
        >
          <fu-form-item
            v-for="(ite, index) in item.data"
            :key="index"
            :label="ite.label"
            :prop="ite.prop"
            :style="{ width: ite.width ? ite.width : '80%' }"
          >
            <fu-input
              v-if="ite.type == 'input'"
              v-model="formData[ite.prop]"
              :size="ite.size"
              :placeholder="ite.placeholder"
              clearable
            ></fu-input>
            <fu-input-number
              v-if="ite.type == 'input-num'"
              controls-position="right"
              v-model="formData[ite.prop]"
              :min="1"
              :size="ite.size"
              :placeholder="ite.placeholder"
              clearable
            ></fu-input-number>
            <fu-input
              v-else-if="ite.type == 'textarea'"
              type="textarea"
              v-model="formData[ite.prop]"
              :size="ite.size"
              :placeholder="ite.placeholder"
              clearable
            ></fu-input>
            <fu-switch
              v-else-if="ite.type == 'switch'"
              v-model="formData[ite.prop]"
              active-value="1"
              inactive-value="0"
              active-text="启用"
              inactive-text="停用"
              :size="ite.size"
              clearable
            ></fu-switch>
            <div class="multTreeContain" v-else-if="ite.type == 'mult-tree'">
              <fu-tree
                class="multTree"
                :fu-data="ite.option"
                :ref="'multTree'"
                :node-key="defaultProps.id"
                :props="defaultProps"
                :show-checkbox="true"
                :expand-on-click-node="false"
                :is-multiple="true"
                :check-strictly="false"
                :check-on-click-node="true"
                :default-expand-all="true"
                :default-checked-keys="defaultCheckedKeys"
                @check="handleCheckChange"
                @node-click="handleCheckChange"
                :size="ite.size"
              >
              </fu-tree>
            </div>
            <fu-select
              v-else-if="ite.type == 'select'"
              v-model="formData[ite.prop]"
              :placeholder="ite.placeholder"
              :size="ite.size"
              filterable
              clearable
              @change="selectChange(formData[ite.prop], ite.prop)"
            >
              <fu-option
                v-for="i in ite.option"
                :key="i.value"
                :label="i.text"
                :value="i.value"
              >
              </fu-option>
            </fu-select>
            <div class="urgeRulesComp" v-else-if="ite.type == 'urgeRulesComp'">
              <fu-select
                v-model="formData.ruleTime"
                :size="ite.size"
                filterable
                clearable
              >
                <fu-option
                  v-for="i in ite.option.value1Option"
                  :key="i.value"
                  :label="i.text"
                  :value="i.value"
                >
                </fu-option>
              </fu-select>
              <fu-select
                v-model="formData.ruleMd"
                :size="ite.size"
                filterable
                clearable
              >
                <fu-option
                  v-for="i in ite.option.value2Option"
                  :key="i.value"
                  :label="i.text"
                  :value="i.value"
                >
                </fu-option>
              </fu-select>
              <fu-input-number
                controls-position="right"
                v-model="formData.ruleHour"
                :size="ite.size"
                clearable
              ></fu-input-number>
            </div>
          </fu-form-item>
        </fu-form>
        <div class="operateBtns">
          <div>
            <fu-button
              v-show="index > 0"
              type="primary"
              size="mini"
              @click="changeFormPanel(index, 'pre')"
              >上一步</fu-button
            >
            <fu-button
              v-show="index < formItems.length - 1"
              type="primary"
              size="mini"
              @click="changeFormPanel(index, 'next')"
              >下一步</fu-button
            >
            <fu-button
              v-show="index == formItems.length - 1"
              type="primary"
              size="mini"
              @click="confirmFormPanel()"
              >确定</fu-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Form,
  FormItem,
  InputNumber,
  Select,
  Option,
  Input,
  Switch,
  Button,
  Message,
  Tree,
} from "fusion-ui";
import { FormItems } from "./FormItems";
import http from "@/utils/http";
import { transformTozTreeFormat, postDicData } from "@/utils/tool";
export default {
  name: "EditUrgeRules",
  components: {
    FuForm: Form,
    FuFormItem: FormItem,
    FuInputNumber: InputNumber,
    FuSelect: Select,
    FuOption: Option,
    FuInput: Input,
    FuSwitch: Switch,
    FuButton: Button,
    FuTree: Tree,
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    postFormData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    isEdit: {
      handler: function (newValue) {
        //初始化面板
        this.initFormPanel();
        if (newValue) {
          this.formData = { ...this.postFormData };
        } else {
          for (let key in this.formData) {
            if ("ruleMd,ruleHour".indexOf(key) > -1) {
              this.formData[key] = "0";
            } else {
              this.formData[key] = "";
            }
          }
        }
      },
      immediate: true,
    },
    formData: {
      handler: function (newValue) {
        if (newValue) {
          let newRuleArr = [];
          if (newValue.ruleTime || newValue.ruleMd || newValue.ruleHour) {
            newRuleArr = [
              newValue.ruleTime,
              newValue.ruleMd,
              newValue.ruleHour,
            ];
          }
          if (newRuleArr.length) {
            this.formData.rule = newRuleArr.join(",");
          } else {
            this.formData.rule = "";
          }
        }
      },
      deep: true,
    },
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "text",
        id: "id",
      },
      defaultCheckedKeys: [],
      progressList: [
        {
          sortNum: 1,
          text: "基本信息",
          active: true,
        },
        {
          sortNum: 2,
          text: "报表范围设置",
        },
        {
          sortNum: 3,
          text: "企业白名单",
        },
      ],
      formItems: [...FormItems],
      formData: {
        ruleName: "",
        ruleDesc: "",
        rule: "",
        ruleTime: "",
        ruleMd: "",
        ruleHour: "",
        urgingMethod: "",
        ruleState: "",
        wordsId: "",
        whiteCreditCodes: "",
        surveyItemId: "",
        chanelId: "",
        reportIds: [],
      },
    };
  },
  computed: {},
  beforeCreate() {},
  created() {
    //获取调查项目下拉数据
    this.getDcxmOption();
    //获取催报规则时间下拉数据
    this.getRulsTimeOption();
    //获取催报方式
    this.getUrgeMethodsOption();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //报表所选树
    handleCheckChange(node) {
      let ckeys = this.$refs.multTree[0].$refs.el.getCheckedNodes();
      if (ckeys.length) {
        let reportIdsArr = [];
        let reportArr = ckeys.filter((item) => item.situationId);
        reportArr.length &&
          reportArr.forEach((item) => {
            reportIdsArr.push(item.value);
          });
        this.$set(this.formData, "reportIds", reportIdsArr);
      }
    },
    //获取催报方式
    getUrgeMethodsOption() {
      http.post("/api/cbgl/v1/tdpzgl/queryAllChannel.do").then((res) => {
        let result = res.data[0].data;
        result = result.map((item) => {
          return {
            ...item,
            text: item.channelName,
            value: item.channelName,
          };
        });
        this.changeFormItemsOption(result, "baseMessageForm", "urgingMethod");
        this.$set(this.formData, "urgingMethod", result[0].value);
        this.getWordsIdOption(result[0].value);
      });
    },
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
          this.changeFormItemsOption(resultData, "baseMessageForm", "wordsId");
        });
    },
    async getRulsTimeOption() {
      let { data } = await postDicData("UrgingRuleTimeType");
      let result = data[0].data;
      result && this.changeFormItemsOption(result, "baseMessageForm", "rule");
    },
    //下拉树选择的值改变之后，将当前选择的value赋值
    selectTreeChange(val, value) {
      this.$set(this.formData, value, val.value);
    },
    selectChange(val, prop) {
      if (prop == "surveyItemId") {
        //报表树置空
        this.$set(this.formData, "reportIds", []);
        //切换报表树数据
        http
          .get(`/api/cbgl/v1/report/classify/queryByItemId.do?itemId=${val}`)
          .then((res) => {
            let result = res.data[0].data;
            if (!result || !result.length) return;
            result = result.map((item) => {
              return {
                ...item,
                text: item.name,
                value: item.id,
              };
            });
            result = transformTozTreeFormat([...result]);
            this.changeFormItemsOption(result, "reportRangeForm", "reportIds");
          })
          .catch((err) => {});
      } else if (prop == "urgingMethod") {
        this.getWordsIdOption(val);
      }
    },
    //获取调查项目下拉数据
    getDcxmOption() {
      //获取调查项目
      http.get("/api/cbgl/v1/investigationItem/dropDownList.do").then((res) => {
        let result = res.data[0].data.rows;
        if (result && result.length) {
          this.changeFormItemsOption(result, "reportRangeForm", "surveyItemId");
          if (!this.formData.surveyItemId) {
            this.$set(this.formData, "surveyItemId", result[0].value);
          }
          if (this.formData.reportIds) {
            this.defaultCheckedKeys = this.formData.reportIds;
          }
          this.selectChange(this.formData.surveyItemId, "surveyItemId");
        }
      });
    },
    changeFormItemsOption(result, name, prop) {
      this.formItems.some((item) => {
        if (item.name == name) {
          item.data.some((ite) => {
            if (ite.prop == prop) {
              if (ite.type == "select-tree") {
                ite.normalData = result;
                ite.option = transformTozTreeFormat([...result]);
              } else {
                if (prop == "rule") {
                  ite.option.value1Option = result;
                  this.formData.ruleTime = result[0].value;
                } else {
                  ite.option = result;
                }
              }
              return true;
            }
          });
          return true;
        }
      });
      this.$set(this, "formItems", this.formItems);
    },
    //初始化面板
    initFormPanel() {
      this.formItems.forEach((item, index) => {
        item.isShow = index == 0 ? true : false;
      });
      this.progressList.forEach((item, index) => {
        item.active = index == 0 ? true : false;
      });
      this.$set(this, "formItems", this.formItems);
      this.$set(this, "progressList", this.progressList);
    },
    /**
     * @description 表单切换事件
     */
    changeFormPanel(index, type) {
      if (index == 0) {
        this.$refs.baseMessageForm[0].$refs.el.validate((valid) => {
          if (!valid) {
            Message.warning("请检查必填项是否未填！");
            return;
          } else {
            this.changeForm(index, type);
          }
        });
      } else {
        this.changeForm(index, type);
      }
    },
    changeForm(index, type) {
      let $index = 0;
      $index = type == "next" ? index + 1 : index - 1;
      this.formItems.forEach((item, index) => {
        item.isShow = index == $index ? true : false;
      });
      this.progressList.forEach((item, index) => {
        item.active = index == $index ? true : false;
      });
      this.$set(this, "formItems", this.formItems);
      this.$set(this, "progressList", this.progressList);
    },
    /**
     * @description  表单提交确认事件
     */
    confirmFormPanel() {
      let postData = {},
        url = "";
      if (this.isEdit) {
        //编辑保存
        url = "/api/cbgl/v1/notification/urgingRule/updateRule.do";
      } else {
        //新建保存
        url = "/api/cbgl/v1/notification/urgingRule/saveRule.do";
      }

      postData = {
        data: [
          {
            data: {
              ...this.formData,
              ruleState: this.formData.ruleState,
              chanelId: this.formData.urgingMethod,
              ruleId: this.formData.ruleId,
            },
            name: "formpanel",
            vtype: "formpanel",
          },
          {
            name: "reportIds",
            vtype: "attr",
            data: this.formData.reportIds ? this.formData.reportIds : [],
          },
        ],
      };

      http
        .post(url, {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          if (res.message == "success") {
            Message.success("保存成功");
            //刷新表格
            this.$emit("afrashTableData");
            this.$emit("changeIsShowDialog", false);
          }
        })
        .catch((err) => {
          Message.error(`保存失败!，${err.errorMessage}`);
        });
    },
    /**
     * @description 提交数据
     * @param {}
     * @returns {}
     */
    submit(callback) {
      this.$refs.baseForm.$refs.el.validate((valid) => {
        if (valid) {
          callback(this.formData, "BatchAssignCode");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.progressLan {
  display: flex;
  justify-content: center;
  ul {
    display: flex;
    li {
      display: flex;
      align-items: center;
      font-size: 16px;
      &.active {
        .circle {
          color: #fff;
          background-color: #02a7f0;
        }
        .words {
          color: #333;
        }
      }
      .divid {
        width: 80px;
        height: 1px;
        background-color: #cecece;
        margin: 0 20px;
      }
      .circle {
        width: 22px;
        height: 22px;
        text-align: center;
        line-height: 22px;
        color: #999;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 11px;
        margin-right: 5px;
      }
    }
  }
}
.operateBtns {
  display: flex;
  justify-content: center;
}
.urgeRulesComp {
  > div {
    margin-right: 10px;
  }
}
.multTreeContain {
  padding-top: 8px;
  max-height: 500px;
  min-height: 100px;
  overflow: auto;
}
</style>
