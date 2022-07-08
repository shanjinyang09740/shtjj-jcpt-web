export const FormItems = {
  labelWidth: "125px",
  name: "baseForm",
  data: [
    {
      label: "数据来源",
      prop: "dataSource",
      type: "input",
      disabled: false,
      placeholder: "",
      size: "mini",
    },
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
      label: "身份核实结果",
      prop: "idResult",
      type: "select",
      disabled: false,
      size: "mini",
      placeholder: "",
      option: [
        {
          text: "正确",
          value: "0",
        },
        {
          text: "不正确",
          value: "1",
        },
      ],
    },
    {
      label: "地址核实结果",
      prop: "addressResult",
      type: "select",
      disabled: false,
      size: "mini",
      placeholder: "",
      option: [
        {
          text: "正确",
          value: "0",
        },
        {
          text: "不正确",
          value: "1",
        },
      ],
    },
  ],
  rules: {},
};
