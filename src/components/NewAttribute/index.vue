<template>
  <div>
    <fu-dialog
      class="dialog-form"
      @close="closeDialog"
      title="新建属性"
      width="50%"
      top="5vh"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      append-to-body
    >
      <div class="dialog-body">
        <fu-form
          class="add-form"
          ref="addForm"
          :rules="addFormRules"
          :fu-data="addForm"
        >
          <template v-for="formI in addFormPage">
            <fu-form-item
              class="add-form-item"
              v-if="formI.type !== 'textarea'"
              :label="formI.label"
              label-width="130px"
              :key="formI.model"
              :prop="formI.model"
            >
              <fu-select
                v-if="formI.type === 'select'"
                :placeholder="'请选择' + formI.label"
                clearable
                v-model="addForm[formI.model]"
                :fu-request="formI.req"
                :fu-id="formI.model"
                size="medium"
                style="width: 75.5%"
                :disabled="disabled"
                :multiple="formI.multiple"
              >
                <fu-option
                  v-for="item in codeListOption(formI.model)"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                >
                </fu-option>
              </fu-select>
              <fu-input
                v-else-if="formI.type === 'input'"
                size="medium"
                v-model="addForm[formI.model]"
                style="width: 75.5%"
                :placeholder="'请输入' + formI.label"
                :disabled="disabled"
              ></fu-input>
              <fu-input
                v-else-if="formI.type === 'num'"
                size="medium"
                type="number"
                class="input-number"
                v-model="addForm[formI.model]"
                style="width: 75.5%"
                :placeholder="'请输入' + formI.label"
                :disabled="disabled"
              ></fu-input>
              <fu-radio-group
                v-else-if="formI.type === 'radio'"
                v-model="addForm[formI.model]"
              >
                <fu-radio
                  v-for="item in formI.options"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.text }}</fu-radio
                >
              </fu-radio-group>
              <span v-else>
                {{ addForm[formI.model] }}
              </span>
            </fu-form-item>
            <div
              v-if="formI.type === 'textarea'"
              :key="formI.model"
              style="width: 90%"
            >
              <fu-form-item
                :label="formI.label"
                label-width="130px"
                :key="formI.model"
                :prop="formI.model"
              >
                <fu-input
                  style="width: 100%"
                  :autosize="{ minRows: 4, maxRows: 10 }"
                  size="medium"
                  type="textarea"
                  placeholder="请输入内容"
                  v-model="addForm[formI.model]"
                  :disabled="disabled"
                ></fu-input>
              </fu-form-item>
            </div>
          </template>
        </fu-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <fu-button type="primary" size="medium" @click="handleClickSave"
          >保存</fu-button
        >
        <!-- <fu-button plain size="medium" @click="closeDialog">返回</fu-button> -->
      </div>
    </fu-dialog>
  </div>
</template>

<script>
import {
  Dialog,
  Input,
  Form,
  FormItem,
  Button,
  Select,
  Radio,
  RadioGroup,
  Message,
  Option,
} from "fusion-ui";
import { addBasicAttribute } from "@/service";

export default {
  name: "mainTable",
  components: {
    FuDialog: Dialog,
    FuInput: Input,
    FuSelect: Select,
    FuForm: Form,
    FuFormItem: FormItem,
    FuRadio: Radio,
    FuRadioGroup: RadioGroup,
    FuButton: Button,
    FuOption: Option,
  },
  props: {
    dialogVisible: {
      type: Boolean,
    },
    type: {
      type: String,
      default: "add",
    },
    currentData: {
      type: Object,
    },
  },
  data() {
    return {
      disabled: false,
      addFormPage: [
        {
          label: "名称",
          type: "input",
          options: [],
          model: "proLabel",
        },
        {
          label: "英文名",
          type: "input",
          options: [],
          model: "proCode",
        },
        {
          label: "简称",
          type: "input",
          options: [],
          model: "proAlias",
        },
        {
          label: "数据类型",
          type: "select",
          options: [],
          model: "proDataType",
          req: {
            // url: "/api/core/v1/dictionary/queryData.do?dicId=HYSLX",
            // params: [],
          },
        },
        {
          label: "属性类型",
          type: "select",
          options: [],
          model: "proBasicType",
          req: {
            // url: "/api/core/v1/dictionary/queryData.do?dicId=HYSLX",
            // params: [],
          },
        },
        {
          label: "展示控件类型",
          type: "select",
          options: [],
          model: "controlType",
          req: {
            // url: "/api/core/v1/dictionary/queryData.do?dicId=HYSLX",
            // params: [],
          },
        },
        {
          label: "控件URL",
          type: "input",
          options: [],
          model: "controlUrl",
        },
        {
          label: "数据最大长度",
          type: "input",
          options: [],
          model: "proLength",
        },
        {
          label: "默认显示与必填",
          type: "radio",
          options: [
            {
              value: "0",
              text: "两者都是",
            },
            {
              value: "1",
              text: "仅默认显示",
            },
            {
              value: "2",
              text: "两者都不是",
            },
          ],
          model: "displayHide",
        },
        // {
        //   label: "整理项",
        //   type: "radio",
        //   options: [
        //     {
        //       value: "0",
        //       text: "是",
        //     },
        //     {
        //       value: "1",
        //       text: "否",
        //     },
        //   ],
        //   model: "zhenglixiang",
        // },

        {
          label: "说明",
          type: "textarea",
          options: [],
          model: "proExplain",
        },
        {
          label: "备注",
          type: "textarea",
          options: [],
          model: "proComment",
        },
      ],
      addForm: {
        proLabel: "",
        proCode: "",
        proAlias: "",
        proDataType: "数据类型",
        proBasicType: "属性类型",
        controlType: "控件类型",
        controlUrl: "",
        displayHide: "",
        proLength: "",
        proExplain: "",
        proComment: "",
      },
      //表单验证规则
      addFormRules: {
        daima: [{ required: true, message: "请输入代码", trigger: "blur" }],
        proLabel: [{ required: true, message: "请输入名称", trigger: "blur" }],
        proCode: [{ required: true, message: "请输入英文名", trigger: "blur" }],
        proAlias: [{ required: true, message: "请输入简称", trigger: "blur" }],
        proDataType: [
          { required: true, message: "请选择数据类型", trigger: "change" },
        ],
        proBasicType: [
          { required: true, message: "请选择属性类型", trigger: "change" },
        ],
        proLength: [
          { required: true, message: "请输入数据最大长度", trigger: "blur" },
        ],
        proExplain: [
          { required: true, message: "请输入说明", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    codeListOption() {
      return function (id) {
        return this.$store.state.reqData[id] || [];
      };
    },
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        if (this.type === "edit") {
          this.$set(this, "addForm", this.currentData);
          // this.$set(
          //   this.addForm,
          //   "roomType",
          //   this.currentData.roomType.split(",")
          // );
          console.log(this.addForm);
          this.disabled = false;
        } else {
          this.disabled = false;
        }
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * @description 保存
     */
    handleClickSave() {
      //表单校验
      this.$refs.addForm.$refs.el.validate(async (valid) => {
        if (valid) {
          const postData = JSON.parse(JSON.stringify(this.addForm));
          // postData.roomType = postData.roomType.join(",");
          console.log("postData", postData);
          //TODO调接口
          const { data } = await addBasicAttribute(postData);
          console.log("data", data);
          // if (data[0].data.msg === "success") {
          //   Message.success("操作成功");
          //   this.closeDialog("success");
          // }
        }
      });
    },

    /**
     * @description 返回
     */
    closeDialog(type) {
      this.$emit("closeDialog", type);
      this.$refs.addForm.$refs.el.resetFields();
    },
  },
};
</script>

<style lang="less" scoped>
.dialog-body {
  overflow: auto;
  height: 520px;
}
// .add-form {
//   display: flex;
//   flex-wrap: wrap;
//   .add-form-item {
//     width: 100%;
//   }
// }
.input-number {
  /deep/input {
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    -moz-appearance: textfield;
  }
}
/deep/ .el-dialog__header {
  text-align: center;
  background-color: #409eff;
  .el-dialog__title {
    color: #fff;
  }
}
/deep/ .el-dialog__footer {
  padding: 10px 20px 10px;
  text-align: center;
  background-color: #ebeef5;
}
/deep/ .el-dialog__body {
  padding: 10px 10px;
}
</style>
