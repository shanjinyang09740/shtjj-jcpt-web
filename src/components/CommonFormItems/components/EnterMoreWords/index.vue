<template>
  <div>
    <fu-form class="moreForm">
      <fu-form-item :label="formObj.label" :prop="formObj.prop">
        <fu-input
          type="textarea"
          v-model="resultData"
          :size="'medium'"
          clearable
        ></fu-input>
        <span class="tip"
          >说明：当输入多个值时请使用英文逗号“,”分隔，如：9001231,9003456,9006453</span
        >
      </fu-form-item>
    </fu-form>
  </div>
</template>

<script>
import { Input, Form, FormItem, Message } from "fusion-ui";
export default {
  name: "EnterMoreWords",
  components: {
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
  },
  props: {
    formObj: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      resultData: this.formObj.value,
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    submit(callback) {
      let result = this.resultData.split(",");
      let newArr = result.filter(
        (item) => !["", null, undefined, NaN, false, true].includes(item)
      );
      if (newArr.length) {
        callback(this.formObj.prop, newArr.join(","));
      } else {
        Message.warning("请确认输入的字符是否为空及是否以英文逗号分隔!");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tip {
  color: red;
}
.moreForm {
  /deep/ .el-form-item__content {
    width: 90%;
  }
}
</style>
