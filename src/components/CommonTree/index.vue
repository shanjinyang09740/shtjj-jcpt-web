<template>
  <div class="treeContainer" :id="treeId">
    <div class="treeTop">
      <fu-input
        size="medium"
        suffix-icon="el-icon-search"
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        v-if="isNeedFilter"
      >
      </fu-input>
      <div class="dragSwitch" v-if="showDragSwitch">
        <span>允许拖拽</span>
        <fu-switch v-model="isAllowDrag" active-color="#13ce66"> </fu-switch>
      </div>
    </div>
    <fu-tree
      :ref="treeId"
      :fu-id="treeId"
      :fu-data="treeData"
      :slotScope="true"
      :props="defaultProps"
      :node-key="defaultProps.id"
      :filter-node-method="filterNode"
      :draggable="isDragable || isAllowDrag"
      :show-checkbox="showCheckbox"
      v-bind="$attrs"
      v-on="$listeners"
      highlight-current
      :allow-drop="allowDrop"
      :default-expanded-keys="expandNodes"
      @node-drop="handleDrop"
      @node-contextmenu="rightClick"
      @request-completed="completed"
    >
      <span class="custom-tree-node" slot-scope="{ data }">
        <span :title="data[defaultProps.label]">
          <i v-if="!data.children" class="treeIcon childIcon"></i>
          <span :class="[data.status === '1' ? 'highlight' : '']">{{
            data[defaultProps.label]
          }}</span>
        </span>
      </span>
    </fu-tree>

    <div
      id="menu"
      class="menu"
      v-show="menuStyle.isShow"
      :style="{ top: menuStyle.top + 'px', left: menuStyle.left + 'px' }"
    >
      <ul>
        <li
          class="menu__item"
          v-for="item in rightClickList"
          :key="item.id"
          @click="menuClick(item.callBack)"
        >
          {{ item.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Tree, Message, Input, Switch } from "fusion-ui";
import http from "@/utils/http";
export default {
  name: "CommonTree",
  components: {
    FuTree: Tree,
    FuInput: Input,
    FuSwitch: Switch,
  },
  props: {
    // 是否需要input框过滤数据
    isNeedFilter: {
      type: Boolean,
      default: false,
    },
    // 是否需要展示选择框
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    //数据请求url
    treeReq: {
      type: Object,
      default: () => {
        return {
          url: "",
          params: [],
        };
      },
    },
    treeData: {
      type: Array,
      default: () => [],
    },
    saveDragReq: {
      type: Object,
      default: () => {
        return {
          url: "",
          params: [],
        };
      },
    },
    //树id
    treeId: {
      type: String,
      default: "",
      required: true,
    },
    //搜索字段
    searchText: {
      type: String,
      default: "",
    },
    //是否显示控制拖拽滑块(不要传isDragable)
    showDragSwitch: {
      type: Boolean,
      default: false,
    },
    //是否开启拖拽
    isDragable: {
      type: Boolean,
      default: false,
    },
    //是否是同级拖拽
    isSameLevelDragable: {
      type: Boolean,
      default: false,
    },
    //是否允许非空拖拽
    isNotEmptyDragable: {
      type: Boolean,
      default: true,
    },
    //右键操作
    rightClickList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //展开指定树节点
    expandNodes: {
      type: Array,
      default: () => {
        return [];
      },
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
  },
  data() {
    return {
      filterText: "",
      expandIds: [],
      menuStyle: {
        left: 0,
        top: 0,
        isShow: false,
      },
      currentNode: null,
      isAllowDrag: false,
    };
  },
  computed: {
    //tree请求拿出来的数据
    fuTreeData() {
      return this.$store.state.reqData["fu-tree-2"] || [];
    },
  },
  watch: {
    searchText(val) {
      this.$refs[this.treeId].$refs.el.filter(val);
    },
    filterText(val) {
      this.$refs[this.treeId].$refs.el.filter(val);
    },
  },
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
     * @description 节点过滤方法
     * @param {String} value 过滤字符串
     * @param {TreeNode} node 节点
     */
    filterNode(value, node) {
      if (!value) return true;
      return node[this.defaultProps.label].indexOf(value) !== -1;
    },
    /**
     * @description 树节点拖拽限制
     * @param {TreeNode} draggingNode 被拖拽节点对应的 Node
     * @param {TreeNode} dropNode 结束拖拽时最后进入的节点（可能为空）
     * @param {String} dropType 被拖拽节点的放置位置(before/after/inner)
     */
    allowDrop(draggingNode, dropNode, dropType) {
      // let isShouldDrag = true;
      //拖拽模式是否同级拖拽,如果不是同级拖拽，则进行判断
      if (this.isSameLevelDragable) {
        const isSameLevel = this.isSameLevel(draggingNode, dropNode, dropType);
        if (!isSameLevel) {
          return false;
        }
      }
      //是否允许非空拖拽,如果不允许非空节点拖拽
      if (!this.isNotEmptyDragable) {
        const isNotEmptyNode = this.isNotEmptyNode(draggingNode);
        if (isNotEmptyNode) {
          return false;
        }
      }
      // 其他限制
      let isShouldDrag = true;
      let hasOtherCondition = false;
      this.$emit(
        "allow-drop",
        {
          draggingNode,
          dropNode,
          dropType,
        },
        (data) => {
          //允许拖动，调用保存接口
          isShouldDrag = data;
          hasOtherCondition = true;
        }
      );
      if (hasOtherCondition && !isShouldDrag) return false;
      else return true;
    },
    /**
     * @description 判断节点是否为同级节点
     * @param {TreeNode} draggingNode 被拖拽节点对应的 Node
     * @param {TreeNode} dropNode 结束拖拽时最后进入的节点（可能为空）
     * @param {String} dropType 被拖拽节点的放置位置(before/after/inner)
     * @param {event} ev 拖拽事件
     */
    isSameLevel(draggingNode, dropNode, dropType) {
      if (dropType === "prev" || dropType === "next") {
        if (draggingNode.data.pId === dropNode.data.pId) {
          return true;
        } else {
          return false;
        }
      } else if (dropType === "inner") {
        return false;
      }
    },
    /**
     * @description 判断节点是否为非空节点
     * @param {TreeNode} node 节点对应的 Node
     */
    isNotEmptyNode(node) {
      if (node.data.children === undefined || node.data.children.length === 0) {
        return false;
      } else {
        return true;
      }
    },
    /**
     * @description 拖拽成功事件
     * @param {TreeNode} draggingNode 被拖拽节点对应的 Node
     * @param {TreeNode} dropNode 结束拖拽时最后进入的节点（可能为空）
     * @param {String} dropType 被拖拽节点的放置位置(before/after/inner)
     * @param {String} ev 鼠标事件
     */
    handleDrop(draggingNode, dropNode, dropType, ev) {
      let data = this.getSaveDragNode(draggingNode, dropNode, dropType);
      this.saveDrag(data);
    },
    getSaveDragNode(draggingNode, dropNode, dropType) {
      //当节点没有移动或目标节点为空时，不做任何移动
      if (dropType === "none" || dropNode === null) {
        return;
      }
      let targetPId = "",
        resultTreeData = null;
      if (dropType === "inner") {
        //当前节点为父节点
        resultTreeData = dropNode.data.children;
        targetPId = dropNode.data.id;
      } else {
        //当前节点的父节点为父节点
        let dropParentNode = dropNode.parent.data;
        //如果目标节点是根节点，则根节点的parent是根节点的所有节点数据，是个数组
        resultTreeData = Array.isArray(dropParentNode)
          ? dropParentNode
          : dropParentNode.children;

        targetPId = dropNode.data.pId;
      }
      resultTreeData.forEach((item) => {
        item.pId = targetPId;
      });
      return resultTreeData;
    },
    /**
     * @description 树拖拽保存
     */
    saveDrag(data) {
      if (this.saveDragReq.url !== "") {
        http
          .post(this.saveDragReq.url, {
            postData: JSON.stringify({
              data: [
                {
                  vtype: "attr",
                  name: "tree",
                  data: data,
                },
              ],
            }),
          })
          .then((res) => {
            if (
              res.data[0].data.status &&
              res.data[0].data.status === "error"
            ) {
              Message.error(`保存失败，${res.data[0].data.msg}`);
              this.$refs.tree.queryData();
            }
          });
      }
    },
    /**
     * @description 鼠标右键显示操作
     * @param {event} MouseEvent 鼠标事件
     * @param {TreeNode} node 右键的节点
     */
    rightClick(MouseEvent, node) {
      if (this.rightClickList.length === 0) {
        return;
      }
      this.menuStyle.isShow = true;
      //树dom相对浏览器的坐标
      let { x: containerX, y: containerY } = document
        .querySelector(`#${this.treeId}`)
        .getBoundingClientRect();
      this.menuStyle.left = MouseEvent.clientX - containerX;
      this.menuStyle.top = MouseEvent.clientY - containerY;
      let nodeId = node.id;
      this.$refs[this.treeId].$refs.el.setCurrentKey(nodeId);
      document.addEventListener("click", () => {
        this.menuStyle.isShow = false;
        document.removeEventListener("click", this.foo);
      });
    },
    /**
     * @description 节点鼠标右键操作点击事件
     * @param {String} callback 右键操作名称
     */
    menuClick(callback) {
      let currentKey = this.$refs[this.treeId].$refs.el.getCurrentKey();
      let currentNode =
        this.$refs[this.treeId].$refs.el.getCurrentNode(currentKey);
      this.$emit(callback, currentNode);
    },
    /**
     * @description 设置某个节点高亮显示
     * @param {String} nodeId
     */
    setCurrentKeyHeightLight(nodeId) {
      this.$refs[this.treeId].$refs.el.setCurrentKey(nodeId);
    },
    /**
     * @description 设置某个节点高亮显示
     * @param {String} nodeId
     */
    getCurrentNode() {
      return this.$refs[this.treeId].$refs.el.getCurrentNode();
    },
    /**
     * @description 重新刷新数据
     * @param {TreeNode} node 选中节点
     */
    queryData() {
      this.$refs[this.treeId].queryData();
    },
    completed(treeData) {
      let that = this;
      this.$nextTick().then(() => {
        if (that.searchText === "") {
          //只在单纯请求树的接口时，才默认展开根节点
          let curr = that.currentNode;
          if (!that.currentNode) {
            curr = document.querySelector(`#${this.treeId} .el-tree-node`); //根节点
            try {
              curr.click();
              if (treeData.length) {
                that.$refs[that.treeId].$refs.el.setCurrentKey(treeData[0]);
                that.$emit("node-click", treeData[0]);
              }
            } catch (error) {}
          } else {
            that.$refs[that.treeId].$refs.el.setCurrentKey(curr);
            let node = that.$refs[that.treeId].$refs.el.getNode(curr);
            that.$emit("node-click", node.data);
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.treeContainer {
  height: 100%;
  .treeTop {
    height: 55px;
    padding: 10px;
    box-sizing: border-box;
  }
  position: relative; //改变右键menu定位的参照物
  .el-tree {
    position: relative; //改变右键menu定位的参照物
    height: calc(100% - 55px);
    overflow: auto;
    font-size: 16px;
    font-family: "Microsoft YaHei";
    /**高亮样式 */
    background-color: unset;
    /deep/ .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    /deep/ .el-tree-node__expand-icon.expanded.el-icon-caret-right {
      background: url(./images/triangle-down.png) no-repeat center center;
      &:before {
        content: "";
      }
    }
    /deep/ .el-tree-node__expand-icon.el-icon-caret-right {
      width: 10px;
      height: 7px;
      background: url(./images/triangle-right.png) no-repeat center center;
      &.is-leaf {
        display: none;
      }
      &:before {
        content: "";
      }
    }
    .el-tree-node.is-current {
      & > .el-tree-node__content {
        .custom-tree-node {
          color: #3091f2;
          .treeIcon.childIcon {
            background-position: -26px -209px;
          }
        }
      }
    }
    .custom-tree-node {
      .treeIcon {
        width: 20px;
        height: 15px;
        background: url(./images/tree_icon.png) no-repeat;
        display: inline-block;
        &.parentIcon {
          background-position: -30px -58px;
        }
        &.childIcon {
          background-position: -26px -184px;
        }
      }
      &:hover {
        color: #3091f2;
        .treeIcon.childIcon {
          background-position: -26px -209px;
        }
      }
    }
  }
  .menu {
    position: absolute;
    border: 1px solid #999999;
    background-color: #f4f4f4;
    ul {
      margin-left: -40px;
      margin-top: 0px;
      width: 50px;
      margin-bottom: 0px;
    }
    .menu__item {
      display: block;
      line-height: 20px;
      text-align: center;
      margin: 2px 0px;
      cursor: pointer;
    }
    .menu__item:hover {
      background-color: #1790ff;
      color: white;
    }
  }
}
</style>
