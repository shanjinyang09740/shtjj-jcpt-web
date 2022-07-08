# 高级筛选组件的详细说明
### props

    conditionOptions: {
      default: [
        {
            codeListId: "",
            codeType: "",
            fieldLabel: "报告期_代码",
            fieldName: "JCZC_BGQ_DM",
            fieldType: "TEXT",
        },
        {
            codeListId: "",
            codeType: "",
            fieldLabel: "出口总额增速",
            fieldName: "JCZC_CK_ZEZS",
            fieldType: "NUMBER",
        },
      ],
    },

### 连接符
    1. 连接符value==='is not null' || value=='is null' 时，
        没有第三个input框，值为‘’;
### value 
    受制于数据的类型，如果是code类型，需要对第三个input 做特殊处理；
        等于  第三个input是单选下拉框
        在...中  第三个input 是多选下拉框
        其他 第三个input是 input输入框 ，但是后端想要input 对应的value；
### 关于其他细节 
 1. 比如number类型需要校验数据必须为number类型
 2. 每个input项都是必填项
 3. type类型一旦变换，就需要对于连接符以及value值进行清空处理
 4. 





