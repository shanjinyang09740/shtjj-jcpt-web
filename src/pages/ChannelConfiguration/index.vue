<template>
  <div class="content">
    <div class="header-operation">
      <fu-button size="mini" type="primary" @click="channelDetail('add')"
        >新增通道</fu-button
      >
    </div>
    <div class="header-query">
      <advanced-query
        :columns="queryColumns"
        :showTopResetButton="true"
        :hideAdvancedQuery="true"
        @search="tableSearch"
        size="mini"
        @resetFormAfter="
          () => {
            this.queryForm = {};
          }
        "
      ></advanced-query>
    </div>
    <div class="data-list">
      <component-table
        row-key="id"
        tableId="channelTable"
        ref="channelTable"
        :reqUrl="reqTableUrl"
        :reqParams="reqTableParams"
        :fuColumn="fuColumn"
        :isHasSelection="false"
        operationWidth="160px"
        maxHeight="700px"
      >
        <template slot-scope="scope" slot="oneSlot">
          {{ changeCode(scope.row.channelPassword) }}
        </template>
        <template slot-scope="row" slot="one">
          <div class="operateBtns">
            <fu-button @click.stop="channelDetail('edit', row.data)" type="text"
              ><span class="icon iconfont icon-biaoge_bianji"></span>
              编辑</fu-button
            >
            <fu-button @click.stop="deletechannelDetail(row.data)" type="text"
              ><span class="icon iconfont icon-biaoge_shanchu"></span>
              删除</fu-button
            >
          </div>
        </template>
      </component-table>
    </div>
    <fu-dialog
      :modal-append-to-body="false"
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      top="2vh"
    >
      <fu-form
        ref="channelFrom"
        :fu-data="channelFrom"
        :rules="rules"
        label-width="100px"
      >
        <fu-form-item label="通道名称：" prop="channelName">
          <fu-input style="width: 100%" v-model="channelFrom.channelName">
          </fu-input>
        </fu-form-item>
        <fu-form-item label="通道描述：" prop="channelDescribe">
          <fu-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            style="width: 100%"
            v-model="channelFrom.channelDescribe"
          >
          </fu-input>
        </fu-form-item>
        <fu-form-item label="通道类型：" prop="channelType">
          <fu-select
            style="width: 100%"
            v-model="channelFrom.channelType"
            placeholder="请选择类型"
          >
            <fu-option
              v-for="item in channelTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </fu-option>
          </fu-select>
        </fu-form-item>
        <fu-form-item label="地址：" prop="channelAddress">
          <fu-input style="width: 100%" v-model="channelFrom.channelAddress">
          </fu-input>
        </fu-form-item>
        <fu-form-item
          v-if="channelFrom.channelType === '短信'"
          label="数据库："
          prop="channelDatabase"
        >
          <fu-input style="width: 100%" v-model="channelFrom.channelDatabase">
          </fu-input>
        </fu-form-item>
        <fu-form-item
          v-if="channelFrom.channelType === '短信'"
          label="密码："
          prop="channelPassword"
        >
          <fu-input
            style="width: 100%"
            v-model="channelFrom.channelPassword"
            show-password
          >
          </fu-input>
        </fu-form-item>
        <fu-form-item
          v-if="channelFrom.channelType === '短信'"
          label="端口号："
          prop="channelPort"
        >
          <fu-input style="width: 100%" v-model="channelFrom.channelPort">
          </fu-input>
        </fu-form-item>
      </fu-form>
      <span slot="footer" class="dialog-footer">
        <fu-button type="primary" @click="confirm">确定</fu-button>
        <fu-button @click="dialogClose">取消</fu-button>
      </span>
    </fu-dialog>
  </div>
</template>
<script>
import {
  Button,
  Dialog,
  Message,
  Select,
  Option,
  Form,
  FormItem,
  Input,
} from "fusion-ui";
import AdvancedQuery from "@/components/AdvancedQuery";
import ComponentTable from "@/components/CommonTable";
import { post } from "@/utils/http";
export default {
  name: "Enterprise",
  components: {
    FuForm: Form,
    FuFormItem: FormItem,
    FuButton: Button,
    FuSelect: Select,
    FuOption: Option,
    FuDialog: Dialog,
    FuInput: Input,
    ComponentTable,
    AdvancedQuery,
  },
  data() {
    return {
      // 通道类型
      channelTypeOptions: [
        {
          text: "微信公众号",
          value: "微信公众号",
        },
        {
          text: "短信",
          value: "短信",
        },
        {
          text: "电话",
          value: "电话",
        },
      ],
      // 查询表单
      queryColumns: [
        {
          label: "通道名称",
          modelDataKey: "channelName",
          type: "input",
          labelWidth: "80px",
          defaultValue: "",
          isSearchShow: true,
        },
        {
          label: "通道类型",
          modelDataKey: "channelType",
          type: "select",
          labelWidth: "80px",
          defaultValue: "",
          isSearchShow: true,
          placeholder: "请选择",
          fuData: [
            {
              text: "微信公众号",
              value: "微信公众号",
            },
            {
              text: "短信",
              value: "短信",
            },
            {
              text: "电话",
              value: "电话",
            },
          ],
        },
      ],
      queryForm: {
        channelName: "",
        channelType: "",
      },
      // 数据列表
      reqTableUrl: "/api/cbgl/v1/tdpzgl/queryList.do",
      fuColumn: [
        {
          prop: "channelName",
          label: "通道名称",
          width: "80px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "channelDescribe",
          label: "通道描述",
          width: "140px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "channelType",
          label: "通道类型",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "channelAddress",
          label: "地址",
          width: "110px",
          align: "left",
          headerAlign: "center",
        },
        {
          prop: "channelDatabase",
          label: "数据库",
          width: "100px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "channelPassword",
          label: "密码",
          width: "100px",
          align: "center",
          headerAlign: "center",
          slot: "oneSlot",
        },
        {
          prop: "channelPort",
          label: "端口",
          width: "100px",
          align: "center",
          headerAlign: "center",
        },
      ],
      // 话术弹框
      dialogVisible: false,
      // 详情id
      detailId: "",
      title: "编辑",
      channelFrom: {
        channelName: "",
        channelDescribe: "",
        channelType: "",
        channelAddress: "",
        channelDatabase: "",
        channelPassword: "",
        channelPort: "",
      },
      rules: {
        channelName: [
          { required: true, message: "请输入通道名称", trigger: "blur" },
        ],
        channelType: [
          { required: true, message: "请选择通道类型", trigger: "change" },
        ],
        channelAddress: [
          { required: true, message: "请输入地址", trigger: "blur" },
        ],
        channelDatabase: [
          { required: true, message: "请输入数据库", trigger: "blur" },
        ],
        channelPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        channelPort: [
          { required: true, message: "请输入端口号", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    reqTableParams() {
      return [
        {
          vtype: "attr",
          name: "lable",
          data: this.queryForm,
        },
        {
          vtype: "pagination",
          name: "queryType",
          data: "dataOnly",
        },
      ];
    },
  },
  methods: {
    changeCode(val) {
      let text = "*";
      if (val) {
        return text.repeat(val.length);
      } else {
        return "";
      }
    },
    /**
     * @description 表单查询
     */
    tableSearch(form) {
      this.queryForm = JSON.parse(JSON.stringify(form));
    },
    /**
     * @description 新建编辑话术
     */
    channelDetail(type, row) {
      if (type === "edit") {
        this.detailId = row.id;
        this.channelFrom = { ...row };
        this.title = "编辑通道";
      } else {
        this.title = "新增通道";
      }
      this.dialogVisible = true;
    },
    confirm() {
      this.$refs["channelFrom"].$refs.el.validate((valid) => {
        if (valid) {
          post("/api/cbgl/v1/tdpzgl/save.do", {
            postData: JSON.stringify({
              data: [
                {
                  vtype: "attr",
                  name: "lable",
                  data: this.channelFrom,
                },
              ],
            }),
          })
            .then((res) => {
              this.$refs["channelTable"].reloadTable();
              Message.success("保存成功");
              this.dialogClose();
            })
            .catch((err) => {
              let response = JSON.parse(err.response);
              Message.error(`保存失败，${response.data}`);
              this.dialogClose();
            });
        }
      });
    },
    dialogClose() {
      this.$refs["channelFrom"].$refs.el.resetFields();
      this.dialogVisible = false;
    },
    /**
     * @description 删除
     */
    deletechannelDetail(row) {
      this.$confirm("确定删除该通道?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          post("/api/cbgl/v1/tdpzgl/batchDel.do", {
            postData: JSON.stringify({
              data: [
                {
                  vtype: "attr",
                  name: "ids",
                  data: row.channelId, //批量删除id用逗号分隔
                },
              ],
            }),
          })
            .then((res) => {
              this.$refs["channelTable"].reloadTable();
              Message.success("删除成功!");
            })
            .catch((err) => {
              let response = JSON.parse(err.response);
              Message.error(`保存失败，${response.data}`);
            });
        })
        .catch(() => {
          Message.info("已取消删除");
        });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  .header-operation {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
  }
  .header-query {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .data-list {
    .list-header {
      height: 50px;
      line-height: 50px;
      background-color: #f3f3f3;
      padding-left: 20px;
    }
  }
  .el-table .operateBtns .iconfont {
    margin-right: 3px;
  }
}
</style>
