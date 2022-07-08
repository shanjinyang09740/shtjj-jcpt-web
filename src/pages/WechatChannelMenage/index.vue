<template>
  <div class="content">
    <div class="content-left">
      <component-tree
        v-loading="treeLoading"
        :isNeedFilter="true"
        ref="expQueryTree"
        treeId="expQueryTree"
        :treeData="treeData"
        :defaultProps="defaultProps"
        :expandNodes="expandNodes"
        @node-click="nodeClick"
      ></component-tree>
    </div>
    <div class="content-right">
      <div class="header-query">
        <advanced-query
          :columns="queryColumns"
          :showTopResetButton="true"
          :hideAdvancedQuery="true"
          @search="tableSearch"
          @resetFormAfter="
            () => {
              this.queryForm = {};
            }
          "
          size="mini"
        ></advanced-query>
      </div>
      <div class="data-list">
        <component-table
          row-key="id"
          ref="expQueryTable"
          tableId="expQueryTable"
          :reqUrl="reqTableUrl"
          :reqParams="reqTableParams"
          :fuColumn="fuColumn"
          :isHasSelection="false"
          maxHeight="700px"
        >
          <template slot-scope="row" slot="one">
            <div class="operateBtns">
              <fu-button @click.stop="userInfo(row.data)" type="text"
                ><span class="icon iconfont icon-biaoge_xiangqing"></span>
                用户信息</fu-button
              >
            </div>
          </template>
        </component-table>
      </div>
    </div>
    <fu-dialog
      v-if="dialogVisible"
      :modal-append-to-body="false"
      title="用户信息"
      :visible.sync="dialogVisible"
      width="70%"
      top="2vh"
    >
      <component-table
        row-key="yhId"
        ref="yhxxTable"
        tableId="yhxxTable"
        reqUrl="/api/cbgl/v1/wxtdgl/queryById.do"
        :reqParams="infoTableParams"
        :fuColumn="tableColumn"
        :isHasSelection="false"
        :isNeedOperation="false"
      >
      </component-table>
      <span slot="footer" class="dialog-footer">
        <fu-button type="primary" @click="dialogVisible = false"
          >关闭</fu-button
        >
      </span>
    </fu-dialog>
  </div>
</template>
<script>
import { Button, Dialog } from "fusion-ui";
import AdvancedQuery from "@/components/AdvancedQuery";
import ComponentTree from "@/components/CommonTree";
import ComponentTable from "@/components/CommonTable";
import { post } from "@/utils/http";
export default {
  name: "sampleQuery",
  components: {
    FuButton: Button,
    FuDialog: Dialog,
    ComponentTree,
    ComponentTable,
    AdvancedQuery,
  },
  data() {
    return {
      // 行业代码
      industryTypeCode: "",
      treeLoading: false,
      // 报告期
      bgqOption: [],
      // 左侧树
      treeData: [],
      expandNodes: [],
      defaultProps: {
        children: "children",
        label: "industryType",
        id: "id",
      },
      // 当前节点数据
      folder: {},
      queryForm: {
        creditCode: "", // 统一社会信用代码
        companyName: "", // 单位详细名称
        bindingState: "",
      },
      // 查询表单
      queryColumns: [
        {
          label: "统一社会信用代码",
          modelDataKey: "creditCode",
          type: "input",
          labelWidth: "150px",
          defaultValue: "",
          isSearchShow: true,
        },
        {
          label: "单位详细名称",
          modelDataKey: "companyName",
          type: "input",
          labelWidth: "110px",
          defaultValue: "",
          isSearchShow: true,
        },
        {
          label: "绑定状态",
          modelDataKey: "bindingState",
          type: "select",
          labelWidth: "80px",
          defaultValue: "",
          isSearchShow: true,
          placeholder: "请选择",
          fuData: [
            {
              text: "已绑定",
              value: "已绑定",
            },
            {
              text: "未绑定",
              value: "未绑定",
            },
          ],
        },
      ],
      dialogVisible: false,
      tableColumn: [
        {
          prop: "yhName",
          label: "用户名称",
          width: "180px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "yhPhone",
          label: "移动电话",
          width: "130px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "bindingState",
          label: "绑定状态",
          width: "180px",
          align: "center",
          headerAlign: "center",
        },
      ],
      // 行组织机构代码
      rowOrgCode: "",
    };
  },
  computed: {
    // 数据列表
    fuColumn() {
      return [
        {
          prop: "creditCode",
          label: "统一社会信用代码",
          width: "180px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "orgCode",
          label: "组织机构代码",
          width: "130px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "companyName",
          label: "单位详细名称",
          width: "180px",
          align: "left",
          headerAlign: "center",
        },
        {
          prop: "legalPerson",
          label: "法定代表人",
          width: "100px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "detailedAddress",
          label: "详细地址",
          width: "200px",
          align: "left",
          headerAlign: "center",
        },
        {
          prop: "bindingState",
          label: "绑定状态",
          width: "100px",
          align: "center",
          headerAlign: "center",
        },
      ];
    },
    reqTableUrl() {
      if (!this.industryTypeCode) {
        return "";
      } else {
        return "/api/cbgl/v1/wxtdgl/queryList.do";
      }
    },
    reqTableParams() {
      return [
        {
          vtype: "attr",
          name: "lable",
          data: {
            creditCode: this.queryForm.creditCode,
            companyName: this.queryForm.companyName,
            bindingState: this.queryForm.bindingState, //0代表未绑定 1代表已绑定
            industryTypeCode: this.industryTypeCode,
          },
        },
      ];
    },
    infoTableParams() {
      return [
        {
          vtype: "attr",
          name: "orgCode",
          data: this.rowOrgCode,
        },
      ];
    },
  },
  created() {
    this.initTree();
  },
  methods: {
    /**
     * @description 初始化左侧树
     */
    initTree() {
      post("/api/cbgl/v1/wxtdgl/queryTree.do", {
        postData: JSON.stringify({
          data: [],
        }),
      }).then((res) => {
        let tree = res.data[0].data;
        this.treeData = this.transformTozTreeFormat(tree);
        // 默认高亮选中节点
        if (this.treeData.length) {
          this.expandNodes.push(this.treeData[0].children[0].id);
          this.nodeClick(this.treeData[0].children[0]);
          this.$nextTick(() => {
            this.$refs["expQueryTree"].setCurrentKeyHeightLight(
              this.treeData[0].children[0].id
            );
          });
        }
        this.treeLoading = false;
      });
    },
    /**
     * @description 将普通的数组转换为父子结构
     */
    transformTozTreeFormat(sNodes) {
      let i, l;
      let r = [];
      let tmpMap = {};
      for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i].id] = sNodes[i];
      }
      for (i = 0, l = sNodes.length; i < l; i++) {
        let p = tmpMap[sNodes[i].pId];
        if (p && sNodes[i].id != sNodes[i].pId) {
          let children = this.nodeChildren(p);
          if (!children) {
            children = this.nodeChildren(p, []);
          }
          children.push(sNodes[i]);
        } else {
          r.push(sNodes[i]);
        }
      }
      return r;
    },
    nodeChildren(node, newChildren) {
      if (typeof newChildren !== "undefined") {
        node.children = newChildren;
      }
      return node.children;
    },

    // 树节点点击事件
    nodeClick(data) {
      this.folder = data;
      this.industryTypeCode = data.id;
    },
    /**
     * @description 表单查询
     */
    tableSearch(form) {
      this.queryForm = JSON.parse(JSON.stringify(form));
    },

    /**
     * @description 用户信息
     */
    userInfo(row) {
      this.dialogVisible = true;
      this.rowOrgCode = row.orgCode;
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  display: flex;
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
  .content-left {
    width: 300px;
    border: 1px solid #ccc;
  }
  .content-right {
    width: calc(100% - 300px);
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-left: none;
  }
  .header-query {
    padding: 10px;
  }
  .data-list {
    padding: 10px;
    .list-header {
      height: 50px;
      line-height: 50px;
      background-color: #f3f3f3;
      padding-left: 20px;
    }
  }
}
.queryBtn {
  text-align: center;
}
.underline {
  text-decoration: underline;
}
</style>
