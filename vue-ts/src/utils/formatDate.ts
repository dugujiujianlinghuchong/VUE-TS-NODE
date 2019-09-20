export default function formatDate(date: string) {
  let dateObj = new Date(date);
  var o = {
    "Y+": dateObj.getFullYear(),
    "M+": dateObj.getMonth() + 1,                 //月份 
    "d+": dateObj.getDate(),                    //日 
    "h+": dateObj.getHours(),                   //小时 
    "m+": dateObj.getMinutes(),                 //分 
    "s+": dateObj.getSeconds(),                 //秒 
    "q+": Math.floor((dateObj.getMonth() + 3) / 3), //季度 
    "S": dateObj.getMilliseconds()             //毫秒 
  }

  console.log(o);
}


// Date.prototype.format = function(fmt) { 
//   var o = { 
//      "M+" : this.getMonth()+1,                 //月份 
//      "d+" : this.getDate(),                    //日 
//      "h+" : this.getHours(),                   //小时 
//      "m+" : this.getMinutes(),                 //分 
//      "s+" : this.getSeconds(),                 //秒 
//      "q+" : Math.floor((this.getMonth()+3)/3), //季度 
//      "S"  : this.getMilliseconds()             //毫秒 
//  }; 
//  if(/(y+)/.test(fmt)) {
//          fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
//  }
//   for(var k in o) {
//      if(new RegExp("("+ k +")").test(fmt)){
//           fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
//       }
//   }
//  return fmt; 
// }  