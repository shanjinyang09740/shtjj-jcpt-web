<template>
  <div class="content">
    <div class="header-operation">
      <fu-button size="mini" type="primary" @click="scriptDetail('add')"
        >新建话术</fu-button
      >
    </div>
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
        tableId="scriptTable"
        ref="scriptTable"
        :reqUrl="reqTableUrl"
        :reqParams="reqTableParams"
        :fuColumn="fuColumn"
        :isHasSelection="false"
        maxHeight="700px"
        operationWidth="160px"
      >
        <template slot-scope="scope" slot="oneSlot">
          <fu-switch
            v-model="scope.row.languageDefault"
            active-color="#13ce66"
            active-value="是"
            inactive-value="否"
            @change="changeDefault(scope.row)"
          >
          </fu-switch>
        </template>
        <template slot-scope="row" slot="one">
          <div class="operateBtns">
            <fu-button @click.stop="scriptDetail('edit', row.data)" type="text"
              ><span class="icon iconfont icon-biaoge_bianji"></span>
              编辑</fu-button
            >
            <fu-button @click.stop="deleteScriptDetail(row.data)" type="text"
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
        ref="scriptFrom"
        :fu-data="scriptFrom"
        :rules="rules"
        label-width="100px"
      >
        <fu-form-item label="类型：" prop="languageType">
          <fu-radio-group v-model="scriptFrom.languageType">
            <fu-radio label="催报"></fu-radio>
            <fu-radio label="催改"></fu-radio>
          </fu-radio-group>
        </fu-form-item>
        <fu-form-item label="话术方式：" prop="languageMethod">
          <fu-radio-group v-model="scriptFrom.languageMethod">
            <fu-radio
              v-for="item in scriptTypeOptions"
              :key="item.id"
              :label="item.label"
            ></fu-radio>
          </fu-radio-group>
        </fu-form-item>
        <fu-form-item label="话术名称：" prop="languageName">
          <fu-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            style="width: 100%"
            v-model="scriptFrom.languageName"
          >
          </fu-input>
        </fu-form-item>
        <fu-form-item label="话术描述：" prop="languageDescribe">
          <fu-input
            type="textarea"
            :autosize="{ minRows: 4 }"
            style="width: 100%"
            v-model="scriptFrom.languageDescribe"
          >
          </fu-input>
        </fu-form-item>
        <fu-form-item label="是否默认：" prop="languageDefault">
          <fu-switch
            v-model="scriptFrom.languageDefault"
            inactive-color="#13ce66"
            active-color="#ff4949"
            active-text="否"
            active-value="否"
            inactive-text="是"
            inactive-value="是"
          >
          </fu-switch>
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
  Switch,
  Form,
  FormItem,
  Radio,
  RadioGroup,
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
    FuSwitch: Switch,
    FuDialog: Dialog,
    FuInput: Input,
    FuRadio: Radio,
    FuRadioGroup: RadioGroup,
    ComponentTable,
    AdvancedQuery,
  },
  data() {
    return {
      // 查询表单
      queryColumns: [
        {
          label: "话术名称",
          modelDataKey: "languageName",
          type: "input",
          labelWidth: "80px",
          defaultValue: "",
          isSearchShow: true,
        },
        {
          label: "话术描述",
          modelDataKey: "languageDescribe",
          type: "input",
          labelWidth: "80px",
          defaultValue: "",
          isSearchShow: true,
        },
        {
          label: "是否默认",
          modelDataKey: "languageDefault",
          type: "select",
          labelWidth: "80px",
          defaultValue: "",
          isSearchShow: true,
          placeholder: "请选择",
          fuData: [
            {
              text: "是",
              value: "是",
            },
            {
              text: "否",
              value: "否",
            },
          ],
        },
      ],
      queryForm: {
        languageName: "",
        languageDescribe: "",
        languageDefault: "",
      },
      // 数据列表
      reqTableUrl: "/api/cbgl/v1/hsgl/queryList.do",
      fuColumn: [
        {
          prop: "languageType",
          label: "类型",
          width: "80px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "languageMethod",
          label: "话术方式",
          width: "140px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "languageName",
          label: "话术名称",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "languageDescribe",
          label: "话术描述",
          width: "110px",
          align: "left",
          headerAlign: "center",
        },
        {
          prop: "languageDefault",
          label: "是否默认",
          width: "100px",
          align: "center",
          headerAlign: "center",
          slot: "oneSlot",
        },
      ],
      // 话术弹框
      dialogVisible: false,
      title: "编辑话术",
      scriptFrom: {
        languageName: "",
        languageDescribe: "",
        languageDefault: "是",
        languageType: "",
        languageMethod: "",
      },
      rules: {
        languageType: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
        languageMethod: [
          { required: true, message: "请选择话术方式", trigger: "change" },
        ],
        languageName: [
          { required: true, message: "请输入话术名称", trigger: "blur" },
        ],
        languageDefault: [
          { required: true, message: "请选择是否默认", trigger: "change" },
        ],
      },
      // 话术方式
      scriptTypeOptions: [],
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
  created() {
    this.getScriptType();
  },
  methods: {
    /**
     * @description 查询话术方式
     */
    getScriptType() {
      post("/api/cbgl/v1/tdpzgl/queryAllChannel.do", {
        postData: JSON.stringify({
          data: [],
        }),
      }).then((res) => {
        let data = res.data[0].data;
        this.scriptTypeOptions = data.map((item) => {
          return {
            id: item.channelId,
            label: item.channelName,
          };
        });
      });
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
    scriptDetail(type, row) {
      if (type === "edit") {
        this.scriptFrom = { ...row };
        this.title = "编辑话术";
      } else {
        this.title = "新建话术";
      }
      this.dialogVisible = true;
    },
    confirm() {
      this.$refs["scriptFrom"].$refs.el.validate((valid) => {
        if (valid) {
          post("/api/cbgl/v1/hsgl/save.do", {
            postData: JSON.stringify({
              data: [
                {
                  vtype: "attr",
                  name: "lable",
                  data: this.scriptFrom,
                },
              ],
            }),
          })
            .then((res) => {
              if (res.message === "success") {
                this.$refs["scriptTable"].reloadTable();
                Message.success("保存成功");
                this.dialogClose();
              }
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
      this.$refs["scriptFrom"].$refs.el.resetFields();
      this.scriptFrom = {
        languageId: "",
        languageName: "",
        languageDescribe: "",
        languageDefault: "是",
        languageType: "",
        languageMethod: "",
      };
      this.dialogVisible = false;
    },
    /**
     * @description 修改是否默认
     */
    changeDefault(row) {
      post("/api/cbgl/v1/hsgl/save.do", {
        postData: JSON.stringify({
          data: [
            {
              vtype: "attr",
              name: "lable",
              data: { ...row },
            },
          ],
        }),
      })
        .then((res) => {
          if (res.message === "success") {
            this.$refs["scriptTable"].reloadTable();
            Message.success("修改成功");
          }
        })
        .catch((err) => {
          let response = JSON.parse(err.response);
          Message.error(`修改失败，${response.data}`);
        });
    },
    /**
     * @description 删除
     */
    deleteScriptDetail(row) {
      this.$confirm("确定删除该话术?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          post("/api/cbgl/v1/hsgl/batchDel.do", {
            postData: JSON.stringify({
              data: [
                {
                  vtype: "attr",
                  name: "ids",
                  data: row.languageId, //批量删除id用逗号分隔
                },
              ],
            }),
          })
            .then((res) => {
              this.$refs["scriptTable"].reloadTable();
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
    box-sizing: border-box;
    padding: 10px;
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
