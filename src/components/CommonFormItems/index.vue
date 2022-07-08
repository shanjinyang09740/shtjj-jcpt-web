<template>
  <div :class="['contain']">
    <fu-form
      class="containForm"
      :fu-data="formData"
      :ref="formItems.name"
      :label-width="formItems.labelWidth"
      :inline="true"
    >
      <div
        class="formItemDiv"
        v-for="(item, index) in formItems.data"
        v-show="!item.isHide"
        :key="index"
        :style="{ width: item.width ? item.width : '' }"
      >
        <fu-form-item :label="item.label" :prop="item.prop">
          <fu-input
            v-if="item.type == 'input'"
            :disabled="disabled"
            v-model="formData[item.prop]"
            :size="item.size"
            :placeholder="item.placeholder"
            clearable
          ></fu-input>
          <fu-input-number
            v-if="item.type == 'input-num'"
            controls-position="right"
            :disabled="disabled"
            v-model="formData[item.prop]"
            :min="1"
            :size="item.size"
            :placeholder="item.placeholder"
            clearable
          ></fu-input-number>
          <fu-input
            v-else-if="item.type == 'textarea'"
            type="textarea"
            :disabled="disabled"
            v-model="formData[item.prop]"
            :size="item.size"
            :placeholder="item.placeholder"
            clearable
          ></fu-input>
          <fu-checkbox-group
            v-else-if="item.type == 'checkbox-group'"
            v-model="formData[item.prop]"
            :size="item.size"
          >
            <fu-checkbox
              v-for="i in item.option"
              :key="i.value"
              :label="i.value"
              :name="item.prop"
              :disabled="disabled"
              :size="item.size"
              >{{ i.text }}</fu-checkbox
            >
          </fu-checkbox-group>
          <common-select-tree
            v-else-if="item.type == 'select-tree'"
            v-model="formData[item.prop]"
            :read-value="formData[item.prop]"
            :selectId="`${item.prop}Select`"
            :treeId="`${item.prop}SelectTree`"
            :fu-data="item.option"
            :normal-data="item.normalData"
            :is-multiple="item.isMultiple"
            :check-strictly="true"
            :model-change-array="[formData, item.prop]"
            :size="'mini'"
            @selectTreeChange="
              (val) => {
                selectTreeChange(val, item.prop);
              }
            "
          ></common-select-tree>
          <fu-radio-group
            v-else-if="item.type == 'radio-group'"
            v-model="formData[item.prop]"
            :size="item.size"
          >
            <fu-radio
              v-for="i in item.option"
              :key="i.value"
              :label="i.value"
              :disabled="disabled"
              :size="item.size"
              >{{ i.text }}</fu-radio
            >
          </fu-radio-group>
          <fu-date-picker
            v-else-if="item.type == 'date-picker'"
            v-model="formData[item.prop]"
            format="yyyy年MM月dd日"
            value-format="yyyy-MM-dd"
            type="date"
            :placeholder="item.placeholder"
            :disabled="disabled"
            :size="item.size"
            clearable
            style="width: 400px"
          >
          </fu-date-picker>
          <fu-date-picker
            v-else-if="item.type === 'date-picker-double'"
            v-model="formData[item.prop]"
            @change="(val) => changeTime(val, item)"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :size="item.size"
          >
          </fu-date-picker>
          <fu-select
            v-else-if="item.type == 'select'"
            v-model="formData[item.prop]"
            :disabled="disabled"
            :placeholder="item.placeholder"
            :size="item.size"
            filterable
            clearable
          >
            <fu-option
              v-for="i in item.option"
              :key="i.value"
              :label="i.text"
              :value="i.value"
            >
            </fu-option>
          </fu-select>
          <fu-select
            v-else-if="item.type == 'select-edit'"
            v-model="formData[item.prop]"
            :placeholder="item.placeholder"
            :size="item.size"
            filterable
            clearable
            @change="selectEditChange(formData[item.prop], item.prop)"
          >
            <fu-option
              v-for="(i, index) in item.option"
              :key="i.value"
              :label="i.text"
              :value="i.value"
            >
              <div class="option_preview">
                <div>{{ i.text }}</div>
                <div class="option_preview_item">
                  <div>
                    <i
                      class="el-icon-edit"
                      @click.stop="optionEdit(i, item.prop)"
                    ></i>
                  </div>
                  <div>
                    <i
                      class="el-icon-delete"
                      @click.stop="optionDel(i, item.prop)"
                    ></i>
                  </div>
                </div>
              </div>
            </fu-option>
          </fu-select>
          <i
            v-if="item.isShowMore"
            title="多值输入"
            class="el-icon-more showMore"
            @click="showMoreClick(item.prop, item.label)"
          ></i>
        </fu-form-item>
      </div>
    </fu-form>
    <div v-show="isShowFilterBtn">
      <span class="query-button" @click="filterBtnClick">
        <span class="filterBtn">{{
          isShowScreenPanel ? "收起筛选" : "展开筛选"
        }}</span>
        <i v-if="!isShowScreenPanel" class="el-icon-arrow-down"></i>
        <i v-if="isShowScreenPanel" class="el-icon-arrow-up"></i>
      </span>
    </div>
    <custom-dialog
      v-if="customDialog.isShow"
      :isShowDialog="customDialog.isShow"
      :title="customDialog.title"
      :width="'50%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
      <div slot="body">
        <enter-more-words
          ref="dialogForm"
          :formObj="customDialog.formObj"
        ></enter-more-words>
      </div>
    </custom-dialog>
  </div>
</template>

<script>
import {
  Select,
  Option,
  Input,
  Form,
  FormItem,
  InputNumber,
  Radio,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  DatePicker,
  MessageBox,
  Message,
} from "fusion-ui";
import CommonSelectTree from "@/components/CommonSelectTree";
import CustomDialog from "@/components/CommonDialog";
import EnterMoreWords from "./components/EnterMoreWords";
import http from "@/utils/http";
export default {
  name: "ComponentFormItems",
  components: {
    FuSelect: Select,
    FuOption: Option,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuInputNumber: InputNumber,
    FuCheckboxGroup: CheckboxGroup,
    FuRadioGroup: RadioGroup,
    FuDatePicker: DatePicker,
    FuCheckbox: Checkbox,
    FuRadio: Radio,
    CommonSelectTree,
    CustomDialog,
    EnterMoreWords,
  },
  props: {
    FormItems: {
      required: true,
      type: Object,
    },
    FormData: {
      required: true,
      type: Object,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: { ...this.FormData },
      isShowScreenPanel: false,
      isShowFilterBtn: false,
      moreEnterCode: "",
      customDialog: {
        isShow: false,
        title: "",
        compType: "",
        formObj: {},
      },
    };
  },
  computed: {
    formItems() {
      return { ...this.FormItems };
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    const THAT = this;
    this.isJusdgeShowFilterBtn();
    window.onresize = function () {
      THAT.isJusdgeShowFilterBtn();
    };
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * @description   日期组件值改变时的回调，改变form表单的相应绑定值
     */
    changeTime(value, item) {
      if (value) {
        this.formData[item.modelDataStartKey] = value[0];
        this.formData[item.modelDataEndKey] = value[1];
      } else {
        //清空时
        this.formData[item.modelDataStartKey] = "";
        this.formData[item.modelDataEndKey] = "";
      }
    },
    filterBtnClick() {
      this.isShowScreenPanel = !this.isShowScreenPanel;
      let containForm = document.querySelector(".containForm");
      if (!containForm) return false;
      //获取表单下所有的formItem
      let containFormWidth = containForm.offsetWidth,
        allFormItems = containForm.querySelectorAll(".formItemDiv"),
        itemWidth = allFormItems[0].offsetWidth;
      this.isJudgeShowFirstLine(containFormWidth, allFormItems, itemWidth);
    },
    //下拉编辑框change事件
    selectEditChange(val, prop) {
      //找到对应的筛选条件
      let selectFilter = {};
      this.formItems.data.some((item) => {
        if (item.prop == prop) {
          let _option = item.option;
          _option.length &&
            _option.some((ite) => {
              if (ite.value == val) {
                selectFilter = JSON.parse(ite.templateValue);
                return true;
              }
            });
          return true;
        }
      });

      //重新赋值筛选条件
      for (let key in this.formData) {
        if (key != prop) {
          this.formData[key] = selectFilter[key];
        }
      }
      this.$set(this, "formData", this.formData);
    },
    /**
     * @description 清空表单
     */
    clearFormData() {
      for (let key in this.formData) {
        this.formData[key] = "";
      }
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
        this.$refs.dialogForm.submit((prop, data) => {
          this.formData[prop] = data;
          this.customDialog.isShow = false;
        });
      } else {
        //取消处理逻辑
        this.customDialog.isShow = false;
      }
    },
    /**
     * @description 输入多个查询
     * @param {}
     * @returns {}
     */
    showMoreClick(prop, label) {
      this.customDialog.isShow = true;
      this.customDialog.title = "多值输入";
      this.customDialog.formObj = {
        prop: prop,
        label: label,
        value: this.formData[prop],
      };
    },
    //判断是否显示展开筛选按钮
    isJusdgeShowFilterBtn() {
      let containForm = document.querySelector(".containForm");
      if (!containForm) return false;
      //获取表单下所有的formItem
      let containFormWidth = containForm.offsetWidth,
        allFormItems = containForm.querySelectorAll(".formItemDiv"),
        itemWidth = allFormItems[0].offsetWidth,
        formItemWidths = itemWidth * allFormItems.length;
      this.isShowFilterBtn = containFormWidth < formItemWidths ? true : false;
      //判断表单是否只展示第一行
      this.isJudgeShowFirstLine(containFormWidth, allFormItems, itemWidth);
    },
    isJudgeShowFirstLine(containFormWidth, allFormItems, itemWidth) {
      if (this.isShowFilterBtn) {
        if (this.isShowScreenPanel) {
          //全部展示
          this.formItems.data.forEach((item) => {
            item.isHide = false;
          });
        } else {
          //只展示第一行
          let _index = 0,
            formItemsComputWidth = 0;
          Array.from(allFormItems).some((item, index) => {
            formItemsComputWidth += itemWidth;
            if (formItemsComputWidth > containFormWidth) {
              _index = index;
              return true;
            }
          });
          this.formItems.data.forEach((item, index) => {
            item.isHide = index < _index ? false : true;
          });
        }
      } else {
        //全部展示
        this.formItems.data.forEach((item) => {
          item.isHide = false;
        });
      }
      this.$emit("changeFormItems", { ...this.formItems });
    },
    //下拉树选择的值改变之后，将当前选择的value赋值
    selectTreeChange(val, value) {
      this.$set(this.formData, value, val.value);
    },
    /**
     * @description 模板—————— 模板重命名
     */
    optionEdit(item, prop) {
      MessageBox.prompt("请修改模板名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^(\w|[\u4e00-\u9fa5]){2,}$/,
        inputErrorMessage: "仅支持汉字、数字、字母、下划线,且不得少于两位",
        inputValue: item.text,
      })
        .then(({ value }) => {
          let postData = {
            data: [
              { name: "templateId", vtype: "attr", data: item.value },
              { name: "newName", vtype: "attr", data: value },
            ],
          };
          http
            .post("/api/nkgl/v1/template/rename.do", {
              postData: JSON.stringify(postData),
            })
            .then((res) => {
              if (res.message == "success") {
                Message.success("修改成功");
                this.getTemplateOption(prop);
              } else {
                Message.error("修改失败");
              }
            })
            .catch((err) => {
              Message.error(`修改失败!，${err.errorMessage}`);
            });
        })
        .catch((item, prop) => {
          Message({
            type: "info",
            message: "取消修改",
          });
        });
    },
    /**
     * @description 模板—————— 删除
     */
    optionDel(item, prop) {
      let postData = {
        data: [{ name: "templateId", vtype: "attr", data: item.value }],
      };
      http
        .post("/api/nkgl/v1/template/delete.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          if (res.message == "success") {
            Message.success("删除成功");
            this.getTemplateOption(prop);
          } else {
            Message.error("删除失败");
          }
        })
        .catch((err) => {
          Message.error(`修改失败!，${err.errorMessage}`);
        });
    },
    /**
     * @description 模板查询
     * @param {}
     * @returns {}
     */
    getTemplateOption(prop) {
      http.post("/api/nkgl/v1/template/query.do").then((res) => {
        let result = res.data[0].data;
        this.formItems.data.some((item) => {
          if (item.prop == prop) {
            item.option = result;
            return true;
          }
        });
        this.$emit("changeFormItems", { ...this.formItems });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.contain {
  display: flex;
  .containForm {
    width: calc(100% - 100px);
  }
  .query-button {
    font-size: 14px;
    color: #0e92fe;
    cursor: pointer;
    padding-left: 10px;
    white-space: nowrap;
    position: relative;
    top: 10px;
  }
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .formItemDiv {
      white-space: nowrap;
    }
    .showMore {
      cursor: pointer;
      margin-left: 5px;
    }
  }
}
.option_preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:nth-child(0) {
    width: 80%;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .option_preview_item {
    display: flex;
    div {
      width: 20px;
      i:hover {
        color: red;
        cursor: pointer;
      }
    }
  }
}
.el-dropdown-menu /deep/.el-tree-node__content {
  padding-right: 18px;
}
.el-dropdown-menu /deep/.el-tree {
  max-height: 200px;
  overflow: auto;
}
/deep/ .el-form-item__content {
  width: 210px;
}
/deep/ .el-select {
  width: 210px;
}
/deep/ .el-range-editor--mini.el-input__inner {
  width: 100%;
}
</style>
