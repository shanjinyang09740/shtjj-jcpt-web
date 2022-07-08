<template>
  <div class="condition-canvas">
    <canvas
      @click.stop="changeRelation"
      :id="canvasId"
      :width="marginLeft + canvasWidth"
      :height="canvasHeight"
    ></canvas>
  </div>
</template>

<script>
export default {
  name: "conditionCanvas",
  components: {},
  // extends: null,
  // minxins: [],
  props: ["canvasData"],
  data() {
    return {
      onelineHeight: 52.8,
      canvasId: "",
      relationJson: {
        "": "",
        and: "和",
        or: "或",
      },
      marginLeft: 18,
      canvasWidth: 60,
    };
  },
  computed: {
    canvasHeight() {
      let count = { count: 0 };
      this.getLineCount(this.canvasData, count);
      return this.onelineHeight * count.count - 8;
    },
    relation() {
      if (this.canvasData.length == 1) return "";
      else if (this.canvasData.length > 1) {
        return this.canvasData[1].relation;
      }
    },
  },
  watch: {
    canvasData: {
      handler(newValue) {
        if (newValue) {
          this.drawCanvas();
        }
      },
      deep: true,
    },
  },
  beforeCreate() {},
  created() {
    this.canvasId =
      "canvas" +
      Number(Math.random().toString().substr(3, length) + Date.now()).toString(
        36
      );
  },
  beforeMount() {},
  mounted() {
    // this.$nextTick(()=>{
    this.drawCanvas();
    // })
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * @description 切换关系
     */
    changeRelation() {
      this.canvasData.forEach((item, index) => {
        if (index != 0) {
          item.relation = item.relation === "and" ? "or" : "and";
        }
      });
    },
    /**
     * @description 获取行数的递归方法
     */
    getLineCount(data, count) {
      data.forEach((item) => {
        if (item.sets) this.getLineCount(item.sets, count);
        else count.count = count.count + 1;
      });
    },
    /**
     * @description 绘制canvas
     */
    drawCanvas() {
      this.$nextTick(() => {
        var canvas = document.getElementById(this.canvasId);
        let height = this.canvasHeight;
        let width = this.canvasWidth;
        let x = canvas.offsetLeft;
        let y = canvas.offsetTop;
        if (canvas.getContext) {
          var ctx = canvas.getContext("2d");
          //获取第一个和最后一个孩子的高度
          let firstChildHeight = 0;
          let lastChildHeight = 0;
          if (this.canvasData.length > 1) {
            //不止一个节点，至少两个节点，则需要竖线
            let firstChildInfo = this.getChildCount(this.canvasData[0]);
            firstChildHeight = this.onelineHeight * firstChildInfo.count;
            let lastChildInfo = this.getChildCount(
              this.canvasData[this.canvasData.length - 1]
            );
            lastChildHeight = this.onelineHeight * lastChildInfo.count;

            ctx.beginPath();
            ctx.moveTo(
              firstChildInfo.flag === 1
                ? this.canvasWidth + this.marginLeft
                : this.canvasWidth,
              firstChildHeight / 2.0
            );
            ctx.lineTo(this.marginLeft, firstChildHeight / 2.0);
            ctx.lineTo(this.marginLeft, height - lastChildHeight / 2.0);
            ctx.lineTo(
              lastChildInfo.flag === 1
                ? this.canvasWidth + this.marginLeft
                : this.canvasWidth,
              height - lastChildHeight / 2.0
            );
            ctx.stroke();
          }

          let beforeHeight = firstChildHeight;
          this.canvasData.forEach((item, index) => {
            if (
              (this.canvasData.length > 1 &&
                index !== 0 &&
                index !== this.canvasData.length - 1) ||
              this.canvasData.length <= 1
            ) {
              let childInfo = this.getChildCount(item);
              let childHeight = this.onelineHeight * childInfo.count;
              ctx.beginPath();
              ctx.moveTo(this.marginLeft, beforeHeight + childHeight / 2.0);
              ctx.lineTo(
                childInfo.flag === 1
                  ? this.canvasWidth + this.marginLeft
                  : this.canvasWidth,
                beforeHeight + childHeight / 2.0
              );
              ctx.stroke();
              beforeHeight = beforeHeight + childHeight;
            }
          });

          //and or 和无的图片
          //and or 和无的图片
          //画圆
          ctx.beginPath();
          ctx.arc(this.marginLeft, height / 2.0, 14, 0, Math.PI * 2, false);
          ctx.fillStyle = "rgb(191, 218, 249)";
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = "#c6c6c6";
          ctx.stroke();
          //写文字
          ctx.font = " 18px serif";
          ctx.textBaseline = "middle";
          ctx.textAlign = "center";
          ctx.strokeStyle = "#197cf0";
          ctx.strokeText(
            this.relationJson[this.relation],
            this.marginLeft,
            height / 2.0
          );
        }
      });
    },
    /**
     * @description 获取所有孩子节点的行数
     */
    getChildCount(child) {
      let childCount = 0;
      let flag = 0;
      if (child.sets) {
        let t = { count: 0 };
        this.getLineCount(child.sets, t);
        childCount = t.count;
        flag = 1;
      } else {
        childCount = 1;
        flag = 0;
      }
      return { count: childCount, flag: flag };
    },
  },
};
</script>

<style lang="less" scoped></style>
