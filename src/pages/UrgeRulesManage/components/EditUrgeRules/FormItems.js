export const FormItems = [{
        label: "基本信息",
        name: "baseMessageForm",
        labelWidth: "140px",
        isShow: true,
        data: [{
                label: "催报规则名称",
                prop: "ruleName",
                type: "textarea",
                placeholder: "",
                size: "mini",
            },
            {
                label: "催报规则描述",
                prop: "ruleDesc",
                type: "textarea",
                placeholder: "",
                size: "mini",
            },
            {
                label: "催报规则",
                prop: "rule",
                type: "urgeRulesComp",
                placeholder: "",
                size: "mini",
                option: {
                    value1Option: [],
                    value2Option: [{
                            text: "之前",
                            value: "0",
                        },
                        {
                            text: "之后",
                            value: "1",
                        },
                    ],
                },
            },
            {
                label: "催报方式",
                prop: "urgingMethod",
                type: "select",
                size: "mini",
                placeholder: "",
                option: [],
            },
            {
                label: "催报规则状态",
                prop: "ruleState",
                type: "switch",
                size: "mini",
            },
            {
                label: "催报话术",
                prop: "wordsId",
                type: "select",
                size: "mini",
                placeholder: "",
                option: [],
            },
        ],
        rules: {
            ruleName: {
                required: true,
                message: "请输入催报规则名称",
                trigger: "blur",
            },
            rule: {
                required: true,
                message: "请选择催报规则",
                trigger: "change",
            },
            urgingMethod: {
                required: true,
                message: "请选择催报方式",
                trigger: "change",
            },
            ruleState: {
                required: true,
                message: "请选择催报规则状态",
                trigger: "change",
            },
        },
    },
    {
        label: "报表范围设置",
        name: "reportRangeForm",
        labelWidth: "140px",
        isShow: false,
        data: [{
                label: "调查项目",
                prop: "surveyItemId",
                type: "select",
                size: "mini",
                placeholder: "",
                option: [],
            },
            {
                label: "报表",
                prop: "reportIds",
                type: "mult-tree",
                size: "mini",
                placeholder: "",
                option: [],
            },
        ],
        rules: {},
    },
    {
        label: "企业白名单",
        name: "companyWhiteNameForm",
        labelWidth: "150px",
        isShow: false,
        data: [{
            label: "企业白名单",
            prop: "whiteCreditCodes",
            type: "textarea",
            size: "mini",
            placeholder: "",
        }, ],
        rules: {},
    },
];