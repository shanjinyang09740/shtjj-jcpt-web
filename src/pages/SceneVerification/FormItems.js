export const FormItems = {
  labelWidth: "125px",
  name: "baseForm",
  data: [
    {
      label: "统一社会信用代码",
      prop: "creditCode",
      type: "input",
      disabled: false,
      size: "mini",
      placeholder: "",
    },
    {
      label: "单位详细名称",
      prop: "companyName",
      type: "input",
      disabled: false,
      placeholder: "",
      size: "mini",
      option: [],
    },
    {
      label: "线下核查状态",
      prop: "sceneStatus",
      type: "select",
      disabled: false,
      placeholder: "",
      size: "mini",
      option: [
        {
          text: "已核查",
          value: "0",
        },
        {
          text: "未核查",
          value: "1",
        },
      ],
    },
    {
      label: "入库状态",
      prop: "warehousingStatus",
      type: "select",
      disabled: false,
      placeholder: "",
      size: "mini",
      option: [
        {
          text: "已入库",
          value: "0",
        },
        {
          text: "未入库",
          value: "1",
        },
      ],
    },
  ],
  rules: {},
};
