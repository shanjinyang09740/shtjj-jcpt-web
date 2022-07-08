<template>
  <div class="mapContent">
    <div class="allShBtn" @click="allShiDataClick">上海市</div>
    <div class="legend">
      <div class="title">上报进度</div>
      <div class="legendItem" v-for="(item, index) in legendList" :key="index">
        <i :style="{ backgroundColor: item.backgroundColor }"></i
        ><span>{{ item.text }}</span>
      </div>
    </div>
    <div id="map"></div>
    <custom-dialog
      v-if="customDialog.isShow"
      :isShowDialog="customDialog.isShow"
      :isShowOperation="false"
      :closeOnClickModal="closeDialogClick"
      :size="'mini'"
      :width="'90%'"
      @on-result-change="changeIsShowDialog"
      @child-operation="operation"
    >
      <div slot="body">
        <div class="dialogTitle">
          <span>{{ currentArea }}</span>
          <span>{{ ysbData }}</span>
          <span>{{ wsbData }}</span>
        </div>
        <fu-table
          class="tableZd"
          :fu-data="tableData"
          ref="mainTable"
          :row-key="'id'"
          :width="'90%'"
          max-height="450px"
          v-loading="tableLoading"
        >
          <fu-table-column
            v-for="(item, index) in tableData.columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :minWidth="item.width"
            :align="item.align"
          >
            <template slot-scope="scope">
              <span>{{ tramsFormate(scope.row[item.prop], item.prop) }}</span>
            </template>
          </fu-table-column>
        </fu-table>
      </div>
    </custom-dialog>
  </div>
</template>

<script>
import {
  Scene,
  PolygonLayer,
  LineLayer,
  PointLayer,
  dialog,
  Popup,
} from "@antv/l7";
import { Mapbox } from "@antv/l7-maps";
import geoData from "./shanghai.json";
import { Table, TableColumn } from "fusion-ui";
import http from "@/utils/http";
import CustomDialog from "@/components/CommonDialog";

export default {
  name: "Polygon_province_shanghai_gai",
  components: {
    FuTable: Table,
    FuTableColumn: TableColumn,
    CustomDialog,
  },
  data() {
    return {
      totalAllData: [],
      allShiJdNum: "",
      allShiJdObj: {
        num: 0,
        ysb: 0,
        wsb: 0,
      },
      currentArea: "上海市",
      ysbData: "",
      wsbData: "",
      mapData: {},
      closeDialogClick: false,
      tableLoading: false,
      legendList: [
        {
          text: "80-100%",
          range: {
            max: 100,
            min: 80,
          },
          backgroundColor: "#329A1A",
        },
        {
          text: "60-80%",
          range: {
            max: 80,
            min: 60,
          },
          backgroundColor: "#47A5F7",
        },
        {
          text: "40-60%",
          range: {
            max: 60,
            min: 40,
          },
          backgroundColor: "#26ABBE",
        },
        {
          text: "20-40%",
          range: {
            max: 40,
            min: 20,
          },
          backgroundColor: "#B4A138",
        },
        {
          text: "0-20%",
          range: {
            max: 20,
            min: 0,
          },
          backgroundColor: "#D25353",
        },
      ],
      tableData: {
        columns: [
          {
            id: 1,
            label: "专业",
            prop: "tjzydm",
            width: "100",
            align: "left",
          },
          {
            id: 2,
            label: "表名",
            prop: "bbzwqc",
            width: "270",
            align: "left",
          },
          {
            id: 3,
            label: "表号",
            prop: "bh",
            width: "80",
            align: "left",
          },
          {
            id: 4,
            label: "进度",
            prop: "jd",
            width: "60",
            reqUrl: "",
            align: "left",
          },
          {
            id: 5,
            label: "截止日期",
            prop: "tbjzsj",
            width: "110",
            reqUrl: "",
            align: "left",
          },
        ],
        rows: [],
      },
      customDialog: {
        isShow: false,
        title: "",
      },
    };
  },
  created() {
    this.mapData = { ...geoData };
  },
  mounted() {
    //渲染地图
    this.afrashMap();
    this.initData();
  },
  watch: {
    "customDialog.isShow": {
      handler: function (newVal, oldValue) {
        console.log("newval", newVal);
        if (newVal) {
          setTimeout(() => {
            this.closeDialogClick = true;
          }, 400);
        } else {
          setTimeout(() => {
            this.closeDialogClick = false;
          }, 400);
        }
      },
      deep: true,
    },
  },
  methods: {
    initData() {
      let timer = null;
      this.initChartData();
      clearInterval(timer);
      timer = setInterval(() => {
        this.initChartData();
      }, 30 * 60 * 1000);
    },
    initChartData() {
      http.post("/api/nkgl/v1/map/sbjd.do").then((res) => {
        let result = res.data[0].data.rows;
        if (result) {
          //地图数据
          let hotsData = result;
          let tempMapData = { ...geoData };
          hotsData.some((ite) => {
            if (ite.adcode == "310000") {
              this.allShiJdNum = ite.jd;
              this.allShiJdObj = {
                num: ite.jd ? ite.jd : 0,
                ysb: ite.ysb ? ite.ysb : 0,
                wsb: ite.wsb ? ite.wsb : 0,
              };
              return true;
            }
          });
          tempMapData.features.forEach((item) => {
            let code = item.properties.adcode;
            hotsData.some((ite) => {
              if (code == ite.adcode) {
                item.properties.value = ite.jd;
                item.properties.ysb = ite.ysb;
                item.properties.wsb = ite.wsb;
                return true;
              }
            });
          });
          this.mapData = tempMapData;
          //渲染地图
          this.afrashMap();
        }
      });
    },
    allShiDataClick() {
      console.log("点击了");
      this.currentArea = `上海市：${this.allShiJdNum ? this.allShiJdNum : 0}%`;
      this.ysbData = `已上报：${this.allShiJdObj.ysb}`;
      this.wsbData = `未上报：${this.allShiJdObj.wsb}`;
      this.customDialog.isShow = true;
      this.tableLoading = true;
      this.tableData.rows = [];
      let postData = {
        data: [{ name: "areaCode", vtype: "attr", data: "310000" }],
      };
      http
        .post("/api/nkgl/v1/map/sbjdByArea.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          this.tableLoading = false;
          let result = res.data[0].data;
          let resultData = result.rows;
          this.tableData.rows = resultData;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    tramsFormate(val, prop) {
      let newValue = "";
      if (prop == "jd") {
        newValue = `${val}%`;
      } else {
        newValue = val;
      }
      return newValue;
    },
    /**
     * @description 切换弹窗显示状态
     * @param {Boolean} val
     */
    changeIsShowDialog(val) {
      this.customDialog.isShow = val;
    },
    /**
     * @description 弹窗操作按钮事件
     * @param {String} val ---- confirm/cancel 确认/取消
     * @param {Object} data 表单数据
     */
    operation() {
      this.customDialog.isShow = false;
    },
    afrashMap() {
      document.querySelector("#map").innerHTML = "";
      const scene = new Scene({
        id: "map",
        map: new Mapbox({
          pitch: 24,
          style: "blank",
          center: [121.34687803809675, 31.397253211651545],
          zoom: 8.5,
        }),
        logoVisible: false,
        preserveDrawingBuffer: true,
        rotateEnable: false,
      });
      window.scene = scene;
      scene.on("loaded", () => {
        const filllayer = new PolygonLayer({
          zIndex: 2,
        })
          .source(this.mapData)
          .shape("extrude")
          .color("name*value", (name, value) => {
            return this.getAreaBgColor(name, value);
          })
          .size(20)
          .active(true)
          .style({
            opacityLinear: {
              enable: true, // true - false
              dir: "in", // in - out
            },
            heightfixed: true, //  默认为 false
            pickLight: true, //  默认为 false
            raisingHeight: 20,
          });
        scene.addLayer(filllayer);

        const lineLayer = new LineLayer({ zIndex: 1 })
          .source(this.mapData)
          .shape("line")
          .color("name*value", (name, value) => {
            return this.getAreaBgColor(name, value);
          })
          .size(1);
        scene.addLayer(lineLayer);

        const wallLayer = new LineLayer({ zIndex: 1 })
          .source(this.mapData)
          .shape("wall")
          .color("name*value", (name, value) => {
            return this.getAreaBgColor(name, value);
          })
          .size(10)
          .style({
            heightfixed: true,
            opacity: 1,
            targetColor: "rbga(255,255,255, 0)",
          });
        scene.addLayer(wallLayer);

        const labelLayer = new PointLayer({
          zIndex: 5,
        })
          .source(this.mapData)
          .color("#fff")
          .shape("name", "text")
          .size(14)
          .style({
            opacity: 1,
            stroke: "#fff",
            strokeWidth: 0,
            fontFamily: "Times New Roman",
            fontWeight: 700,
            raisingHeight: 10,
          });
        scene.addLayer(labelLayer);

        filllayer.on("click", (e) => {
          console.log("点击开始了", e);
          this.changeAreaData(e);
        });
      });
    },
    changeAreaData(e) {
      this.tableData.rows = [];
      let currentQu = e.feature.properties.adcode,
        currentName = e.feature.properties.name,
        currentValue = e.feature.properties.value
          ? e.feature.properties.value
          : 0;
      this.currentArea = `${currentName}：${currentValue}%`;
      this.ysbData = `已上报：${
        e.feature.properties.ysb ? e.feature.properties.ysb : 0
      }`;
      this.wsbData = `未上报：${
        e.feature.properties.wsb ? e.feature.properties.wsb : 0
      }`;
      this.customDialog.isShow = true;
      this.tableLoading = true;
      let postData = {
        data: [{ name: "areaCode", vtype: "attr", data: currentQu + "" }],
      };
      http
        .post("/api/nkgl/v1/map/sbjdByArea.do", {
          postData: JSON.stringify(postData),
        })
        .then((res) => {
          this.tableLoading = false;
          let result = res.data[0].data;
          let resultData = result.rows;
          this.tableData.rows = resultData;
        })
        .catch((err) => {
          this.tableLoading = false;
        });
    },
    getAreaBgColor(name, value) {
      let areaColor = "#47A5F7";
      this.legendList.some((item) => {
        let range = item.range;
        if (value >= range.min && value <= range.max) {
          areaColor = item.backgroundColor;
          return true;
        }
      });
      return areaColor;
    },
  },
};
</script>

<style lang="less" scoped>
.mapContent {
  width: 98%;
  height: 98%;
  position: relative;
  .allShBtn {
    position: absolute;
    left: 20px;
    top: 30px;
    z-index: 5;
    color: #1dcbf6;
    cursor: pointer;
    font-size: 20px;
    font-weight: bolder;
    &:hover {
      color: #ffd307;
    }
  }
  .legend {
    position: absolute;
    right: 30px;
    top: 30px;
    .title {
      color: #71ede8;
      font-size: 18px;
      padding-bottom: 5px;
    }
    .legendItem {
      display: flex;
      height: 25px;
      align-items: center;
      font-size: 16px;
      color: #fff;
      i {
        width: 10px;
        height: 10px;
        margin-right: 5px;
      }
    }
  }
  #map {
    width: 98%;
    height: 100%;
    position: relative;
    margin: 0 auto;
  }
  /deep/ .el-dialog {
    background-color: rgba(2, 6, 10, 0.8);
    border: 1px solid #387482;
    margin-top: 5vh !important;
    .el-dialog__title {
      color: #ffc602;
      font-size: 18px;
    }
  }

  /deep/.el-table th {
    background-color: rgb(22, 80, 65);
  }
  /deep/ .el-table td,
  /deep/ .el-table th {
    padding: 8px 0;
  }
  /deep/.el-table {
    background-color: transparent;
    color: #fff;
    .el-table__header {
      background-color: rgb(22, 80, 65);
      .cell {
        font-size: 14px;
        color: #44afaa;
      }
    }
    td.is-hidden > * {
      visibility: visible;
    }
  }
  .el-table__expanded-cell {
    background-color: transparent;
    color: #fff;
  }
  /deep/.el-table__fixed-right::before,
  /deep/.el-table::before {
    background-color: transparent;
  }
  /deep/.el-table th,
  /deep/.el-table tr,
  /deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: rgba(28, 82, 150, 0.27);
  }
  /deep/.el-table thead,
  /deep/.el-table__empty-text {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: rgba(250, 250, 250, 0.85);
    font-weight: 500;
  }
  /deep/.el-table td,
  /deep/.el-table th.is-leaf {
    border-bottom: 1px solid rgba(23, 101, 165, 0.3);
  }
}
/deep/ .el-dialog__headerbtn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 0;
  background: 0 0;
  border: none;
  outline: 0;
  cursor: pointer;
  font-size: 24px;
}
/deep/ .el-dialog__header {
  padding: 20px 0 0 20px;
}
.dialogTitle {
  color: #ffc602;
  font-size: 18px;
  padding-bottom: 5px;
  span {
    padding-right: 20px;
  }
}

/deep/ .el-table--scrollable-y .el-table__body-wrapper {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
