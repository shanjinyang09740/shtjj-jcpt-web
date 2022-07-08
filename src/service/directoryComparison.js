import { post } from "@/utils/http.js";
const EDIT_URL = "/api/datacompare/v1/etl/updateOne.do";
const CREATE_URL = "/api/datacompare/v1/etl/insertOne.do";
const COPY_URL = "/api/datacompare/v1/etl/copy.do";
const RUN_URL = "/api/datacompare/v1/etl/execute.do";
const DELETE_URL = "/api/datacompare/v1/etl/deleteOne.do";
const GETPARAMS_URL = "/api/datacompare/v1/etl/queryParams.do";
/**
 * @description 编辑etl
 */
export const doEditEtl = (data) => {
  return post(EDIT_URL, {
    postData: JSON.stringify({
      data: [
        {
          vtype: "formpanel",
          name: "etlForm",
          data: {
            etlId: data.etlId,
            etlName: data.etlName,
            etlLabel: data.etlLabel,
            etlDesc: data.etlDesc,
            etlRunMode: data.etlRunMode,
            etlRunModeConfig: JSON.stringify(data.etlRunModeConfig),
          },
        },
      ],
    }),
  });
};
/**
 * @description 新建etl
 */
export const doCreateEtl = (data) => {
  return post(CREATE_URL, {
    postData: JSON.stringify({
      data: [
        {
          vtype: "formpanel",
          name: "etlForm",
          data: {
            etlName: data.etlName,
            etlLabel: data.etlLabel,
            etlDesc: data.etlDesc,
            etlRunMode: data.etlRunMode,
            etlRunModeConfig: JSON.stringify(data.etlRunModeConfig),
          },
        },
      ],
    }),
  });
};
/**
 * @description 拷贝etl
 */
export const doCopyEtl = (etlId) => {
  return post(COPY_URL, {
    postData: JSON.stringify({
      data: [
        {
          vtype: "attr",
          name: "etlId",
          data: etlId,
        },
      ],
    }),
  });
};
/**
 * @description 运行etl
 */
export const doRunEtl = (etlId, calculateNumber, params) => {
  return post(RUN_URL, {
    postData: JSON.stringify({
      data: [
        {
          vtype: "attr",
          name: "etlId",
          data: etlId,
        },
        {
          vtype: "attr",
          name: "action",
          data: "run",
        },
        {
          vtype: "attr",
          name: "calculateNumber",
          data: Number(calculateNumber),
        },
        {
          vtype: "json",
          name: "params",
          data: JSON.stringify(params),
        },
      ],
    }),
  });
};
/**
 * @description 删除etl
 */
export const doDeleteEtl = (etlId) => {
  return post(DELETE_URL, {
    postData: JSON.stringify({
      data: [
        {
          vtype: "attr",
          name: "etlId",
          data: etlId,
        },
      ],
    }),
  });
};

/**
 * @description 获取etl参数信息
 */
export const getParamsEtl = (etlId) => {
  return post(GETPARAMS_URL, {
    postData: JSON.stringify({
      data: [
        {
          vtype: "attr",
          name: "etlId",
          data: etlId,
        },
      ],
    }),
  });
};

/**
 * @description 代码表
 * @param {} codelistId
 */
export const queryData = (codelistId) => {
  return post(`/api/core/v1/dictionary/queryData.do?dicId=${codelistId}`, {
    postData: JSON.stringify({
      data: [],
    }),
  });
};
