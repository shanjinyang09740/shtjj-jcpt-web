<template>
  <div class="wrapper">
    <fu-upload
      class="upload-demo"
      drag
      multiple
      action="/api/nkgl/v1/attach/upload.do"
      :on-success="handleUploadSuccess"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text"><em>点击或将文件拖到此处上传</em></div>
      <div class="des">说明：仅支持excel(.xls、.xlsx）文件</div>
    </fu-upload>
  </div>
</template>

<script>
import { Upload, Message } from "fusion-ui";
import http from "@/utils/http";
export default {
  name: "ImportVariable",
  components: {
    FuUpload: Upload,
  },
  props: {
    selectTreeNode: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    beforeUpload(file) {
      let fileName = file.name;
      let type = fileName.split(".")[1];
      let flag = type == "zip" ? true : false;
      if (!flag) {
        Message.warning("只能上传压缩包文件");
      }
      return flag;
    },
    handleUploadProgress(event, file, fileList) {
      // console.log(file, fileList);
    },
    /**
     * @description 提交表单数据
     * @params {Function} callback
     */
    submit(callback) {
      callback({}, "ImportVariable");
    },
    /**
     * @description  上传成功的回调
     * @param {}
     */
    handleUploadSuccess(res, file) {
      let fileId = res.fileId;
      let postData = {
        data: [
          {
            vtype: "attr",
            name: "fileId",
            data: fileId, //文件id
          },
        ],
      };
      http
        .post("/api/nkgl/v1/dhhc/importExcelDhhc.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          if (res.message == "success") {
            Message.success(`导入成功`);
          } else {
            Message.error("导入失败");
          }
        })
        .catch((err) => {
          Message.error(`导入失败!，${JSON.parse(err.response).data}`);
        });
    },
  },
};
</script>
<style lang="less" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  .el-upload__text {
    font-size: 18px;
  }
  .des {
    font-size: 14px;
    color: #999;
  }
}
</style>
