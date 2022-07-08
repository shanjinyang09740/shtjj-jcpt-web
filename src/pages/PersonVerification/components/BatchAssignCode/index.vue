<template>
  <fu-form
    class="containForm"
    :fu-data="formData"
    ref="baseForm"
    :inline="true"
    :rules="formRules"
  >
    <fu-form-item label="赋码执行范围" prop="codeRange" label-width="140px">
      <fu-radio-group v-model="formData.codeRange">
        <fu-radio v-for="i in option" :key="i.value" :label="i.value">{{
          i.text
        }}</fu-radio>
      </fu-radio-group>
    </fu-form-item>
  </fu-form>
</template>

<script>
import { Form, FormItem, Radio, RadioGroup } from "fusion-ui";
export default {
  name: "BatchAssignCode",
  components: {
    FuForm: Form,
    FuFormItem: FormItem,
    fuRadio: Radio,
    fuRadioGroup: RadioGroup,
  },
  props: {},
  data() {
    return {
      formData: {},
      option: [
        {
          text: "全量",
          value: "total",
        },
        {
          text: "增量",
          value: "add",
        },
      ],
      formRules: {
        codeRange: {
          required: true,
          message: "请选择赋码执行范围",
          trigger: "change",
        },
      },
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

<style lang="less" scoped></style>
