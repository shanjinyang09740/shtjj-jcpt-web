import { postJSON } from "@/utils/post";
import { REQ } from "./requestUrl";
import { post } from "@/utils/http";

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
/**
 * @description 查询样本库报告期
 * @param {} code 行政区划code
 */
export const querySampleBgq = (code) => {
  return post(
    `/api/nkgl/v1/sampleLibrary/getBGQList.do?administrativeDivision=${code}`,
    {
      postData: JSON.stringify({
        data: [],
      }),
    }
  );
};
/**
 * @description 查询抽样库报告期
 * @param {} code 行政区划code
 */
export const querySamplingBgq = (code) => {
  return post(
    `/api/nkgl/v1/samplingLibrary/getBGQList.do?administrativeDivision=${code}`,
    {
      postData: JSON.stringify({
        data: [],
      }),
    }
  );
};

/**
 * @description 查询导出列表字段
 * @param {} pageName 页面简称
 */
export const queryExportParams = (pageName) => {
  return post(`/api/nkgl/v1/excelHeadQuery/queryList.do?lable=${pageName}`, {
    postData: JSON.stringify({
      data: [],
    }),
  });
};
/**
 * @description 查询导出列表字段中文名/查询分组指标对应关系
 */
export const queryExportParamsCh = () => {
  return post(`/api/nkgl/v1/zb/queryList.do`, {
    postData: JSON.stringify({
      data: [],
    }),
  });
};
