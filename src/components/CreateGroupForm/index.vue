<template>
  <div class="groupFrom">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="基本属性" name="first">
        <fu-form
          class="form"
          :rules="baseRules"
          ref="baseForm"
          label-width="110px"
          :fu-data="baseForm"
        >
          <fu-row>
            <fu-col :span="12">
              <fu-form-item label="名称" prop="stat_group_name_ch">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.stat_group_name_ch"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item label="编码" prop="stat_group_code">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.stat_group_code"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item label="英文名" prop="stat_group_en">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.stat_group_en"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item label="别名" prop="stat_group_alias">
                <fu-input
                  :disabled="disabled"
                  v-model="baseForm.stat_group_alias"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item label="顺序号" prop="stat_group_sort_num">
                <fu-input-number
                  :disabled="disabled"
                  v-model="baseForm.stat_group_sort_num"
                  controls-position="right"
                  :min="1"
                  size="medium"
                  style="width: 100%"
                ></fu-input-number>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item
                v-if="type === 'group'"
                label="分组类型"
                prop="stat_group_type"
              >
                <fu-select
                  v-model="baseForm.stat_group_type"
                  :disabled="disabled"
                  style="width: 100%"
                  size="medium"
                >
                  <fu-option
                    v-for="i in groupOptions"
                    :key="i.value"
                    :label="i.text"
                    :value="i.value"
                  >
                  </fu-option>
                </fu-select>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item
                label="标准分类标识"
                prop="stat_catalog_standard_id"
              >
                <fu-select
                  :disabled="disabled"
                  v-model="baseForm.stat_catalog_standard_id"
                  style="width: 100%"
                  size="medium"
                >
                  <fu-option
                    v-for="i in standardOptions"
                    :key="i.value"
                    :label="i.text"
                    :value="i.value"
                  >
                  </fu-option>
                </fu-select>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item label="版本" prop="stat_group_version">
                <fu-input-number
                  :disabled="disabled"
                  v-model="baseForm.stat_group_version"
                  controls-position="right"
                  :min="1"
                  size="medium"
                  style="width: 100%"
                ></fu-input-number>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item label="版本说明" prop="stat_group_version_desc">
                <fu-input
                  v-model="baseForm.stat_group_version_desc"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-form-item label="分组编码规则" prop="stat_group_code_rule">
            <fu-input
              v-model="baseForm.stat_group_code_rule"
              :disabled="disabled"
              type="textarea"
              :rows="3"
            ></fu-input>
          </fu-form-item>
        </fu-form>
      </el-tab-pane>
      <el-tab-pane label="管理属性" name="second"
        ><fu-form
          :rules="manageRules"
          ref="manageForm"
          label-width="130px"
          :fu-data="baseForm"
        >
          <fu-row>
            <fu-col :span="12">
              <fu-form-item label="状态" prop="stat_group_status">
                <fu-radio
                  v-for="i in StateOptions"
                  v-model="baseForm.stat_group_status"
                  :label="i.value"
                  :disabled="disabled"
                  :key="i.value"
                  >{{ i.text }}</fu-radio
                >
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item label="管理级别" prop="stat_group_manage_level">
                <fu-select
                  :disabled="disabled"
                  v-model="baseForm.stat_group_manage_level"
                  style="width: 100%"
                  size="medium"
                >
                  <fu-option
                    v-for="i in manageLevelOptions"
                    :key="i.value"
                    :label="i.text"
                    :value="i.value"
                  >
                  </fu-option>
                </fu-select>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item label="启用时间" prop="stat_group_start_date">
                <fu-date-picker
                  v-model="baseForm.stat_group_start_date"
                  :disabled="disabled"
                  type="date"
                  format="yyyy-MM-dd"
                  size="medium"
                >
                </fu-date-picker>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item label="停用时间" prop="stat_group_stop_date">
                <fu-date-picker
                  v-model="baseForm.stat_group_stop_date"
                  :disabled="disabled"
                  type="date"
                  format="yyyy-MM-dd"
                  size="medium"
                >
                </fu-date-picker>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <span class="title">创建信息</span>
          <div class="line"></div>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item
                label="创建机构版本"
                prop="stat_group_creat_org_version"
              >
                <fu-input-number
                  :disabled="disabled"
                  v-model="baseForm.stat_group_creat_org_version"
                  controls-position="right"
                  :min="1"
                  size="medium"
                  style="width: 100%"
                ></fu-input-number>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item
                label="创建机构名称"
                prop="stat_group_creat_org_name"
              >
                <fu-input
                  v-model="baseForm.stat_group_creat_org_name"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item
                label="创建机构电子邮箱"
                prop="stat_group_creat_org_email"
              >
                <fu-input
                  v-model="baseForm.stat_group_creat_org_email"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item
                label="创建机构联系人"
                prop="stat_group_creat_org_contact"
              >
                <fu-input
                  v-model="baseForm.stat_group_creat_org_contact"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item
                label="创建机构联系电话"
                prop="stat_group_creat_org_phone"
              >
                <fu-input
                  v-model="baseForm.stat_group_creat_org_phone"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <span class="title">管理信息</span>
          <div class="line"></div>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item
                label="管理机构名称"
                prop="stat_group_manage_org_name"
              >
                <fu-input
                  v-model="baseForm.stat_group_manage_org_name"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item
                label="管理机构版本"
                prop="stat_group_manage_org_version"
              >
                <fu-input-number
                  :disabled="disabled"
                  v-model="baseForm.stat_group_manage_org_version"
                  controls-position="right"
                  :min="1"
                  size="medium"
                  style="width: 100%"
                ></fu-input-number>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item
                label="管理机构联系电话"
                prop="stat_group_manage_org_phone"
              >
                <fu-input
                  v-model="baseForm.stat_group_manage_org_phone"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item
                label="管理机构联系人"
                prop="stat_group_manage_org_contact"
              >
                <fu-input
                  v-model="baseForm.stat_group_manage_org_contact"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="24">
              <fu-form-item
                label="管理机构电子邮箱"
                prop="stat_group_manage_org_email"
              >
                <fu-input
                  v-model="baseForm.stat_group_manage_org_email"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-form-item
            label="管理机构修订记录"
            prop="stat_group_manage_org_rev_rec"
          >
            <fu-input
              v-model="baseForm.stat_group_manage_org_rev_rec"
              :disabled="disabled"
              type="textarea"
              :rows="2"
            ></fu-input>
          </fu-form-item>
          <span class="title">审批信息</span>
          <div class="line"></div>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item label="审批状态" prop="stat_group_check_status">
                <fu-select
                  v-model="baseForm.stat_group_check_status"
                  :disabled="disabled"
                  style="width: 100%"
                  size="medium"
                >
                  <fu-option
                    v-for="i in CheckStateOptions"
                    :key="i.value"
                    :label="i.text"
                    :value="i.value"
                  >
                  </fu-option>
                </fu-select>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item label="审批意见" prop="stat_group_check_opinion">
                <fu-input
                  v-model="baseForm.stat_group_check_opinion"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item label="审批时间" prop="stat_group_check_date">
                <fu-date-picker
                  v-model="baseForm.stat_group_check_date"
                  :disabled="disabled"
                  type="date"
                  format="yyyy-MM-dd"
                  size="medium"
                >
                </fu-date-picker>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item label="提交审批时间" prop="stat_group_submit_date">
                <fu-date-picker
                  v-model="baseForm.stat_group_submit_date"
                  :disabled="disabled"
                  type="date"
                  format="yyyy-MM-dd"
                  size="medium"
                >
                </fu-date-picker>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="12">
              <fu-form-item
                label="审批机构版本"
                prop="stat_group_check_org_version"
              >
                <fu-input-number
                  :disabled="disabled"
                  v-model="baseForm.stat_group_check_org_version"
                  controls-position="right"
                  :min="1"
                  size="medium"
                  style="width: 100%"
                ></fu-input-number>
              </fu-form-item>
            </fu-col>
            <fu-col :span="12">
              <fu-form-item
                label="审批机构名称"
                prop="stat_group_check_org_name"
              >
                <fu-input
                  v-model="baseForm.stat_group_check_org_name"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-row>
            <fu-col :span="24">
              <fu-form-item
                label="审批机构审批人"
                prop="stat_group_check_org_approver"
              >
                <fu-input
                  v-model="baseForm.stat_group_check_org_approver"
                  :disabled="disabled"
                  size="medium"
                ></fu-input>
              </fu-form-item>
            </fu-col>
          </fu-row>
          <fu-form-item
            label="审批机构修订记录"
            prop="stat_group_check_org_rev_rec"
          >
            <fu-input
              v-model="baseForm.stat_group_check_org_rev_rec"
              :disabled="disabled"
              type="textarea"
              :rows="2"
            ></fu-input>
          </fu-form-item>
        </fu-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import {
  Row,
  Col,
  Radio,
  Select,
  Option,
  Input,
  Form,
  FormItem,
  DatePicker,
  InputNumber,
} from "fusion-ui";
import { post } from "@/utils/http";
export default {
  components: {
    FuRow: Row,
    FuCol: Col,
    FuRadio: Radio,
    FuSelect: Select,
    FuOption: Option,
    FuInput: Input,
    FuForm: Form,
    FuFormItem: FormItem,
    FuDatePicker: DatePicker,
    FuInputNumber: InputNumber,
  },
  props: {
    groupId: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "group",
    },
    group: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      activeName: "first",
      baseForm: {
        stat_catalog_standard_id: "",
        stat_group_alias: "",
        stat_group_code: "",
        stat_group_code_rule: "",
        stat_group_name_ch: "",
        stat_group_type: "",
        stat_group_version: "",
        stat_group_version_desc: "",
        stat_group_status: "1",
        stat_group_start_date: "",
        stat_group_stop_date: "",
        stat_group_creat_date: "",
        stat_group_creat_org_version: "",
        stat_group_creat_org_name: "",
        stat_group_creat_org_contact: "",
        stat_group_creat_org_phone: "",
        stat_group_creat_org_email: "",
        stat_group_manage_level: "",
        stat_group_manage_org_version: "",
        stat_group_manage_org_name: "",
        stat_group_manage_org_contact: "",
        stat_group_manage_org_phone: "",
        stat_group_manage_org_email: "",
        stat_group_manage_org_rev_rec: "",
        stat_group_submit_date: "",
        stat_group_check_date: "",
        stat_group_check_status: "",
        stat_group_check_opinion: "",
        stat_group_check_org_version: "",
        stat_group_check_org_name: "",
        stat_group_check_org_approver: "",
        stat_group_check_org_rev_rec: "",
        stat_group_sort_num: "",
      },
      baseRules: {
        stat_group_sort_num: [
          { required: true, message: "请填写顺序号", trigger: "blur" },
        ],
        stat_group_name_ch: [
          { required: true, message: "请填写名称", trigger: "blur" },
        ],
        stat_group_code: [
          { required: true, message: "请填写编码", trigger: "blur" },
        ],
        stat_group_version: [
          { required: true, message: "请填写版本", trigger: "blur" },
        ],
        stat_catalog_standard_id: [
          { required: true, message: "请选择标准分类标识", trigger: "change" },
        ],
        stat_group_type: [
          { required: true, message: "请选择分组类型", trigger: "change" },
        ],
      },
      manageRules: {
        stat_group_status: [
          { required: true, message: "请选择状态", trigger: "change" },
        ],
        stat_group_creat_date: [
          { required: true, message: "请选择创建时间", trigger: "change" },
        ],
        stat_group_creat_org_version: [
          { required: true, message: "请输入创建机构版本", trigger: "blur" },
        ],
        stat_group_manage_level: [
          { required: true, message: "请输入管理级别", trigger: "blur" },
        ],
        stat_group_manage_org_version: [
          { required: true, message: "请输入管理机构版本", trigger: "blur" },
        ],
        stat_group_check_status: [
          { required: true, message: "请选择审批状态", trigger: "change" },
        ],
      },
      // 标准分类标识
      standardOptions: [],
      // 分组类型
      groupOptions: [],
      // 汇总类型
      summaryOptions: [],
      // 启用状态
      StateOptions: [],
      // 审查类型
      CheckStateOptions: [],
      // 管理级别
      manageLevelOptions: [],
    };
  },
  watch: {
    group: {
      handler(val) {
        this.baseForm = val;
        if (!val.stat_group_status && !this.disabled) {
          this.baseForm.stat_group_status = "1";
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getSelectData();
    if (
      this.type === "group" &&
      !this.baseForm.stat_group_code &&
      !this.disabled
    ) {
      this.getCode("1");
    } else if (
      this.type === "catalog" &&
      !this.baseForm.stat_group_code &&
      !this.disabled
    ) {
      this.getCode("2");
    }
  },
  methods: {
    getCode(data) {
      post("/api/meta/v1/groups/group/codegen.do", {
        postData: JSON.stringify({
          data: [
            {
              name: "type",
              vtype: "attr",
              data: data,
            },
          ],
        }),
      })
        .then((res) => {
          this.baseForm.stat_group_code = res.data[0].data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSelectData() {
      this.getCodeTableData("MD_Catalog_Standard_ID")
        .then((res) => {
          if (res.data[0].data) {
            this.standardOptions = res.data[0].data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.getCodeTableData("MD_COLLECT_TYPE")
        .then((res) => {
          if (res.data[0].data) {
            this.summaryOptions = res.data[0].data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.getCodeTableData("MD_GROUP_STUDUS")
        .then((res) => {
          if (res.data[0].data) {
            this.StateOptions = res.data[0].data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.getCodeTableData("MD_Indct_Check_Status")
        .then((res) => {
          if (res.data[0].data) {
            this.CheckStateOptions = res.data[0].data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.getCodeTableData("MD_GROUP_TYPE")
        .then((res) => {
          if (res.data[0].data) {
            let groupType = res.data[0].data;
            if (groupType.length > 0) {
              this.groupOptions = groupType.filter((i) => {
                return i.text !== "目录";
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.getCodeTableData("MD_MANAGE_LEVEL")
        .then((res) => {
          if (res.data[0].data) {
            this.manageLevelOptions = res.data[0].data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 查询代码表
    getCodeTableData(code) {
      return post(`/api/core/v1/dictionary/queryData.do?dicId=${code}`, {
        postData: JSON.stringify({
          data: [],
        }),
      });
    },
    // 生成六位随机数
    getRandomSixDigit() {
      let code = "";
      for (var i = 0; i < 6; i++) {
        code += parseInt(Math.random() * 10);
      }
      return code;
    },
  },
};
</script>
<style scoped lang="less">
.groupFrom {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
.title {
  font-size: 16px;
  color: #2b82d9;
}
.line {
  width: 100%;
  height: 1px;
  margin: 5px 0 20px;
  background-color: #ccc;
}
.radioFlex {
  display: flex;
  flex-direction: column;
}
/deep/.el-tabs__content {
  max-height: 570px;
  overflow: auto;
}
</style>
