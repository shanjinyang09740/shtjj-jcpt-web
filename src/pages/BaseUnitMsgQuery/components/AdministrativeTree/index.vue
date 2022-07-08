<template>
  <div class="content">
    <component-tree
      :treeData="treeData"
      :searchText="filterText"
      :isNeedFilter="true"
      @node-click="handleNodeClick"
      :defaultProps="defaultProps"
      :expandNodes="expandNodes"
      :treeId="treeId"
      ref="treeChild"
    ></component-tree>
  </div>
</template>

<script>
import ComponentTree from "@/components/CommonTree/index.vue";
import http from "@/utils/http";
import { transformTozTreeFormat, postDicData } from "@/utils/tool";
export default {
  name: "AdministrativeTree",
  components: {
    ComponentTree,
  },
  props: {},
  data() {
    return {
      treeId: "AdministrativeTree",
      treeListData: [],
      treeData: [],
      expandNodes: [],
      selecTreeNode: {},
      selecTreeParentNode: {},
      filterText: "",
      isShowDialog: false,
      dialogTitle: "编辑",
      dialogComp: "",
      postFormData: {},
      rightClickList: [
        {
          id: 2,
          label: "编辑",
          callBack: "editTree",
        },
        {
          id: 3,
          label: "删除",
          callBack: "deleteTree",
        },
      ],
      defaultProps: {
        children: "children",
        label: "text",
        id: "id",
      },
    };
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
    this.initTreeData();
  },
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    //获取当前高亮节点
    getCurrentHightLightNode() {
      return this.$refs.treeChild.getCurrentNode();
    },
    /**
     * @description 初始化数据
     */
    async initTreeData() {
      let { data } = await postDicData("AdministrativeDivision");
      this.treeData = transformTozTreeFormat(data[0].data);
      if (this.treeData.length) {
        this.$nextTick(() => {
          //初始化点击记录的高亮节点
          this.expandNodes = [];
          let highLightNode = {};
          // 默认高亮选中节点
          if (this.treeData[0].children && this.treeData[0].children.length) {
            highLightNode = this.treeData[0];
            this.expandNodes.push(highLightNode.id);
            this.$refs.treeChild.setCurrentKeyHeightLight(highLightNode.id);
            this.handleNodeClick(highLightNode);
          }
        });
      }
    },
    //树节点点击事件
    handleNodeClick(data) {
      this.selecTreeNode = data;
      this.$emit("treeNodeClick", data);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  height: 100%;
}
.treeHead {
  padding: 10px 0 4px 10px;
}
.operate {
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
}
.input-with-select {
  width: 98%;
}
</style>
