/**
 * js时间格式化工具
 *
 * console.log(dateFormat('1980-02-03 22:22:22', 'yyyy年MM月dd日'))
 * console.log(dateFormat('1980-02-03T22:22:22', 'yyyy年MM月dd日'))
 * console.log(dateFormat('1573653506', 'yyyy年MM月dd日'))
 * console.log(dateFormat(1573653506, 'yyyy年MM月dd日'))
 * console.log(dateFormat(new Date(), 'yyyy年MM月dd日'))
 * console.log(getDateDiff('2019-11-14 14:10:50'))
 * console.log(getBeforeDate(-50))
 */

/**
 * 时间格式化
 * @param {*} inputDate  输入时间（string:dateS or string timestamp or number:timestamp）
 * @param {*} formatter  格式化类型，默认yyyy-MM-dd hh:mm:ss
 */
export function dateFormat(inputDate, formatter = "yyyy-MM-dd hh:mm:ss") {
    let date = strToDate(inputDate);
    const o = {
        "M+": date.getMonth() + 1,  // 月
        "d+": date.getDate(),       // 日
        "h+": date.getHours(),      // 时
        "m+": date.getMinutes(),    // 时
        "s+": date.getSeconds(),    // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3),      // 季度
        "S": date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(formatter)) {
        formatter = formatter.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(formatter)) formatter = formatter.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return formatter;
}


/**
 * 字符串转Date类型
 * @param {} dateStr
 */
export function strToDate(dateStr) {
    if (!dateStr) {
        return null;
    }
    let date;
    // 字符串格式
    if (dateStr instanceof Date) {
        date = dateStr;
    } else {
        // 时间戳
        if (!isNaN(dateStr)) {
            // 时间戳
            if (dateStr.toString().length == 10) {
                date = new Date(dateStr * 1000);
            } else if (dateStr.toString().length == 13) {
                date = new Date(dateStr);
            } else {
                return "";
            }
        } else {
            if (dateStr.indexOf(".") > -1) {
                // 有些日期接口返回数据中带有".0"
                dateStr = dateStr.substring(0, dateStr.indexOf("."));
            }
            // 解决localtime T
            dateStr = dateStr.replace("T", " ");
            // 解决ios系统无法格式化问题
            dateStr = dateStr.replace(/-/g, "/");
            date = new Date(dateStr);
        }
    }
    return date;
}
