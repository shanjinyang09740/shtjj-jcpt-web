<template>
  <div class="content">
    <div class="header-operation">
      <fu-button size="mini" type="success" @click="createTask"
        >新建任务</fu-button
      >
      <fu-button type="primary" plain size="mini" @click="importEtl"
        >导入</fu-button
      >
      <fu-button type="primary" plain size="mini" @click="exportEtl"
        >导出</fu-button
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
            this.formQuery = {};
          }
        "
        size="mini"
      ></advanced-query>
    </div>
    <div class="data-list">
      <component-table
        row-key="id"
        ref="directoryTable"
        :tableId="tableId"
        :fuColumn="fuColumn"
        :reqUrl="reqTableUrl"
        :reqParams="reqTableParams"
        :isHasSelection="true"
        operationWidth="320px"
        @deliverySelection="deliverySelection"
      >
        <template slot-scope="scope" slot="oneSlot">
          {{ changeCode(scope.row.executionStatus) }}
        </template>
        <template slot-scope="row" slot="one">
          <div class="operateBtns">
            <fu-button @click.stop="edit(row.data)" type="text">
              <span class="icon iconfont icon-biaoge_bianji"></span>
              编辑</fu-button
            >
            <fu-button @click.stop="copy(row.data)" type="text"
              ><span class="icon iconfont icon-biaoge_fuzhi"></span
              >复制</fu-button
            >
            <fu-button @click.stop="DesignEtl(row.data)" type="text">
              <span class="icon iconfont icon-biaoge_guizepeizhi"></span>
              配置规则</fu-button
            >
            <el-dropdown>
              <span class="el-dropdown-link">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  ><fu-button @click.stop="runEtl(row.data)" type="text">
                    <span class="icon iconfont icon-biaoge_yunhang"></span>
                    运行</fu-button
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  ><fu-button @click.stop="lookLog(row.data)" type="text"
                    ><span class="icon iconfont icon-biaoge_chakanrizhi"></span>
                    日志</fu-button
                  ></el-dropdown-item
                >
                <el-dropdown-item
                  ><fu-button @click.stop="deleteEtl(row.data)" type="text">
                    <span class="icon iconfont icon-biaoge_shanchu"></span>
                    删除</fu-button
                  ></el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </component-table>
    </div>
    <!-- 新建任务 -->
    <fu-dialog
      width="60%"
      center
      top="10vh"
      :title="newDialog.title"
      :close-on-click-modal="false"
      :visible.sync="newDialog.show"
      v-if="newDialog.show"
      :modal-append-to-body="false"
      :modal="false"
      :destroy-on-close="true"
    >
      <fu-form ref="taskForm" :fu-data="etlInfo" :rules="newAndEditRules">
        <fu-form-item
          v-if="newDialog.title === '编辑任务'"
          label="任务ID："
          prop="etlId"
          label-width="125px"
        >
          <fu-input disabled v-model="etlInfo.etlId"></fu-input>
        </fu-form-item>
        <fu-form-item label="任务名称：" label-width="125px" prop="etlLabel">
          <fu-input v-model="etlInfo.etlLabel"></fu-input>
        </fu-form-item>
        <fu-form-item label="任务描述：" label-width="125px" prop="etlDesc">
          <fu-input type="textarea" v-model="etlInfo.etlDesc"></fu-input>
        </fu-form-item>
        <fu-form-item
          label="数据运行模式："
          label-width="125px"
          prop="etlRunMode"
        >
          <fu-radio-group
            style="display: inline-block; margin-right: 10px"
            :fu-request="etlRunModeRequest"
            fu-id="fu-radio-etlRunMode"
            v-model="etlInfo.etlRunMode"
          >
            <fu-radio
              v-for="item in etlRunModeOption"
              :key="item.value"
              :label="item.value"
              >{{ item.text }}</fu-radio
            >
          </fu-radio-group>

          <span v-if="etlInfo.etlRunMode === 'recentfull'">
            近
            <fu-input-number
              size="mini"
              v-model="etlInfo.etlRunModeConfig.recentDays"
              :min="1"
            ></fu-input-number>
            天</span
          >
        </fu-form-item>
        <fu-form-item
          label="运行资源参数："
          label-width="125px"
          prop="engineConfigs"
        >
          <fu-input
            type="textarea"
            :rows="2"
            v-model="etlInfo.etlRunModeConfig.engineConfigs"
          >
          </fu-input>
        </fu-form-item>
      </fu-form>
      <span slot="footer" class="dialog-footer">
        <fu-button type="primary" @click="saveTask" size="medium"
          >确定</fu-button
        >
        <fu-button @click="cancelTask" size="medium">取消</fu-button>
      </span>
    </fu-dialog>
    <!-- 日志 -->
    <fu-dialog
      :modal-append-to-body="false"
      title="运行日志"
      :visible.sync="logDialogVisible"
      width="70%"
      top="2vh"
    >
      <!-- <div v-show="detailVisible">
        <div class="detail-header">
          <advanced-query
            :columns="detailQueryColumns"
            :showTopResetButton="true"
            :hideAdvancedQuery="true"
            @search="logTableSearch"
          ></advanced-query>
          <fu-button
            style="margin-right: 10px"
            @click="detailVisible = false"
            size="medium"
            >返回</fu-button
          >
        </div>
        <component-table
          row-key="id"
          ref="detailTable"
          tableId="detailTable"
          :reqUrl="detailTableUrl"
          :reqParams="detailTableParams"
          :fuColumn="detailColumn"
          :isNeedOperation="false"
        >
        </component-table>
      </div>
      <div v-show="!detailVisible"> -->
      <div class="detail-header">
        <advanced-query
          :columns="logQueryColumns"
          :showTopResetButton="true"
          :hideAdvancedQuery="true"
          @search="logTableSearch"
          @resetFormAfter="
            () => {
              this.logQueryForm = {};
            }
          "
        ></advanced-query>
      </div>
      <component-table
        row-key="id"
        ref="logTable"
        tableId="logTable"
        :reqUrl="logTableUrl"
        :reqParams="logTableParams"
        :fuColumn="logColumn"
        operationWidth="55px"
        maxHeight="600px"
      >
        <template slot-scope="row" slot="one">
          <div class="operateBtns">
            <fu-button @click.stop="look(row.data)" type="text">查看</fu-button>
          </div>
        </template>
      </component-table>
      <!-- </div> -->
      <span slot="footer" class="dialog-footer">
        <fu-button @click="logDialogVisible = false">关 闭</fu-button>
      </span>
    </fu-dialog>
    <!-- 日志详情 -->
    <fu-dialog
      :visible="visibleDialog"
      title="查看日志"
      @close="cancel"
      width="80%"
    >
      <div class="journal-bg">
        <!-- <div v-for="(item, index) in executionLog" :key="index">
          <span>{{ item }}</span>
        </div> -->
        <p v-text="executionLog" class="journal-content"></p>
      </div>
      <div slot="footer" class="dialog-footer">
        <fu-button type="primary" @click="handleClickExport" size="medium"
          >导出日志</fu-button
        >
        <fu-button @click="cancel" size="medium">关闭</fu-button>
      </div>
    </fu-dialog>
    <!-- 运行 -->
    <fu-dialog
      width="60%"
      center
      top="10vh"
      :title="runDialog.title"
      :close-on-click-modal="false"
      :visible.sync="runDialog.show"
      v-if="runDialog.show"
      :modal-append-to-body="false"
      :modal="false"
      :destroy-on-close="true"
    >
      <fu-form :rules="RunRules" :fu-data="etlRunInfo">
        <!-- <fu-form-item
          label="数据行数"
          label-width="120px"
          prop="calculateNumber"
        >
          <fu-input
            v-model="etlRunInfo.calculateNumber"
            placeholder="-1 指抽取全部数据"
          ></fu-input>
        </fu-form-item> -->
        <fu-form-item
          v-for="item in etlRunInfo.params"
          :key="item.paramName"
          :label="item.paramLabel"
          label-width="120px"
        >
          <fu-input v-model="item.paramValue"></fu-input>
        </fu-form-item>
        <fu-form-item>
          <div class="operates">
            <fu-button type="primary" @click="runConfirm" size="medium"
              >确定</fu-button
            >
            <fu-button @click="runCancel" size="medium">取消</fu-button>
          </div>
        </fu-form-item>
      </fu-form>
    </fu-dialog>
    <!-- 导入 -->
    <fu-dialog
      width="40%"
      center
      top="10vh"
      :title="importDialog.title"
      :close-on-click-modal="false"
      :visible.sync="importDialog.show"
      v-if="importDialog.show"
      :modal-append-to-body="false"
      :modal="false"
      :destroy-on-close="true"
    >
      <fu-upload
        class="upload"
        multiple
        :limit="1"
        :http-request="upload"
        accept=".zip"
        action=""
      >
        <fu-button size="small" type="primary">点击上传</fu-button>
        <div slot="tip" class="el-upload__tip">说明：只能上传压缩包</div>
      </fu-upload>
    </fu-dialog>
  </div>
</template>
<script>
import {
  Input,
  InputNumber,
  Button,
  Dialog,
  FormItem,
  Form,
  RadioGroup,
  Radio,
  Message,
  MessageBox,
  Upload,
} from "fusion-ui";
import AdvancedQuery from "@/components/AdvancedQuery";
import ComponentTable from "@/components/CommonTable";
import {
  doCreateEtl,
  doEditEtl,
  doRunEtl,
  doDeleteEtl,
  doCopyEtl,
  queryData,
  getParamsEtl,
} from "@/service/directoryComparison.js";
import { ajax } from "@/utils/upload";
import { post } from "@/utils/http";
export default {
  name: "sampleQuery",
  components: {
    FuButton: Button,
    FuForm: Form,
    FuFormItem: FormItem,
    FuRadioGroup: RadioGroup,
    FuRadio: Radio,
    FuDialog: Dialog,
    FuInput: Input,
    FuUpload: Upload,
    FuInputNumber: InputNumber,
    ComponentTable,
    AdvancedQuery,
  },
  data() {
    return {
      // 任务编号
      etlName: "",
      formQuery: {
        etlLabel: "",
      },
      // 查询表单
      queryColumns: [
        {
          label: "任务名称",
          modelDataKey: "etlLabel",
          type: "input",
          labelWidth: "80px",
          defaultValue: "",
          isSearchShow: true,
        },
      ],
      // 数据列表
      tableId: "directoryComTable",
      reqTableUrl: "/api/datacompare/v1/etl/queryList.do",
      tableData: {
        page: 1,
        pagerows: 10,
        rows: [
          {
            tyshxyCode: "1",
            orgCode: "",
            companyName: "1",
            legalRepresentative: "",
            address: "",
            areaCode: "",
          },
        ],
        totalrows: 0,
      },
      //表格选中
      tableSelections: [],
      // 新建任务弹窗
      newDialog: {
        show: false,
        title: "",
      },
      //当前etl信息
      etlInfo: {
        etlId: "",
        etlName: "",
        etlLabel: "",
        etlDesc: "",
        etlRunMode: "",
        etlRunModeConfig: {
          recentDays: "7",
        },
      },
      type: "",
      newAndEditRules: {
        etlLabel: {
          required: true,
          message: "请输入任务名称",
          trigger: "blur",
        },
        etlDesc: {
          required: true,
          message: "请输入任务描述",
          trigger: "blur",
        },
        etlRunMode: {
          required: true,
          message: "请输入数据运行模式",
          trigger: "blur",
        },
      },
      etlRunModeRequest: {
        url: "/api/core/v1/dictionary/queryData.do?dicId=etlRunMode",
        params: [],
      },
      etlRunModeOption: [],
      etlRunStatusOption: [],
      // 运行日志
      logDialogVisible: false,
      detailVisible: false,
      logTableUrl: "/api/datacompare/v1/etl/queryEtlLogList.do",
      detailTableUrl: "",
      detailTableParams: [],
      logQueryForm: {
        etlLabel: "",
        etlName: "",
        executionStatus: "",
        startTime: "",
        endTime: "",
        startTime1: "",
        endTime1: "",
      },
      detailQueryForm: {},
      logQueryColumns: [
        {
          label: "任务名称",
          modelDataKey: "etlLabel",
          type: "input",
          labelWidth: "128px",
          defaultValue: "",
          isSearchShow: true,
        },
        {
          label: "运行开始时间",
          placeholder: "请选择",
          type: "date-picker",
          searchShow: false,
          modelData1: "startTime", //开始日期对应key值
          modelData2: "endTime", //结束日期对应key值
        },
        {
          label: "运行结束时间",
          placeholder: "请选择",
          type: "date-picker",
          searchShow: false,
          modelData1: "startTime1", //开始日期对应key值
          modelData2: "endTime1", //结束日期对应key值
        },
      ],
      detailQueryColumns: [
        {
          label: "统一社会信用代码",
          modelDataKey: "code",
          type: "input",
          labelWidth: "160px",
          defaultValue: "",
          isSearchShow: true,
        },
        {
          label: "单位详细名称",
          modelDataKey: "label",
          labelWidth: "100px",
          type: "input", //日期组件
          isSearchShow: true,
        },
      ],
      detailColumn: [
        {
          prop: "tyshxyCode",
          label: "统一社会信用代码",
          width: "110px",
          align: "center",
          headerAlign: "center",
          sortable: true,
        },
        {
          prop: "orgCode",
          label: "组织机构代码",
          width: "100px",
          align: "center",
          headerAlign: "center",
          sortable: true,
        },
        {
          prop: "companyName",
          label: "单位详细名称",
          width: "120px",
          align: "left",
          headerAlign: "center",
        },
        {
          prop: "legalRepresentative",
          label: "法定代表人",
          width: "100px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "address",
          label: "详细地址",
          width: "200px",
          align: "left",
          headerAlign: "center",
        },
        {
          prop: "areaCode",
          label: "长途区号",
          width: "80px",
          align: "center",
          headerAlign: "center",
        },
      ],
      visibleDialog: false,
      executionLog: "",
      etlLabel: "",

      // etl运行
      runDialog: {
        show: false,
        title: "运行",
      },
      etlRunInfo: {
        calculateNumber: -1,
        params: [
          {
            paramname: "报告期",
            paramvalue: "2010",
          },
        ],
      },
      RunRules: {
        calculateNumber: {
          required: true,
          message: "输入数据不合法",
          pattern: /(^[1-9]\d*$)|(^(-1)$)|(^0$)/,
          trigger: "blur",
        },
      },
      // 导入
      importDialog: {
        show: false,
        title: "导入",
      },
    };
  },
  computed: {
    reqTableParams() {
      return [
        {
          vtype: "formpanel",
          name: "condition",
          data: {
            etlLabel: this.formQuery.etlLabel,
          },
        },
      ];
    },
    logTableParams() {
      return [
        {
          name: "parameterFormpanel",
          vtype: "formpanel",
          data: {
            etlLabel: this.logQueryForm.etlLabel,
            etlName: this.etlName,
            executionStatus: "",
            startTime: this.logQueryForm.startTime
              ? this.logQueryForm.startTime + "--" + this.logQueryForm.endTime
              : "",
            endTime: this.logQueryForm.startTime1
              ? this.logQueryForm.startTime1 + "--" + this.logQueryForm.endTime1
              : "",
          },
        },
      ];
    },
    logColumn() {
      return [
        {
          prop: "etlLabel",
          label: "任务名称",
          width: "100px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "etlDesc",
          label: "任务描述",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "runTime",
          label: "运行时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "etlRunMode",
          label: "运行模式",
          width: "100px",
          align: "center",
          headerAlign: "center",
          codeListId: "etlRunMode",
          changeArr: this.etlRunModeOption,
        },
        {
          prop: "executionStatus",
          label: "运行状态",
          width: "100px",
          align: "center",
          headerAlign: "center",
          changeArr: this.etlRunStatusOption,
        },
      ];
    },
    fuColumn() {
      return [
        {
          prop: "etlId",
          label: "任务ID",
          width: "70px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "etlLabel",
          label: "任务名称",
          width: "140px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "etlDesc",
          label: "任务描述",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "updateTime",
          label: "任务最后修改时间",
          width: "110px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "lastSuccessTime",
          label: "任务最后执行时间",
          width: "100px",
          align: "center",
          headerAlign: "center",
        },
        {
          prop: "executionStatus",
          label: "运行状态",
          width: "100px",
          align: "center",
          headerAlign: "center",
          // changeArr: this.etlRunStatusOption,
          slot: "oneSlot",
        },
      ];
    },
  },
  async created() {
    let res = await queryData("etlRunMode,ExecutionStatusEnum");
    this.etlRunModeOption = res.data[0].data;
    this.etlRunStatusOption = res.data[1].data;
  },
  methods: {
    changeCode(val) {
      let text = val;
      this.etlRunStatusOption.forEach((item) => {
        if (item.value === val) {
          text = item.text;
        }
      });
      return text;
    },
    /**
     * @description 表单查询
     */
    tableSearch(form) {
      this.formQuery = JSON.parse(JSON.stringify(form));
    },
    logTableSearch(form) {
      this.logQueryForm = JSON.parse(JSON.stringify(form));
    },
    /**
     * @description 新建任务
     */
    createTask() {
      this.type = "create";
      this.etlInfo = {
        etlName: "",
        etlLabel: "",
        etlDesc: "",
        etlRunMode: "full",
        etlRunModeConfig: {
          recentDays: "7",
        },
      };
      this.newDialog.title = "新建任务";
      this.newDialog.show = true;
    },
    /**
     * @description 保存新建任务
     */
    saveTask() {
      this.$refs["taskForm"].$refs.el.validate((valid) => {
        if (valid) {
          if (this.type === "create") {
            doCreateEtl(this.etlInfo)
              .then((res) => {
                this.cancelTask();
                this.$refs["directoryTable"].reloadTable();
                Message.success("新建成功");
              })
              .catch((err) => {
                let response = JSON.parse(err.response);
                Message.error(`保存失败，${response.data}`);
              });
          } else {
            doEditEtl(this.etlInfo)
              .then((res) => {
                this.cancelTask();
                this.$refs["directoryTable"].reloadTable();
                Message.success("编辑成功");
              })
              .catch((err) => {
                let response = JSON.parse(err.response);
                Message.error(`保存失败，${response.data}`);
              });
          }
        }
      });
    },
    /**
     * @description 取消新建任务
     */
    cancelTask() {
      this.newDialog.show = false;
    },
    /**
     * @description 编辑
     */
    edit(row) {
      this.type = "edit";
      this.etlInfo = JSON.parse(JSON.stringify(row));
      if (!this.etlInfo.etlRunModeConfig) {
        this.etlInfo.etlRunModeConfig = {
          recentDays: "",
        };
      } else {
        this.etlInfo.etlRunModeConfig = JSON.parse(
          this.etlInfo.etlRunModeConfig
        );
      }
      this.newDialog.title = "编辑任务";
      this.newDialog.show = true;
    },
    /**
     * @description 复制
     */
    copy(row) {
      doCopyEtl(row.etlId)
        .then((res) => {
          Message.success("复制成功！");
          this.$refs["directoryTable"].reloadTable();
        })
        .catch((err) => {
          let response = JSON.parse(err.response);
          Message.error(`复制失败，${response.data}`);
        });
    },
    /**
     * @description 设计etl,跳转etl设计页面
     */
    DesignEtl(row) {
      let url = `/shtjjJcptBpmnWeb/#/etlp?etlId=${row.etlId}`;
      window.open(url);
      // window.location.href = `/jobFlow.html?scheduleId=${row.etlId}`;
    },
    /**
     * @description 运行etl
     */
    runEtl(row) {
      this.etlInfo = row;
      getParamsEtl(this.etlInfo.etlId).then((res) => {
        this.etlRunInfo.params = res.data[0].data.rows;
        if (this.etlRunInfo.params.length !== 0) {
          this.runDialog.show = true;
        } else {
          this.runConfirm();
        }
      });
    },
    /**
     * @description 运行
     */
    runConfirm() {
      // var re = /(^[1-9]\d*$)|(^(-1)$)|(^0$)/
      // if (!re.test(this.etlRunInfo.calculateNumber)) {
      //   Message.warning("输入数据不合法")
      //   return
      // }

      let params = {};
      this.etlRunInfo.params.forEach((item) => {
        params[item.paramName] = item.paramValue;
      });
      doRunEtl(
        this.etlInfo.etlId,
        this.etlRunInfo.calculateNumber,
        params
      ).then((res) => {
        Message.success("开始运行ETL");
        this.runClose();
      });
    },
    /**
     * @description 运行取消
     */
    runCancel() {
      this.runClose();
    },
    /**
     * @description 运行弹框关闭
     */
    runClose() {
      this.runDialog.show = false;
    },
    /**
     * @description 配置规则
     */
    configureRules(data) {},
    /**
     * @description 查看日志
     */
    lookLog(row) {
      this.etlName = row.etlName;
      this.logDialogVisible = true;
    },
    /**
     * @description 查看日志详情
     */
    look(row) {
      // this.detailVisible = true;
      this.etlLabel = row.etlLabel;
      this.visibleDialog = true;
      post("/api/datacompare/v1/etlexecution/queryLog.do", {
        postData: JSON.stringify({
          data: [
            {
              name: "executionId",
              vtype: "attr",
              data: row.etlExecutionId,
            },
          ],
        }),
      }).then((res) => {
        this.$set(this, "executionLog", res.data[0].data);
      });
    },
    handleClickExport() {
      this.saveFile(`日志[${this.etlLabel}].log`, this.executionLog);
    },
    saveFile(filename, filecontent) {
      let URL = window.URL || window.webkitURL;
      function click(node) {
        try {
          node.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
        } catch (e) {
          var evt = document.createEvent("MouseEvents");
          evt.initMouseEvent(
            "click",
            true,
            true,
            window,
            0,
            0,
            0,
            80,
            20,
            false,
            false,
            false,
            false,
            0,
            null
          );
          node.dispatchEvent(evt);
        }
      }

      function saveAs(blob, filename) {
        let type = blob.type;
        let force_saveable_type = "application/octet-stream";
        if (type && type != force_saveable_type) {
          // 强制下载，而非在浏览器中打开
          let slice = blob.slice || blob.webkitSlice || blob.mozSlice;
          blob = slice.call(blob, 0, blob.size, force_saveable_type);
        }

        let url = URL.createObjectURL(blob);

        // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#Valid Namespace URIs
        // 此处不要修改http协议为https, namespace URI仅支持4种固定写法
        let save_link = document.createElementNS(
          "http://www.w3.org/1999/xhtml",
          "a"
        );
        save_link.href = url;
        save_link.download = filename;
        save_link.rel = "noopener"; // tabnabbing
        click(save_link);
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1e4); // 10s
      }

      function rightSave(filename, filecontent) {
        let blob = new Blob([filecontent], { type: "text/plain" });

        saveAs(blob, filename);
      }
      rightSave(filename, filecontent);
    },
    /**
     * @description 关闭日志详情
     */
    cancel() {
      this.visibleDialog = false;
      this.executionLog = "";
    },
    /**
     * @description 删除etl
     */
    deleteEtl(row) {
      MessageBox.confirm("确认删除此条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          doDeleteEtl(row.etlId).then(() => {
            Message.success("删除成功");
            this.$refs["directoryTable"].reloadTable();
          });
        })
        .catch(() => {
          Message.warning("已取消删除");
        });
    },
    /**
     * @description 导入etl
     */
    importEtl() {
      this.importDialog.show = true;
    },
    /**
     * @description file类型文件导入
     */
    upload(param) {
      let fileObj = param.file;
      let form = new FormData();
      form.append("FileData", fileObj);
      form.append("client", "formUpload");
      form.append("name", fileObj.name);
      form.append("size", fileObj.size);
      ajax("/require/api/core/v1/attach/upload.do", form).then((res) => {
        // this.dialogFile = false
        let result = JSON.parse(res);
        let params = {
          data: [{ name: "fileId", vtype: "attr", data: result.fileId }],
        };
        post("/api/datacompare/v1/etl/importEtl.do", {
          postData: JSON.stringify(params),
        })
          .then(() => {
            Message({
              type: "success",
              message: "导入成功！",
            });
            this.importDialog.show = false;
            //刷新表格
            this.$refs.mainTable.reloadTable();
          })
          .catch(() => {
            Message.error("导入失败！");
            this.importDialog.show = false;
          });
      });
    },
    /**
     * @description 导出etl
     */
    exportEtl() {
      if (this.tableSelections.length === 0) {
        Message.warning("请选中数据后导出");
      } else {
        this.exportTo();
      }
    },
    // 导出接口
    async exportTo() {
      let unitInfo = [];
      this.tableSelections.map((item) => {
        unitInfo.push(item.etlId);
      });

      let postData = {
        data: [
          {
            name: "etlIds",
            vtype: "attr",
            data: unitInfo,
          },
        ],
      };
      let res = await post("/api/datacompare/v1/etl/exportEtl.do", {
        postData: JSON.stringify(postData),
      });
      if (res) {
        //console.log("fileId", res.data[0].data);
        window.open(
          `/require/api/core/v1/attach/download.do?fileId=${res.data[0].data}&name=${res.data[0].data}`
        );
      }
    },
    /**
     * @description 表格勾选事件
     */
    deliverySelection(selections) {
      this.tableSelections = selections;
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
  .detail-header {
    display: flex;
    margin-bottom: 10px;
  }
  .el-table .operateBtns .iconfont {
    margin-right: 3px;
  }
}
.journal-bg {
  width: 95%;
  height: 400px;
  overflow-y: auto;
  margin: auto;
  border: 1px solid #ddd;
  background-color: #142334;
  color: #fafafa;
  padding: 10px;
  .journal-content {
    white-space: pre-wrap;
  }
}
.el-dropdown {
  padding: 12px;
}
</style>
