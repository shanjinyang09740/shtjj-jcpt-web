<template>
  <div>
    <fu-menu
      background-color="#21304D"
      active-text-color="#ffd04b"
      text-color="#fff"
      style="width: 100%"
      :unique-opened="true"
      :default-active="defaultActiveMenue"
      :default-openeds="['1']"
      @select="select"
    >
      <aside-child :menuList="menuList"></aside-child>
    </fu-menu>
  </div>
</template>

<script>
import AsideChild from "./AsideChild";
import { Menu } from "fusion-ui";

export default {
  components: {
    FuMenu: Menu,
    AsideChild,
  },
  data() {
    return {
      //默认激活高亮菜单
      defaultActiveMenue: "/baseUnitMsgQuery.html",
      //侧边栏菜单
      menuList: [
        {
          id: "1",
          text: "信息查询",
          children: [
            {
              id: "1-1",
              text: "基本单位名录信息查询",
              src: "/baseUnitMsgQuery.html",
            },
            {
              id: "1-2",
              text: "样本库信息查询",
              src: "/sampleQuery.html",
            },
            {
              id: "1-3",
              text: "抽样库信息查询",
              src: "/samplingQuery.html",
            },
          ],
        },
        {
          id: "2",
          text: "纳库管理",
          children: [
            {
              id: "2-1",
              text: "名录信息比对任务管理",
              src: "/directoryComparison.html",
            },
            {
              id: "2-2",
              text: "新增注册企业信息查询",
              src: "/newEnterpriseQuery.html",
            },
            {
              id: "2-3",
              text: "电话核查情况信息查询",
              src: "/phoneVerification.html",
            },
            {
              id: "2-4",
              text: "待人工核查清单查询",
              src: "/personVerification.html",
            },
            {
              id: "2-5",
              text: "现场核查结果信息查询",
              src: "/sceneVerification.html",
            },
          ],
        },
        {
          id: "3",
          text: "上海地图",
          src: "/shanghaiAntv.html",
        },
        {
          id: "4",
          text: "催报管理",
          children: [
            {
              id: "4-1",
              text: "进度管理",
              children: [
                {
                  id: "4-1-1",
                  text: "催报进度管理",
                  src: "/expeditingProgress.html",
                },
              ],
            },
            {
              id: "4-2",
              text: "信息查看",
              children: [
                {
                  id: "4-2-1",
                  text: "报表情况查看",
                  src: "/reportStatusView.html",
                },
                {
                  id: "4-2-2",
                  text: "消息通知管理",
                  src: "/messageNotification.html",
                },
              ],
            },
            {
              id: "4-3",
              text: "规则配置",
              children: [
                {
                  id: "4-3-1",
                  text: "催报规则管理",
                  src: "/urgeRulesManage.html",
                },
              ],
            },
            {
              id: "4-4",
              text: "配置管理",
              children: [
                {
                  id: "4-4-1",
                  text: "话术管理",
                  src: "/scriptManagement.html",
                },
                {
                  id: "4-4-2",
                  text: "通道配置管理",
                  src: "/channelConfiguration.html",
                },
                {
                  id: "4-4-3",
                  text: "微信通道管理",
                  src: "/wechatChannelMenage.html",
                },
              ],
            },
          ],
        },
      ],
    };
  },
  mounted() {
    //初始化菜单
    this.initMenuActive();
  },
  methods: {
    /**
     * @description 初始化菜单
     */
    initMenuActive() {
      //默认显示第一个父节点下第一个子节点
      this.menuList.some((item, index) => {
        if (index == 0) {
          let src = item.children ? item.children[0]["src"] : item["src"];
          this.defaultActiveMenue = item.children
            ? item.children[0]["id"]
            : item["id"];
          this.$emit("changeMenue", src);
          return true;
        }
      });
    },
    /**
     * @description 菜单切换事件
     * @param {String} $index
     */
    select($index) {
      this.findMenu($index, this.menuList, (data) => {
        this.$emit("changeMenue", data);
      });
    },
    /**
     * @description 递归获取当前菜单路径
     * @param {String} $index 当前菜单的索引id
     * @returns {Array} arr 菜单列
     */
    findMenu($index, arr, callback) {
      if (!arr.length) return;
      arr.some((item) => {
        let $src = item.src;
        if (item.children) {
          this.findMenu($index, item.children, callback);
        } else {
          if (item.id === $index && $src) {
            callback($src);
            return true;
          }
        }
      });
    },
  },
};
</script>
