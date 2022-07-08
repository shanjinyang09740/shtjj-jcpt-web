<template>
  <div class="bgqbSelect" id="bgqbSelect">
    <div id="min_bgq" class="setBgqSelectArea">{{ minBgq + unit }}</div>
    <div id="dragbar">
      <div class="bgqAreaTip">
        <span id="currentMinBgq">{{ currentMinBgq + unit }}</span
        >-<span id="currentMaxBgq">{{ currentMaxBgq + unit }}</span>
      </div>
      <div class="long_bar_con">
        <div id="long_bar">
          <div id="small_bar"></div>
          <span class="btn leftBtn"></span>
          <span class="btn rightBtn"></span>
        </div>
      </div>
    </div>
    <div id="max_bgq" class="setBgqSelectArea">{{ maxBgq + unit }}</div>
  </div>
</template>

<script>
export default {
  name: "timeLine",
  components: {},
  props: {
    bgqListData: {
      default: () => [],
      type: Array,
    },
    defaultShowNum: {
      default: 0,
      type: Number,
    },
  },
  data() {
    return {
      Isclick: false,
      minBgq: "",
      maxBgq: "",
      //报告期单位
      unit: "年",
      total: "",
      zindex: 0,
      isShow: false,
      //当前报告期最小值
      currentMinBgq: "",
      //当前报告期最大值
      currentMaxBgq: "",
      LRBtnsDom: null,
      longbarDom: null,
      smallbarDom: null,
      bgqAreaTipDom: null,
    };
  },
  computed: {},
  watch: {
    bgqListData: {
      handler(newValue, oldValue) {
        //处理报告期数据，获取到报告期的最大值和最小值
        if (newValue.length > 0) this.getMinAndMaxBgq();
      },
      deep: true,
      immediate: true,
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
    //处理报告期数据，获取到报告期的最大值和最小值
    getMinAndMaxBgq() {
      this.longbarDom = document.getElementById("long_bar");
      this.LRBtnsDom = this.longbarDom.getElementsByClassName("btn");
      this.smallbarDom = document.getElementById("small_bar");
      this.bgqAreaTipDom = document.querySelector(".bgqAreaTip");
      if (this.bgqListData.length > 0) {
        document.querySelector("#bgqbSelect").style.display = "block";
      } else {
        document.querySelector("#bgqbSelect").style.display = "none";
      }
      let bgqListArr = this.bgqListData.map((item) => {
        return parseInt(item);
      });
      let bgqListArrNew = [...new Set(bgqListArr)];
      this.minBgq = Math.min.apply(null, bgqListArrNew);
      this.maxBgq = Math.max.apply(null, bgqListArrNew);
      if (this.defaultShowNum) {
        this.currentMinBgq =
          bgqListArrNew.length > this.defaultShowNum
            ? this.maxBgq - this.defaultShowNum
            : this.minBgq;
      } else {
        this.currentMinBgq = this.minBgq;
      }
      this.currentMaxBgq = this.maxBgq;
      //报告期时间轴事件max
      this.bgqAreaSelectEvent();
    },
    //报告期时间轴事件
    bgqAreaSelectEvent() {
      let _THIS = this;

      let initSmallbarWidth = "";
      let initSmallbarLeft = "";
      let initLeftBtnLeft = "";
      //时间轴最大长度
      let longbarDomWidth = this.longbarDom.offsetWidth;

      this.zindex = 2;
      _THIS.total = this.maxBgq - this.minBgq;
      _THIS.Isclick = false;
      if (this.defaultShowNum) {
        if (_THIS.total > this.defaultShowNum) {
          initSmallbarWidth = parseInt(
            (this.defaultShowNum / _THIS.total) * longbarDomWidth
          );
          initSmallbarLeft = parseInt(
            longbarDomWidth * (1 - this.defaultShowNum / _THIS.total)
          );
          initLeftBtnLeft = initSmallbarLeft;
          _THIS.getCurrentSelectBgqArea();
        } else {
          initSmallbarWidth = longbarDomWidth;
          initSmallbarLeft = 0;
          initLeftBtnLeft = 0;
        }
      } else {
        initSmallbarWidth = longbarDomWidth;
        initSmallbarLeft = 0;
        initLeftBtnLeft = 0;
      }
      this.bgqAreaTipDom.style.left =
        parseInt(initSmallbarLeft + initSmallbarWidth / 2) + "px";
      this.smallbarDom.style.width = initSmallbarWidth + "px";
      this.smallbarDom.style.left = initSmallbarLeft + "px";
      this.LRBtnsDom[0].style.left = initLeftBtnLeft + "px";
      this.LRBtnsDom[1].style.left = 100 + "%";
      let maxwidth = this.longbarDom.offsetWidth; // 最大移动值
      this.LRBtnsDom[0].onmousedown = function (e) {
        _THIS.Isclick = true;
        this.style.zIndex = ++_THIS.zindex;
        var x = (e || window.event).clientX; // 取点击位置的X轴长度值
        // 按钮的x轴长度值
        let lenght = this.offsetLeft + this.offsetWidth / 2;
        let btn2lenght =
          _THIS.LRBtnsDom[1].offsetLeft + _THIS.LRBtnsDom[1].offsetWidth / 2;
        let maxlenght = Math.min(maxwidth, btn2lenght);
        let leftBtn = this;
        document.onmousemove = function (e) {
          if (_THIS.Isclick) {
            let thisX = (e || window.event).clientX; // 当前移动位置的X轴长度值
            let golenght = Math.min(
              maxlenght,
              Math.max(0, lenght + (thisX - x))
            );
            // 移动的长度
            let leftVal = (golenght / maxwidth) * 100;
            leftBtn.style.left = leftVal + "%"; // 使用百分比
            _THIS.smallbarDom.style.left = leftBtn.style.left;
            _THIS.smallwidth(_THIS.LRBtnsDom);
            _THIS.setBgqSelectArea("currentMinBgq", leftVal);
            //设置报告期区间的提示位置
            _THIS.setLeftBtnBgqAreaTip(golenght);
          } else {
            return false;
          }
        };
        document.onmouseup =
          window.onblur =
          leftBtn.onlosecapture =
            function () {
              _THIS.documentMouseupEvent(leftBtn);
            };
        this.setCapture && this.setCapture();
        return false;
      };
      _THIS.LRBtnsDom[1].onmousedown = function (e) {
        _THIS.Isclick = true;
        this.style.zIndex = ++_THIS.zindex;
        let x = (e || window.event).clientX;
        let lenght = this.offsetLeft + this.offsetWidth / 2;
        let btn1lenght =
          _THIS.LRBtnsDom[0].offsetLeft + _THIS.LRBtnsDom[0].offsetWidth / 2;
        let minlenght = Math.max(0, btn1lenght);
        let rightBtn = this;
        document.onmousemove = function (e) {
          if (_THIS.Isclick) {
            let thisX = (e || window.event).clientX;
            let golenght = Math.max(
              minlenght,
              Math.min(maxwidth, lenght + (thisX - x))
            );
            let leftVal = (golenght / maxwidth) * 100;
            rightBtn.style.left = leftVal + "%";
            _THIS.smallwidth();
            _THIS.setBgqSelectArea("currentMaxBgq", leftVal);
            //设置报告期区间的提示位置
            _THIS.setRightBtnBgqAreaTip();
          } else {
            return false;
          }
        };
        document.onmouseup =
          window.onblur =
          rightBtn.onlosecapture =
            function () {
              _THIS.documentMouseupEvent(rightBtn);
            };
        this.setCapture && this.setCapture();
        return false;
      };
    },
    /**
     * @description 设置时间轴区间极值
     * @param {String} type
     * @param {Sting} leftVal
     *
     */
    setBgqSelectArea(type, leftVal) {
      var p = parseInt((this.total / 100) * leftVal) + this.minBgq;
      if (p > this.minBgq && p < this.maxBgq) {
        p = p % 5 > 3 ? p + (5 - (p % 5)) : p - (p % 5);
      }
      this.$set(this, type, p);
    },
    smallwidth() {
      let left = parseFloat(this.LRBtnsDom[0].style.left);
      let right = parseFloat(this.LRBtnsDom[1].style.left);
      this.smallbarDom.style.width =
        (right - left > 0 ? Math.floor(right - left) : 0) + "%";
    },
    //document鼠标抬起事件处理函数
    documentMouseupEvent(btn) {
      this.Isclick = false;
      btn.releaseCapture && btn.releaseCapture();
      var _con = document.querySelector("#macroEcoMain");
      if (this.checkIn(_con)) {
        //获取所选的报告期的区间
        this.getCurrentSelectBgqArea();
      }
    },
    // 判断鼠标是否落在一个块级元素内部
    checkIn(obj) {
      if (!obj) {
        return false;
      }
      // 鼠标相对屏幕横坐标
      var x = Number(window.event.clientX);
      // 鼠标相对屏幕纵坐标
      var y = Number(window.event.clientY);
      // obj相对屏幕的横坐标
      var div_x = Number(obj.getBoundingClientRect().left);
      // obj相对屏幕的横坐标+width
      var div_x_width = Number(
        obj.getBoundingClientRect().left + obj.clientWidth
      );
      // obj相对屏幕的纵坐标
      var div_y = Number(obj.getBoundingClientRect().top);
      // obj相对屏幕的纵坐标+height
      var div_y_height = Number(
        obj.getBoundingClientRect().top + obj.clientHeight
      );

      if (x > div_x && x < div_x_width && y > div_y && y < div_y_height) {
        return true;
      } else {
        return false;
      }
    },
    //设置报告期区间的提示位置
    setLeftBtnBgqAreaTip(golenght) {
      let left = document.querySelector(".leftBtn").offsetLeft;
      let right = document.querySelector(".rightBtn").offsetLeft;
      let smallbarWidth = Math.abs(right - left);
      let slideWidth = document.querySelector(".bgqAreaTip").offsetWidth;
      let bgqAreaTipLeft = parseInt(
        Math.abs(golenght + smallbarWidth / 2 - slideWidth / 2)
      );
      document.querySelector(".bgqAreaTip").style.left = bgqAreaTipLeft + "px";
    },
    setRightBtnBgqAreaTip() {
      let left = document.querySelector(".leftBtn").offsetLeft;
      let right = document.querySelector(".rightBtn").offsetLeft;
      let smallbarWidth = Math.abs(right - left);
      let slideWidth = document.querySelector(".bgqAreaTip").offsetWidth;
      let bgqAreaTipLeft;
      if (smallbarWidth < slideWidth) {
        bgqAreaTipLeft = parseInt(
          Math.abs(smallbarWidth / 2 + left) - slideWidth / 2
        );
      } else {
        bgqAreaTipLeft = parseInt(
          Math.abs(smallbarWidth / 2 - slideWidth / 2 + left)
        );
      }
      document.querySelector(".bgqAreaTip").style.left = bgqAreaTipLeft + "px";
    },

    //获取所选的报告期的区间
    getCurrentSelectBgqArea() {
      //条件筛选方法
      this.$emit("queryBtnClick", {
        currentMinBgq: this.currentMinBgq,
        currentMaxBgq: this.currentMaxBgq,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.bgqbSelect {
  width: 385px !important;
  height: 35px;
  display: inline-block;
  position: relative;
  top: 2px;
  display: none;
}

.bgqbSelect > div {
  display: inline-block;
}

#dragbar {
  position: relative;
  top: 10px;
  width: 70%;
}

#long_bar {
  height: 4px;
  border-radius: 2px;
  background-color: #ccd3e4;
}

#small_bar {
  background-color: #3091f2;
  position: absolute;
  z-index: 1;
  top: 1px;
  height: 0.6em;
  line-height: 0.6em;
  overflow: hidden;
}

.bgqAreaTip {
  min-width: 78px;
  height: 20px;
  line-height: 18px;
  font-size: 12px;
  font-family: SimSun;
  color: #333;
  position: absolute;
  top: -19px;
  left: 50%;
  margin-left: -39px;
  background: url(./images/bgqTip-icon.png) no-repeat center bottom;
}

#long_bar .btn {
  width: 16px;
  height: 16px;
  z-index: 2;
  position: absolute;
  cursor: pointer;
  top: -6px;
  margin-left: -8px;
  background: url(./images/slide-icon.png) no-repeat center center;
}

.setBgqSelectArea {
  width: auto;
  height: 18px;
  line-height: 18px;
  margin: 0 10px;
  font-size: 12px;
  font-family: "SimSun";
  color: #666;
  text-align: center;
}
</style>
