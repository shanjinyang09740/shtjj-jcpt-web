/**
 * @description 加载iframe，并判断iframe加载完成时机
 * @param {Object} refName 嵌入的iframe的ref值
 * @param {Object} vm 当前vue实例对象
 * @param {Function} callBack
 */
export const loadIframeDom = (refName, vm, callBack) => {
  let myIframe = vm.$refs[refName]["contentWindow"];
  if (myIframe.attachEvent) {
    myIframe.attachEvent("onload", function() {
      console.log("Local iframe is now loaded.");
      callBack(myIframe);
    });
  } else {
    myIframe.onload = function() {
      console.log("Local iframe is now loaded.");
      callBack(myIframe);
    };
  }
};
