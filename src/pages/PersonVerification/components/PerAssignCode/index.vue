<template>
  <fu-form
    class="containForm"
    :fu-data="formData"
    ref="baseForm"
    :inline="true"
    :rules="formRules"
  >
    <fu-form-item label="行业代码" prop="IndustryCode" label-width="140px">
      <select-tree
        v-model="formData.IndustryCode"
        :treeData="selectTreeData"
      ></select-tree>
    </fu-form-item>
  </fu-form>
</template>

<script>
import { Form, FormItem, Message } from "fusion-ui";
import SelectTree from "../SelectTree";
import http from "@/utils/http";
import { transformTozTreeFormat, postDicData } from "@/utils/tool";
export default {
  name: "PerAssignCode",
  components: {
    SelectTree,
    FuForm: Form,
    FuFormItem: FormItem,
  },
  props: {},
  data() {
    return {
      formData: {},
      selectTreeData: [],
      formRules: {
        IndustryCode: {
          required: true,
          message: "请选择行业代码",
          trigger: "change",
        },
      },
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    //初始化数据
    this.initData();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //初始化数据
    async initData() {
      //获取行业树数据
      let { data } = await postDicData("IndustryCode");
      let tempData = data[0].data.map((item) => {
        return {
          ...item,
          label: item.text,
        };
      });
      this.selectTreeData = transformTozTreeFormat(tempData);
    },
    /**
     * @description 提交数据
     * @param {}
     * @returns {}
     */
    submit(callback) {
      this.$refs.baseForm.$refs.el.validate((valid) => {
        if (valid) {
          callback(this.formData, "PerAssignCode");
        }
      });
    },
  },
};
</script>

<style lang="less" scoped></style>
