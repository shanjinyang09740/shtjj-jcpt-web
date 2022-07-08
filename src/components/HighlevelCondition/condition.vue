<template>
  <div class="group" v-if="jsonData.sets">
    <condition-canvas :canvasData="jsonData.sets">关系</condition-canvas>
    <div class="group">
      <template v-for="(item, index) in jsonData.sets">
        <condition
          v-if="!!item.sets"
          :jsonData="item"
          :parentJson="jsonData.sets"
          :index="index"
          @lineClick="emitlineClick"
          :conditionOptions="conditionOptions"
          :key="index"
        ></condition>
        <div
          class="leaf"
          v-else
          :key="index"
          @click="lineClick($event, jsonData.sets, jsonData.sets, index)"
        >
          <fu-form class="oneline" :inline="true" :id="item.id">
            <fu-form-item prop="columnName">
              <sel :item="item" :conditionOptions="conditionOptions"></sel>
            </fu-form-item>
            <fu-form-item prop="operator">
              <operatorVal
                :item="item"
                :conditionOptions="conditionOptions"
              ></operatorVal>
            </fu-form-item>
            <fu-form-item prop="value">
              <valueCondition
                :item="item"
                :conditionOptions="conditionOptions"
              ></valueCondition>
            </fu-form-item>
            <!-- <i
              class="el-icon-circle-plus-outline icon-color-blue"
              @click.stop="addOneline(jsonData.sets, index)"
              >新增</i
            > -->
            <i class="btn-add" @click.stop="addOneline(jsonData.sets, index)"
              ><span class="el-icon-circle-plus-outline icon-color-blue"></span>
              新增</i
            >
            <i
              class="btn-delete el-icon-close"
              @click.stop="deleteOneline(jsonData.sets, index)"
            ></i>
          </fu-form>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { Form, FormItem } from "fusion-ui";

import sel from "./sel.vue";
import operatorVal from "./operatorVal.vue";
import valueCondition from "./valueCondition.vue";
import conditionCanvas from "./conditionCanvas.vue";

export default {
  name: "condition",
  components: {
    FuForm: Form,
    FuFormItem: FormItem,
    conditionCanvas: conditionCanvas,
    sel,
    operatorVal,
    valueCondition,
  },
  // extends: null,
  // minxins: [],
  props: ["jsonData", "parentJson", "index", "conditionOptions"],
  data() {
    return {
      defaultRelation: "or",
      rules: {
        columnName: [{ required: true, trigger: "change" }],
        operator: [{ required: true, trigger: "change" }],
      },
    };
  },

  methods: {
    emitlineClick(parentJson, data, index) {
      this.$emit("lineClick", parentJson, data, index);
    },
    /**
     * @description 条件选择选中事件
     */
    lineClick(e, parentJson, data, index) {
      // console.log(e,data,index);
      document.querySelectorAll(".oneline").forEach((item) => {
        item.classList.remove("leaf-select");
      });
      e.target.classList.add("leaf-select");
      this.$emit("lineClick", parentJson, data, index);
    },
    /**
     * @description 添加一行
     */
    addOneline(data, index) {
      console.log(data, index);
      let obj = {
        columnName: "",
        operator: "",
        value: "",
        dataType: "",
        id: new Date().getTime(),
      };
      if (data.length == 1) {
        obj.relation = this.defaultRelation;
      } else {
        if (index === 0) {
          obj.relation = data[index + 1].relation;
        } else if (index === data.length - 1) {
          obj.relation = data[index].relation;
        } else {
          obj.relation =
            obj.relation ||
            (data.length > index + 1 ? data[index + 1].relation : "");
        }
      }
      data.splice(index + 1, 0, obj);
    },
    /**
     * @description 删除一行
     */
    deleteOneline(data, index) {
      if (data.length === 1) {
        this.parentJson.splice(this.index, 1);
      }
      data.splice(index, 1);
      if (data.length === 1) {
        //删除之后只剩下一个
        if (data[0].sets && data[0].sets.length === 1) {
          data[0] = data[0].sets[0];
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.condition-canvas + .group {
  margin-left: 60px;
}
.group {
  .condition-canvas {
    width: 60px;
    float: left;
    // background-color: rgb(148, 141, 141);
  }
}
.leaf {
  margin-top: 4px;
  margin-bottom: 4px;
  .el-form-item {
    margin-top: 4px;
    margin-bottom: 4px;
  }
  i {
    margin-top: 20px;
  }
}
.leaf-select {
  border: 1px solid red;
}
.oneline {
  background-color: #f2f3f4;
}
.icon-color-blue {
  color: #4499f2;
}
.btn-add {
  font-size: 16px;
  font-style: normal;
  color: #99a9bf;
  cursor: pointer;
}
.btn-delete {
  font-size: 16px;
  color: #99a9bf;
  margin-left: 10px;
  cursor: pointer;
}
</style>
