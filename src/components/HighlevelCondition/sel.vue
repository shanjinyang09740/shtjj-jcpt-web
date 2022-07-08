<template>
  <div>
    <fu-select v-model="item.columnName" clearable @change="changecolumnName">
      <fu-option
        v-for="i in conditionOptions"
        :key="i.prop"
        :label="i.label"
        :value="i.prop"
      >
      </fu-option>
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
  name: "selMore",
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
  methods: {
    changecolumnName(value) {
      this.conditionOptions.map((ele) => {
        if (ele.prop === value) {
          //类型不同 需要将类型进行修改 并且对数据进行清空处理
          if (this.item.dataType !== ele.type) {
            this.item.dataType = ele.type;
            this.item.value = "";
            this.item.operator = "";
          }
        }
      });
      console.log(value, "2222222222222222222222222222222222222222222");
    },
  },
};
</script>

<style lang="less" scoped></style>
