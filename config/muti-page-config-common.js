//配置页面
var productPages = {
  index: {
    entry: "src/main.js",
    template: "public/index.html",
    filename: "index.html",
    title: "首页",
  },
  SampleQuery: {
    entry: "src/pages/SampleQuery/index.js",
    template: "public/index.html",
    filename: "sampleQuery.html",
    title: "样本库信息查询",
  },
  SamplingQuery: {
    entry: "src/pages/SamplingQuery/index.js",
    template: "public/index.html",
    filename: "samplingQuery.html",
    title: "抽样库库信息查询",
  },
  DirectoryComparison: {
    entry: "src/pages/DirectoryComparison/index.js",
    template: "public/index.html",
    filename: "directoryComparison.html",
    title: "名录信息比对任务管理",
  },
  NewEnterpriseQuery: {
    entry: "src/pages/NewEnterpriseQuery/index.js",
    template: "public/index.html",
    filename: "newEnterpriseQuery.html",
    title: "新增注册企业信息查询",
  },
  baseUnitMsgQuery: {
    entry: "src/pages/BaseUnitMsgQuery/index.js",
    template: "public/index.html",
    filename: "baseUnitMsgQuery.html",
    title: "基本单位名录信息查询",
  },
  phoneVerification: {
    entry: "src/pages/PhoneVerification/index.js",
    template: "public/index.html",
    filename: "phoneVerification.html",
    title: "电话核查情况信息查询",
  },
  personVerification: {
    entry: "src/pages/PersonVerification/index.js",
    template: "public/index.html",
    filename: "personVerification.html",
    title: "待人工核查清单查询",
  },
  sceneVerification: {
    entry: "src/pages/SceneVerification/index.js",
    template: "public/index.html",
    filename: "sceneVerification.html",
    title: "现场核查结果信息查询",
  },
  shanghaiAntv: {
    entry: "src/pages/ShanghaiAntv/index.js",
    template: "public/index.html",
    filename: "shanghaiAntv.html",
    title: "上海地图",
  },
  ExpeditingProgress: {
    entry: "src/pages/ExpeditingProgress/index.js",
    template: "public/index.html",
    filename: "expeditingProgress.html",
    title: "催报进度管理",
  },
  ReportStatusView: {
    entry: "src/pages/ReportStatusView/index.js",
    template: "public/index.html",
    filename: "reportStatusView.html",
    title: "报表情况查看",
  },
  MessageNotification: {
    entry: "src/pages/MessageNotification/index.js",
    template: "public/index.html",
    filename: "messageNotification.html",
    title: "消息通知管理",
  },
  UrgeRulesManage: {
    entry: "src/pages/UrgeRulesManage/index.js",
    template: "public/index.html",
    filename: "urgeRulesManage.html",
    title: "催报规则管理",
  },
  ScriptManagement: {
    entry: "src/pages/ScriptManagement/index.js",
    template: "public/index.html",
    filename: "scriptManagement.html",
    title: "话术管理",
  },
  ChannelConfiguration: {
    entry: "src/pages/ChannelConfiguration/index.js",
    template: "public/index.html",
    filename: "channelConfiguration.html",
    title: "通道配置管理",
  },
  WechatChannelMenage: {
    entry: "src/pages/WechatChannelMenage/index.js",
    template: "public/index.html",
    filename: "wechatChannelMenage.html",
    title: "通道配置管理",
  },
};

//打包
var pages = Object.assign({}, productPages);

module.exports = pages;
