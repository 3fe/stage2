/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
 var aqiData = {};

function trim(str) {
	return str.replace(/(^\s*)|(\s*$)/g, '');
}
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
 function addAqiData() {
 	var city = document.getElementById("aqi-city-input").value;
 	var value = document.getElementById("aqi-value-input").value;

 	city = trim(city);
 	value = trim(value);

 	if(!city.match(/^[A-Za-z\u4E00-\u9FA5]+$/)){
        alert("城市名必须为中英文字符！")
        return;
    }
    if(!value.match(/^\d+$/)) {
        alert("空气质量指数必须为整数！")
        return;
    }

 	aqiData[city] = value;
 }

/**
 * 渲染aqi-table表格
 */
 function renderAqiList() {
 	var table = document.getElementById("aqi-table");
 	table.innerHTML = "";
 	for (var city in aqiData) {
 		table.innerHTML += "<tr><td>"+ city + "</td><td>"+ aqiData[city] +"</td><td><button>删除</button></td></tr>";
 	}
 }

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
 function addBtnHandle() {
 	addAqiData();
 	renderAqiList();
 }

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
 function delBtnHandle() {
    // do sth.
    document.getElementById("aqi-table").onclick = function(e) {
    	if (e.target && e.target.nodeName.toUpperCase() == "BUTTON") {

    		var row = e.target.parentNode.parentNode;
    		var city = row.firstChild.innerText;
    		delete aqiData[city];
    	}
    }

    renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  window.onload = function () {
  	document.getElementById("add-btn").onclick = addBtnHandle;
  	document.onclick = delBtnHandle;
  }

}

init();
