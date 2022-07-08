<template>
  <div>
    <fu-button @click="addGroup" type="primary">添加组合</fu-button>
    <div style="width: 100%; height: 400px; position: relative; overflow: auto">
      <fu-button
        v-if="addButtonShow"
        class="addButton"
        @click.stop="addCondition"
        icon="el-icon-plus"
        >添加条件</fu-button
      >
      <template v-for="(item, index) in jsonData">
        <condition
          v-if="!!item.sets"
          :jsonData="item"
          :parentJson="jsonData"
          :index="index"
          :conditionOptions="conditionOptions"
          @lineClick="lineSelect"
          :key="index"
        ></condition>
      </template>
    </div>

    <!-- <condition :jsonData="jsonData" @lineClick="lineSelect"></condition> -->
  </div>
</template>

<script>
import { Button, Message } from "fusion-ui";
import condition from "./condition.vue";

export default {
  name: "conditionIndex",
  components: {
    condition: condition,
    FuButton: Button,
    Message: Message,
  },
  // extends: null,
  // minxins: [],
  props: {
    conditionOptions: {
      default: () => {
        return [
          {
            list: "",
            codeType: "",
            label: "报告期_代码",
            prop: "JCZC_BGQ_DM",
            type: "TEXT",
          },
          {
            list: "",
            codeType: "",
            label: "出口总额增速",
            prop: "JCZC_CK_ZEZS",
            type: "NUMBER",
          },
        ];
      },
    },
  },
  data() {
    return {
      selectLine: {}, //当前选中行
      isSelectBefore: false,
      jsonData: [
        //   {"sets": [
        //     {
        //       "columnName": "COLUMN0",
        //       "operator": "lessThan",
        //       "value": "%2012%",
        //       "dataType": "NUMBER"
        //     },
        //     {
        //       "relation": "and",
        //       "sets": [
        //         {
        //           "columnName": "COLUMN1",
        //           "operator": "like",
        //           "value": "%333%",
        //           "dataType": "TEXT"
        //         },
        //         {
        //           "columnName": "COLUMN2",
        //           "operator": "like",
        //           "value": "%333%",
        //           "dataType": "TEXT",
        //           "relation": "and"
        //         }
        //       ]
        //     },
        //     {
        //       "columnName": "COLUMN3",
        //       "operator": "like",
        //       "value": "%333%",
        //       "dataType": "TEXT",
        //       "relation": "and"
        //     }
        //   ]
        // }
      ],
      // jsonData:{
      //   id:"01",
      //   relation:"and",
      //   children:[{
      //     id:"02",
      //     relation:"or",
      //     children:[{
      //       id:"05",
      //       condition:{
      //         "columnName": "COLUMN0",
      //         "columnChName":"报告期",
      //         "operator": "like",
      //         "value": "2012",
      //         "dataType": "TEXT"
      //       }
      //     },{
      //       id:"06",
      //       condition:{
      //         "columnName": "COLUMN0",
      //         "columnChName":"报告期",
      //         "operator": "like",
      //         "value": "2012",
      //         "dataType": "TEXT"
      //       }
      //     }]
      //   },{
      //     id:"03",
      //     condition:{
      //       "columnName": "COLUMN0",
      //         "columnChName":"报告期",
      //         "operator": "like",
      //         "value": "2012",
      //         "dataType": "TEXT"
      //     }
      //   },{
      //     id:"04",
      //     condition:{
      //       "columnName": "COLUMN0",
      //         "columnChName":"报告期",
      //         "operator": "like",
      //         "value": "2012",
      //         "dataType": "TEXT"
      //     }
      //   }]
      // }
    };
  },
  computed: {
    addButtonShow() {
      if (this.jsonData.length === 0) return true;
      else return false;
    },
  },
  watch: {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  methods: {
    /**
     * @description 添加条件
     */
    addCondition() {
      let sets = [];
      sets.push({
        columnName: "",
        operator: "",
        value: "",
        dataType: "",
        id: new Date().getTime(),
      });
      this.jsonData.push({
        sets: sets,
      });
    },
    /**
     * @description 添加组合
     */
    addGroup() {
      let parentJson = this.selectLine.parentJson;
      // console.log('parentJson',parentJson)
      let data = this.selectLine.data;
      let index = this.selectLine.index;
      //isSelectBefore用来解决组合中添加组合的一个bug，在添加组合的函数之前一定要调用lineSelect函数更新this.selectLine中的值  否则就可以在组合中添加组合产生bug
      //这个参数保证addGroup函数调用间隙一定要调用lineSelect函数   否则return
      if (
        (parentJson !== undefined && parentJson.length === 1) ||
        !this.isSelectBefore
      ) {
        Message({
          type: "warning",
          message: "不能在组合中添加组合!",
        });
        return;
      }
      if (data != undefined && index != undefined) {
        let obj = JSON.parse(JSON.stringify(data[index]));
        data[index] = {};
        let sets = {};
        sets.relation =
          obj.relation ||
          (data.length > index + 1 ? data[index + 1].relation : "");
        sets.sets = [];
        delete obj.relation;
        sets.sets.push(obj);
        // data[index]=sets;
        this.$set(data, index, sets);
        // this.selectLine={};
      }
      this.isSelectBefore = false;
    },
    /**
     * @description 条件的选中事件
     */
    lineSelect(parentJson, data, index) {
      console.log(parentJson, data, index);
      this.selectLine.parentJson = parentJson;
      this.selectLine.data = data;
      this.selectLine.index = index;
      this.isSelectBefore = true;
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  .el-button {
    margin-bottom: 19px;
  }
  .el-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-header {
      background-color: #f0f2fa;
      color: #333;
      padding: 0;
      border-bottom: 1px solid #ccc;
      height: auto !important;
    }

    .el-aside {
      background-color: #f0f2fa;
      color: #333;
      position: relative;
      border-right: 1px solid #ccc;
    }

    .el-main {
      /*  background-image: url("./images/bg.png"); */
      background-repeat: repeat;
      color: #333;
      background-color: #fff;
      padding: 0;
      position: relative;
    }
  }
}
.addButton {
  position: absolute;
  left: 50%;
  top: 50%;
  margin: -80px 0 0 -80px;
  // width: 80px;
  // height: 80px;
  // background-color:#c6c6c6
}
</style>
