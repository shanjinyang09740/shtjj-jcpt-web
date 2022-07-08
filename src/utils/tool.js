import Vue from "vue";
import http from "@/utils/http";

// TODO. 找个真的deepClone去
export const fakeDeepClone = (source) => {
    return JSON.parse(JSON.stringify(source));
};

const _fakeLoopAssign = (target, source) => {
    for (var key in source) {
        if (key == "subOfVariables") {
            Vue.set(target, "subOfVariables", source["subOfVariables"]);
        } else if (key == "requestConfig") {
            Vue.set(target, "requestConfig", source["requestConfig"]);
        } else if (typeof source[key] == "object") {
            // TODO. 如果有空可以细化Object的内容
            if (
                Array.isArray(source[key]) ||
                !Object.hasOwnProperty.call(target, key)
            ) {
                target[key] = fakeDeepClone(source[key]);
            } else {
                _fakeLoopAssign(target[key], source[key]);
            }
        } else {
            target[key] = source[key];
        }
    }
};

// TODO. 找个真的Object.assign去
export const fakeAssign = (...args) => {
    let target = args.splice(0, 1)[0];
    let sources = args;
    sources.forEach((source) => {
        _fakeLoopAssign(target, source);
    });
    return target;
};

export function debounce(func, wait) {
    let timeout;
    return function() {
        let context = this;
        let args = arguments;

        if (timeout) clearTimeout(timeout);

        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

export function throttle(func, wait) {
    let timeout;
    return function() {
        let context = this;
        let args = arguments;
        if (!timeout) {
            timeout = setTimeout(() => {
                timeout = null;
                func.apply(context, args);
            }, wait);
        }
    };
}

export function saveFile(filename, filecontent) {
    let URL = window.URL || window.webkitURL;

    // `a.click()` doesn't work for all browsers (#465)
    function click(node) {
        try {
            node.dispatchEvent(
                new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                })
            );
        } catch (e) {
            var evt = document.createEvent("MouseEvents");
            evt.initMouseEvent(
                "click",
                true,
                true,
                window,
                0,
                0,
                0,
                80,
                20,
                false,
                false,
                false,
                false,
                0,
                null
            );
            node.dispatchEvent(evt);
        }
    }

    function saveAs(blob, filename) {
        let type = blob.type;
        let force_saveable_type = "application/octet-stream";
        if (type && type != force_saveable_type) {
            // 强制下载，而非在浏览器中打开
            let slice = blob.slice || blob.webkitSlice || blob.mozSlice;
            blob = slice.call(blob, 0, blob.size, force_saveable_type);
        }

        let url = URL.createObjectURL(blob);

        // https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#Valid Namespace URIs
        // 此处不要修改http协议为https, namespace URI仅支持4种固定写法
        let save_link = document.createElementNS(
            "http://www.w3.org/1999/xhtml",
            "a"
        );
        save_link.href = url;
        save_link.download = filename;
        save_link.rel = "noopener"; // tabnabbing
        click(save_link);
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1e4); // 10s
    }

    function rightSave(filename, filecontent) {
        let blob = new Blob([filecontent], { type: "text/plain" });

        saveAs(blob, filename);
    }
    rightSave(filename, filecontent);
}

/**
 * @description 公共方法：把扁平化的树变成立体树的结构---该方法慎用，有bug
 * @param {Object<data>} data 传入目标数据
 * @param {Object<option>} option 传入的依据key值
 * @returns {Tree}
 */
export function FlatToNested(data, option) {
    option = option || {};
    let idProperty = option.idProperty || "id";
    let parentProperty = option.parentProperty || "pId";
    let childrenProperty = option.childrenProperty || "children";
    let res = [],
        tmpMap = [];
    for (let i = 0; i < data.length; i++) {
        tmpMap[data[i][idProperty]] = data[i];
        if (
            tmpMap[data[i][parentProperty]] &&
            data[i][idProperty] != data[i][parentProperty]
        ) {
            if (!tmpMap[data[i][parentProperty]][childrenProperty])
                tmpMap[data[i][parentProperty]][childrenProperty] = [];
            tmpMap[data[i][parentProperty]][childrenProperty].push(data[i]);
        } else {
            res.push(data[i]);
        }
    }
    return res;
}

/**
 * @description 转换成树形数据
 * parames: [Array] sNodes 传入的对象
 *
 */
export const transformTozTreeFormat = (sNodes) => {
    //将普通的数组转换为父子结构
    let i, l;
    let r = [];
    let tmpMap = {};
    const nodeChildren = (node, newChildren) => {
        if (typeof newChildren !== "undefined") {
            node.children = newChildren;
        }
        return node.children;
    };
    for (i = 0, l = sNodes.length; i < l; i++) {
        tmpMap[sNodes[i].id] = sNodes[i];
    }
    for (i = 0, l = sNodes.length; i < l; i++) {
        let p = tmpMap[sNodes[i].pId];
        if (p && sNodes[i].id != sNodes[i].pId) {
            let children = nodeChildren(p);
            if (!children) {
                children = nodeChildren(p, []);
            }
            children.push(sNodes[i]);
        } else {
            r.push(sNodes[i]);
        }
    }
    return r;
};

/**
 * @description 公共方法：把立体树转换成扁平化的结构
 * @param {Array<tree>} tree 传入目标数据
 * @returns {Array} newArr
 */
export function treeToArray(tree, newArr = []) {
    tree.forEach((item) => {
        const { children } = item;
        if (children) {
            delete item.children;

            if (children.length) {
                newArr.push(item);
                return treeToArray(children, newArr);
            }
        }
        newArr.push(item);
    });
    return newArr;
}

/**
 * @description 获取url参数
 * @param {String} name
 */
export function getUrl(name) {
    var reg = new RegExp("[^?&]?" + encodeURI(name) + "=[^&]+");
    var arr = window.location.href.match(reg);
    if (arr != null) {
        return decodeURI(arr[0].substring(arr[0].search("=") + 1));
    }
    return "";
}

/**
 * @description 根据对象中的某个属性进行排序---默认升序
 * @param {String} prop 排序字段
 * @param {Array} arr 排序数组
 * @param {String} type 排序类型
 * @returns {Array}
 */
export const arraySortByProp = (prop, arr, type = "up") => {
    const sortBy = (property) => {
        return function(value1, value2) {
            let a = value1[property];
            let b = value2[property];
            return type == "up" ?
                a > b ?
                1 :
                a < b ?
                -1 :
                0 :
                a < b ?
                1 :
                a > b ?
                -1 :
                0;
        };
    };
    return arr.sort(sortBy(prop));
};

//index1是要替换元素的索引，index2是要被替换元素的索引，index1和index2互换位置
export function swapArr(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}

/**
 * @description 请求代码表
 * @param {String} dicId
 * @returns {Object}
 */
export function postDicData(dicId) {
    return http.post(`/api/core/v1/dictionary/queryData.do?dicId=${dicId}`);
}

/**
 * @description 合并json中保存的数据和请求回来的数据
 *
 * jsonData,保存的json数据
 * newData, 请求回来新的表格数据
 * writableProps 用户填写的表格的列名，这些列需要以jsonData里的为准
 * keysMapping jsonData和newData数据key值的对应关系 newKey:jsonKey
 * identifyKey 映射对照的key值，默认是columnEnName
 * isAddNewData 是否需要将newData中不同的字段拼上返回
 * 中途不能改变上面两个数据
 *
 * 返回最终的数据
 */
export const mergeConflictedData = (
    jsonData,
    newData,
    writableProps,
    keysMapping,
    identifyKey = "columnEnName",
    isAddNewData = true
) => {
    //startUsing是否启用这个字段也是以jsonData中数据为准
    writableProps.push("startUsing");
    let resultData = [];
    let newCopyData = JSON.parse(JSON.stringify(newData));

    //替换keysMapping里所有的不同的key值
    transformMappingKeys(newCopyData, keysMapping);
    // console.log("newCopyData", newCopyData);
    for (let i = 0; i < jsonData.length; i++) {
        //newData中对应数据的位置
        let newIndex = -1;
        newCopyData.forEach((item, index) => {
            if (item[identifyKey] === jsonData[i][identifyKey]) {
                newIndex = index;
            }
        });
        if (newIndex === -1) {
            //没找到对应数据
            let rowData = JSON.parse(JSON.stringify(jsonData[i]));
            resultData.push(rowData);
            //本行数据报错
            rowData.isError = true;
        } else {
            //找到对应数据,删除在newCopyData找到的数据，并push到新数组里
            let rowData = newCopyData.splice(newIndex, 1);
            rowData = rowData.length > 0 ? rowData[0] : {};

            //替换本条数据用户手填的值
            writableProps.forEach((item) => {
                if (jsonData[i][item] !== undefined) {
                    //rowData(也就是newData)yh里如果必填的值不为空 就用rowData的值
                    //在json里key值为‘’，并且rowData里key值不为‘’，用新数据的值，其余情况用jsonData
                    //FIXME:上面的逻辑不知用于何处？以及逻辑会影响一般的数据冲突处理
                    //表输出的逻辑
                    if (!(jsonData[i][item] === "" && rowData[item] !== "")) {
                        rowData[item] = jsonData[i][item];
                    }
                }
            });
            resultData.push(rowData);
        }
    }

    //1.jsonData数据里都有wriwtableProps里的值
    //2.接口返回的newData里面可能没有页面展示的所有key值
    //剩余数据没有wriwtableProps里的key值 就赋为空值

    newCopyData.forEach((item) => {
        // //替换keysMapping里所有的不同的key值
        // Object.keys(keysMapping).forEach((every) => {
        //   let jsonKey = keysMapping[every];
        //   if (item[jsonKey] === undefined) {
        //     item[jsonKey] = item[every];
        //     delete item[every]; //删除接口返回的key
        //   }
        // });
        writableProps.forEach((every) => {
            if (item[every] === undefined) {
                item[every] = "";
            }
        });
    });
    //这个时候newCopyData应该只剩下jsonData中没有的数据，直接concat到resultData里就行
    if (isAddNewData) {
        resultData = resultData.concat([...newCopyData]);
    }
    return resultData;
};

/**
 * @description 依据keysMapping映射关系,修改表格数据data 的映射key值，删除旧key值
 * 这个方法会直接改变传进来的data数据
 */
export const transformMappingKeys = function(data, keysMapping) {
    Object.keys(keysMapping).forEach((item) => {
        let jsonKey = keysMapping[item];
        for (let i = 0; i < data.length; i++) {
            let rowData = data[i];
            if (rowData[jsonKey] === undefined) {
                rowData[jsonKey] = rowData[item];
                delete rowData[item]; //删除接口返回的key
            }
        }
    });
};

/**
 * @description  获取地址栏参数并判断参数中是否有非法字符
 * @param {String} temp_str
 */
export function judgeUrlParamIsRule(temp_str) {
    temp_str = trimTxt(temp_str);
    temp_str = temp_str.replace("*", "@");
    temp_str = temp_str.replace("--", "@");
    temp_str = temp_str.replace("/", "@");
    temp_str = temp_str.replace("+", "@");
    temp_str = temp_str.replace("'", "@");
    temp_str = temp_str.replace("\\", "@");
    temp_str = temp_str.replace("$", "@");
    temp_str = temp_str.replace("^", "@");
    temp_str = temp_str.replace(".", "@");
    temp_str = temp_str.replace(";", "@");
    temp_str = temp_str.replace("<", "@");
    temp_str = temp_str.replace(">", "@");
    temp_str = temp_str.replace('"', "@");
    temp_str = temp_str.replace("=", "@");
    temp_str = temp_str.replace("{", "@");
    temp_str = temp_str.replace("}", "@");

    let forbid_str = new String("@,%,~,&");
    let forbid_array = new Array();
    forbid_array = forbid_str.split(",");

    for (let i = 0; i < forbid_array.length; i++) {
        if (temp_str.search(new RegExp(forbid_array[i])) != -1) return false;
    }

    return true;
}

/**
 * @description  去除字符串首位的空格
 * @param {String} txt
 */
function trimTxt(str) {
    if (str === null) {
        return str;
    }
    return str.replace(/(^\s*)|(\s*$)/g, "");
}