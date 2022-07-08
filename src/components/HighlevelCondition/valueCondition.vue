<template>
  <div v-show="!(item.operator === 'isNotNull' || item.operator === 'isNull')">
    <template v-if="item.dataType === 'TEXT'">
      <fu-input
        v-model="item.value"
        clearable
        placeholder="请输入文本"
      ></fu-input>
    </template>
    <template v-else-if="item.dataType === 'CODE'">
      <fu-select
        v-model="item.value"
        clearable
        placeholder="请选择code类型"
        multiple="isTipMore"
      >
        <fu-option
          v-for="(item, index) in options"
          :key="index"
          :label="item.value"
          :value="item.key"
        >
        </fu-option>
      </fu-select>
    </template>
    <template v-else-if="item.dataType === 'NUMBER'">
      <fu-input
        v-model="item.value"
        clearable
        placeholder="请输入数字"
      ></fu-input>
    </template>
    <template v-else> </template>
  </div>
</template>

<script>
// import { reqcodeList } from "./preview_api";
import {
  Form,
  FormItem,
  Button,
  Input,
  MessageBox,
  Select,
  Option,
  Message,
} from "fusion-ui";
export default {
  name: "valueCondition",
  components: {
    FuForm: Form,
    FuFormItem: FormItem,
    FuButton: Button,
    FuInput: Input,
    FuMessageBox: MessageBox,
    FuSelect: Select,
    FuOption: Option,
    Message: Message,
  },
  props: ["item", "conditionOptions"],
  data() {
    return {
      options: [],
      isTipMore: false,
    };
  },
  computed: {
    errors() {
      return this.$vuerify.$errors;
    },
  },
  watch: {
    "item.columnName": {
      deep: true,
      handler(value) {
        let Data = this.conditionOptions.filter((ele) => ele.prop === value);
        if (Data.length === 1) {
          let item = Data[0];
          if (item.dataType === "CODE") {
            // reqcodeList(item.list, item.type)
            //   .then((result) => {
            //     let listCode = result.data[0].data;
            //     this.options = listCode;
            //   })
            //   .catch(() => {
            //     Message.error("抱歉，请求失败！");
            //     this.options.splice();
            //   });
          }
        } else {
          Message.error("抱歉，获取下拉列表失败！");
          this.options.splice();
        }
      },
    },
    "item.operator": {
      deep: true,
      handler(value) {
        if (value === "in") {
          this.isTipMore = true;
        } else {
          this.isTipMore = false;
        }
      },
    },
  },
};
</script>

<style lang="less" scoped></style>
