<template>
  <div class="select-tree">
    <fu-select
      v-model="selectValue"
      :popper-append-to-body="false"
      @focus="getTreeData"
      size="medium"
      style="width: 100%"
    >
      <fu-input
        style="width: 100%"
        v-model="filterText"
        size="mini"
        clearable
      ></fu-input>
      <fu-option
        style="width: 100%"
        :value="selectValue"
        :label="selectValue"
        class="options"
      >
        <fu-tree
          style="width: 100%; overflow: auto"
          :fu-data="treeData"
          ref="selectTree"
          node-key="id"
          :props="defaultProps"
          :show-checkbox="showCheckBox"
          :check-strictly="true"
          :default-expand-all="false"
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
import { Select, Option, Input } from "fusion-ui";
import { get } from "@/utils/http";
export default {
  components: {
    FuSelect: Select,
    FuOption: Option,
    FuInput: Input,
  },
  props: {
    reqUrl: {
      type: String,
      default: "",
    },
    selectData: {
      type: String,
      default: "",
    },
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
    // 是否单选
    checkedOne: {
      type: Boolean,
      default: true,
    },
    showCheckBox: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      detailForm: {},
      filterText: "",
      treeData: [],
    };
  },
  computed: {
    selectValue: {
      get() {
        return this.selectData;
      },
      set(val) {
        this.$emit("selectData", val);
      },
    },
  },
  watch: {
    filterText: debounce(function handler(val) {
      this.$refs.selectTree.$refs.el.filter(val);
    }, 1000),
  },
  methods: {
    getTreeData() {
      get(this.reqUrl)
        .then((res) => {
          let data = res.data[0].data;
          if (data) {
            this.treeData = data;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    handleCheckChange(data, checked, indeterminate) {
      let ckeys = this.$refs.selectTree.$refs.el.getCheckedKeys();
      if (ckeys.length === 0) {
        this.selectValue = "";
      }
      if (this.checkedOne && checked === true) {
        //选择其他选项  控制单选
        this.$refs.selectTree.$refs.el.setCheckedNodes([data]);
        this.selectValue = data.id;
      } else {
        this.selectValue = ckeys;
      }
    },
    // 切换选项
    nodeClick(data) {
      if (this.checkedOne) {
        this.$refs.selectTree.$refs.el.setCheckedNodes([data]);
        this.selectValue = data.id;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.select-tree {
  width: 100%;
}
</style>
