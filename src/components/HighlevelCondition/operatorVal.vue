<template>
  <div>
    <fu-select v-model="item.operator" clearable @change="changeValue">
      <template v-if="item.dataType === 'TEXT'">
        <fu-option
          v-for="item in operatorJsonText"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </fu-option>
      </template>
      <template v-else-if="item.dataType === 'NUMBER'">
        <fu-option
          v-for="item in operatorJsonNumber"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </fu-option>
      </template>
      <template v-else-if="item.dataType === 'CODE'">
        <fu-option
          v-for="item in operatorJsonCode"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </fu-option>
      </template>
      <template v-else>
        <fu-option
          v-for="item in []"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </fu-option>
      </template>
    </fu-select>
  </div>
</template>

<script>
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
  name: "operator",
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
      operatorJsonText: [
        {
          value: "like",
          label: "包含",
        },
        {
          value: "notLike",
          label: "不包含",
        },
        {
          value: "likeStart",
          label: "开始于",
        },
        {
          value: "likeEnd",
          label: "结束于",
        },
        {
          value: "likeequal",
          label: "等于",
        },
        {
          value: "notEqual",
          label: "不等于",
        },
        {
          value: "isNull",
          label: "为空",
        },
        {
          value: "isNotNull",
          label: "不为空",
        },
      ],
      operatorJsonCode: [
        {
          value: "equal",
          label: "等于",
        },
        {
          value: "in",
          label: "在...中",
        },
        {
          value: "isNull",
          label: "为空",
        },
        {
          value: "isNotNull",
          label: "不为空",
        },
      ],
      operatorJsonNumber: [
        {
          value: "greaterThan",
          label: "大于",
        },
        {
          value: "greaterThanEqual",
          label: "大于等于",
        },
        {
          value: "lessThan",
          label: "小于",
        },
        {
          value: "lessThanEqual",
          label: "小于等于",
        },
        {
          value: "equal",
          label: "等于",
        },
        {
          value: "notEqual",
          label: "不等于",
        },
        {
          value: "isNull",
          label: "为空",
        },
        {
          value: "isNotNull",
          label: "不为空",
        },
      ],
    };
  },
  methods: {
    changeValue(value) {
      if (value === "isNotNull" || value == "isNull") {
        this.item.value = "";
      }
    },
  },
};
</script>

<style lang="less" scoped></style>
