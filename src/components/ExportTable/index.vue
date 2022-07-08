<template>
  <div>
    <fu-form ref="baseForm" :fu-data="fuData" :rules="formRules">
      <fu-form-item
        v-for="(item, index) in formItems"
        :key="index"
        :label="item.label"
        :prop="item.prop"
      >
        <fu-select
          v-if="item.type == 'select'"
          v-model="fuData[item.prop]"
          :size="item.size"
          clearable
        >
          <fu-option
            v-for="item in item.option"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          >
          </fu-option>
        </fu-select>
        <el-transfer
          v-else-if="item.type == 'transfer'"
          v-model="fuData[item.prop]"
          filterable
          :data="item.option"
          :size="item.size"
          :titles="['请选择导出字段', '已选字段']"
          clearable
        ></el-transfer>
      </fu-form-item>
    </fu-form>
  </div>
</template>

<script>
import { Select, Option, Form, FormItem, Message } from "fusion-ui";
export default {
  name: "ExportTable",
  components: {
    FuSelect: Select,
    FuOption: Option,
    FuForm: Form,
    FuFormItem: FormItem,
  },
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
    formItems: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    fuData: {
      get() {
        return this.formData;
      },
      set(v) {
        this.$emit("updateFormData", v);
      },
    },
  },
  data() {
    return {
      formRules: {
        type: [
          { required: true, message: "请选择导出格式", trigger: "change" },
        ],
        columns: [
          { required: true, message: "请选择导出字段", trigger: "change" },
        ],
      },
    };
  },
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
     * @description 提交表单数据
     * @params {Function} callback
     */
    submit(callback) {
      this.$refs["baseForm"].$refs.el.validate((valid) => {
        if (valid) {
          callback(this.formData, "ExportTable");
        } else {
          Message.warning("请检查是否有必填项未填");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
