<template>
  <fu-dialog
    :title="title"
    top="1vh"
    width="500px"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <fu-form ref="detailForm" label-width="100px" :fu-data="detailForm">
      <fu-form-item
        v-show="item.displayHide !== '3'"
        v-for="(item, index) in formItems"
        :key="index"
        :label="item.label"
        :prop="item.code"
        :required="item.displayHide === '1'"
      >
        <template>
          <fu-input
            v-if="item.controlType === 'text'"
            v-model="detailForm[item.code]"
            :disabled="isDisabled"
            placeholder="请输入"
            style="width: 100%"
            size="medium"
          ></fu-input>
          <fu-select
            v-if="item.controlType === 'radio_list'"
            v-model="detailForm[item.code]"
            :disabled="isDisabled"
            :multiple="false"
            placeholder="请选择"
            @focus="getData(item)"
            style="width: 100%"
            size="medium"
          >
            <fu-option
              v-for="i in item.options"
              :key="i.value"
              :label="i.text"
              :value="i.value"
            >
            </fu-option>
          </fu-select>
          <fu-select
            v-if="item.controlType === 'mult_list'"
            v-model="detailForm[item.code]"
            :disabled="isDisabled"
            :multiple="true"
            placeholder="请选择"
            @focus="getData(item)"
            style="width: 100%"
            size="medium"
          >
            <fu-option
              v-for="i in item.options"
              :key="i.value"
              :label="i.text"
              :value="i.value"
            >
            </fu-option>
          </fu-select>
          <fu-date-picker
            v-if="item.controlType === 'date'"
            v-model="detailForm[item.code]"
            :disabled="isDisabled"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
            style="width: 100%"
            size="medium"
          >
          </fu-date-picker>
          <select-tree
            v-if="item.controlType === 'radio_tree'"
            :selectData.sync="detailForm[item.code]"
            :checkedOne="true"
            :showCheckBox="true"
            :reqUrl="item.controlJson"
            :disabled="isDisabled"
          ></select-tree>
          <select-tree
            v-if="item.controlType === 'mult_tree'"
            :selectData.sync="detailForm[item.code]"
            :checkedOne="false"
            :showCheckBox="true"
            :reqUrl="item.controlJson"
            :disabled="isDisabled"
          ></select-tree>
        </template>
      </fu-form-item>
    </fu-form>
    <span slot="footer">
      <fu-button type="primary" @click="submit">确定</fu-button>
      <fu-button @click="closeDialog">取消</fu-button>
    </span>
  </fu-dialog>
</template>
<script>
import {
  Select,
  Option,
  Button,
  Input,
  Form,
  FormItem,
  Dialog,
  DatePicker,
} from "fusion-ui";
import SelectTree from "./selectTree.vue";
import { get } from "@/utils/http";
export default {
  components: {
    FuSelect: Select,
    FuOption: Option,
    FuButton: Button,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuDialog: Dialog,
    FuDatePicker: DatePicker,
    SelectTree,
  },
  props: {
    title: {
      type: String,
      default: "新建详情",
    },
    formItems: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      detailForm: {},
      dialogVisible: true,
      isDisabled: false,
    };
  },
  created() {
    if (this.title.indexOf("查看")) {
      this.isDisabled = true;
    }
  },
  methods: {
    getData(item) {
      get(item.controlJson)
        .then((res) => {
          let data = res.data[0].data;
          if (data) {
            this.$set(item, "option", data);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    submit() {
      this.$emit("submit", this.detailForm);
    },
    closeDialog() {
      this.$emit("close");
      this.dialogVisible = false;
    },
  },
};
</script>
<style lang="less" scoped></style>
