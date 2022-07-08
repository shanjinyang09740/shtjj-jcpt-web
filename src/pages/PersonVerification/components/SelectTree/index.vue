<template>
  <div>
    <fu-select
      :popper-append-to-body="false"
      class="select-tree"
      v-model="selectTreeValue"
      placeholder="请选择"
    >
      <fu-input v-model="filterText" size="mini" clearable></fu-input>
      <fu-option :value="selectId" :label="selectLabel" class="options">
        <fu-tree
          :fu-data="treeData"
          ref="selectTreeDom"
          :node-key="defaultProps.id"
          :props="defaultProps"
          :show-checkbox="true"
          :check-strictly="true"
          @check-change="handleCheckChange"
          @node-click="nodeClick"
          :filter-node-method="filterNode"
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
  name: "",
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
          label: "label",
          id: "id",
        };
      },
    },
    treeData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    checkedNode: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.handleCheckChange(val, true);
          });
        }
      },
      immediate: true,
      deep: true,
    },
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      filterText: "",
      selectTreeValue: "",
      selectId: "",
      selectLabel: "",
    };
  },
  watch: {
    filterText: debounce(function handler(val) {
      this.$refs.selectTreeDom.$refs.el.filter(val);
    }, 1000),
    selectId: {
      handler(val) {
        this.$emit("input", val);
      },
    },
    checkedNode: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.handleCheckChange(val, true);
          });
        }
      },
      immediate: true,
      deep: true,
    },
    value: {
      handler(val) {
        this.selectTreeValue = val;
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
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
        node.data && node.data.label && node.data.label.indexOf(value) !== -1;
      isPass ? _array.push(isPass) : "";
      if (!isPass && node.level != 1 && node.pId) {
        this.getReturnNode(node.pId, _array, value);
      }
    },
    handleCheckChange(data, checked) {
      let ckeys = this.$refs.selectTreeDom.$refs.el.getCheckedNodes();
      if (ckeys.length === 0) {
        this.selectLabel = "";
        this.selectId = "";
      }
      if (checked == true) {
        //选择其他选项  控制单选
        this.selectId = data.id;
        this.selectLabel = data.label;
        this.$refs.selectTreeDom.$refs.el.setCheckedNodes([data]);
        this.$emit("getSelectData", data);
      }
    },
    // 切换选项
    nodeClick(data) {
      if (data.disabled) {
        return;
      }
      this.selectId = data.id;
      this.selectLabel = data.label;
      this.$emit("getSelectData", data);
      this.$refs.selectTreeDom.$refs.el.setCheckedNodes([data]);
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-input {
  width: 300px;
}
/deep/.select-tree {
  //改变下拉树的样式
  .el-select-dropdown {
    .el-select-dropdown__item {
      max-height: 281px;
      padding: 0;
      // overflow-y: auto;
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
