<template>
  <div>
    <fu-select
      :popper-append-to-body="false"
      class="select-tree"
      v-model="selectTreeValue"
      :size="size"
      clearable
      @clear="clearSelect()"
    >
      <fu-input v-model="filterText" :size="size" clearable></fu-input>
      <fu-option
        :value="selectValue"
        :size="size"
        :label="selectLabel"
        class="options"
      >
        <fu-tree
          :fu-data="fuData"
          :ref="treeId"
          :node-key="defaultProps.id"
          :props="defaultProps"
          :show-checkbox="showCheckbox"
          :expand-on-click-node="false"
          :is-multiple="isMultiple"
          :check-strictly="checkStrictly"
          :check-on-click-node="true"
          :default-checked-keys="defaultCheckedKeys"
          @check="handleCheckChange"
          @node-click="handleCheckChange"
          :filter-node-method="filterNode"
          :size="size"
        >
        </fu-tree>
      </fu-option>
    </fu-select>
  </div>
</template>
<script>
const debounce = function (fn, delay) {
  let timer = null;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, delay);
  };
};
import { Input, Select, Option, Tree } from "fusion-ui";
export default {
  name: "CommonSelectTree",
  components: {
    FuInput: Input,
    FuSelect: Select,
    FuOption: Option,
    FuTree: Tree,
  },
  props: {
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: "children",
          label: "text",
          id: "id",
        };
      },
    },
    treeId: {
      type: String,
      default: "selectTree",
    },
    //正常数据
    normalData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fuData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isMultiple: {
      type: Boolean,
      default: true,
    },
    showCheckbox: {
      type: Boolean,
      default: true,
    },
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    modelChangeArray: {
      type: Array,
      default: () => {
        return [];
      },
    },
    size: {
      type: String,
      default: "medium",
    },
    //请求回来第一次读取的数据
    readValue: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      defaultCheckedKeys: [],
      loading: false,
      filterText: "",
      selectTreeValue: "",
      selectValue: "",
      selectLabel: "",
    };
  },
  watch: {
    filterText: debounce(function handler(val) {
      this.$refs[this.treeId].$refs.el.filter(val);
    }, 1000),
    readValue: {
      immediate: true,
      handler: function (newVal) {
        this.Echo();
      },
    },
  },
  computed: {},
  created() {},
  methods: {
    Echo() {
      let checkDataArr = [];
      if (!this.readValue) {
        this.selectTreeValue = "";
        this.selectValue = "";
        this.selectLabel = "";
      } else {
        //处理下拉树回显逻辑
        let backValueArr = this.readValue.split(",");
        checkDataArr = this.normalData.filter(
          (item) => backValueArr.indexOf(item.value) !== -1
        );
        let valuesArr = [],
          textsArr = [];
        this.defaultCheckedKeys = [];
        checkDataArr.forEach((item) => {
          this.defaultCheckedKeys.push(item.id);
          valuesArr.push(item.value);
          textsArr.push(item.text);
        });
        this.selectTreeValue = valuesArr.join(",");
        this.selectValue = valuesArr.join(",");
        this.selectLabel = textsArr.join("，");
      }
      this.$nextTick(() => {
        this.$refs[this.treeId].$refs.el.setCheckedNodes(checkDataArr);
      });
    },
    /**清空下拉树内的值 */
    clearSelect() {
      //清空树的选中节点
      this.selectTreeValue = "";
      this.selectValue = "";
      this.selectLabel = "";
      this.filterText = "";
      this.$refs[this.treeId].$refs.el.setCheckedNodes([]);
      this.change();
    },
    //优化之后的代码 不管有几级都可以适用
    filterNode(value, data, node) {
      if (!value) {
        return true;
      }
      let _array = []; //这里使用数组存储 只是为了存储值。
      this.getReturnNode(node, _array, value);
      let result = false;
      _array.forEach((item) => {
        result = result || item;
      });
      return result;
    },
    getReturnNode(node, _array, value) {
      let isPass =
        node.data && node.data.text && node.data.text.indexOf(value) !== -1;
      isPass ? _array.push(isPass) : "";
      if (!isPass && node.level != 1 && node.pId) {
        this.getReturnNode(node.pId, _array, value);
      }
    },
    change() {
      if (this.modelChangeArray.length === 0) {
        this.$emit("selectTreeChange", {
          value: this.selectValue,
          label: this.selectLabel,
        });
      } else {
        this.$emit("selectTreeChange", {
          value: this.selectTreeValue,
          label: this.selectLabel,
        });
      }
    },
    handleCheckChange(node) {
      if (this.isMultiple) {
        let ckeys = this.$refs[this.treeId].$refs.el.getCheckedNodes();
        let texts = [],
          values = [],
          idArr = [];
        ckeys.forEach((item) => {
          texts.push(item.text);
          values.push(item.value);
          idArr.push(item.id);
        });
        this.selectTreeValue = values.join(",");
        this.selectValue = values.join(",");
        this.selectLabel = texts.join("，");
      } else {
        this.selectTreeValue = node.value;
        this.selectValue = node.value;
        this.selectLabel = node.text;
      }
      this.change();
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.select-tree {
  //改变下拉树的样式
  .el-select-dropdown {
    .el-select-dropdown__item {
      max-height: 281px;
      padding: 0;
      overflow: auto;
      height: 100%;
      width: 290px;
      .el-tree {
        display: inline-block;
        min-width: 100%;
      }
    }
    .el-scrollbar {
      .el-scrollbar__wrap {
        overflow: hidden;
      }
      .el-select-dropdown__list {
        margin: 0 0 0 3px;
        .el-input {
          width: 93%;
        }
      }
    }

    .el-scrollbar__bar.is-vertical {
      display: none;
    }
    .el-select-dropdown__wrap {
      max-height: 314px;
      margin-bottom: 0 !important; //覆盖行内样式
    }
  }
}
</style>
