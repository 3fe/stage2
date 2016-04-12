/* 数据格式演示
var aqiSourceData = {
"北京": {
"2016-01-01": 10,
"2016-01-02": 10,
"2016-01-03": 10,
"2016-01-04": 10
}
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: -1,
    nowGraTime: "day"
}

function randomColor() {
    colors = [];
    var size = 50
    for (var i = 0; i < size; i++) {
        colors.push( '#' + ('00000' + Math.ceil(Math.random() * 0xffffff).toString(16)).slice(-6) );
    }
    var index = parseInt(Math.random() * size);
    return function() {
        if (index == 50) {
            index = 0;
        }
        return colors[index++];
    }
}
/**
* 渲染图表
*/
function renderChart() {
    var num = Object.getOwnPropertyNames(chartData).length;
    var chart_wrap = document.querySelector('.aqi-chart-wrap');
    var body_width = chart_wrap.clientWidth;
    var width = parseInt(body_width/num);
    chart_wrap.innerHTML = '';

    for (var i in chartData) {
        var aqi = chartData[i].aqi;
        var height = chartData[i].aqi;
        var color = chartData[i].color;
        var title = chartData[i].title;
        var dom = [
            '<div class="item-wrap"',
            ' style=width:',
            width,
            'px;',
            '>',
            '<div class="item"',
            ' title="',
            title,
            '" style=height:',
            height,
            'px;width:',
            width,
            'px;',
            'background-color:',
            color,
            '></div>',
            '</div>'
        ];
        chart_wrap.innerHTML += dom.join('');
    }
}

/**
* 日、周、月的radio事件点击时的处理函数
*/
function graTimeChange() {
    // 确定是否选项发生了变化 
    var radios = document.getElementsByName("gra-time");
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            var nowGraTime = radios[i].value;
        }
    }
    if (nowGraTime == pageState.nowGraTime) {
        return;
    }
    // 设置对应数据
    pageState.nowGraTime = nowGraTime;
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
* select发生变化时的处理函数
*/
function citySelectChange() {
    // 确定是否选项发生了变化 
    var city = document.getElementById("city-select").value;
    if (city == pageState.nowSelectCity) {
        return;
    }
    // 设置对应数据
    pageState.nowSelectCity = city;
    initAqiChartData();
    // 调用图表渲染函数
    renderChart();
}

/**
* 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
*/
function initGraTimeForm() {
    var radios = document.getElementsByName("gra-time");
    for (var i = 0; i < radios.length; i++) {
        radios[i].onchange = graTimeChange;
        if (radios[i].checked) {
            pageState.nowGraTime = radios[i].value;
            radios[i].onclick = graTimeChange;
        }
    }
}

/**
* 初始化城市Select下拉选择框中的选项
*/
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var city_select = document.getElementById("city-select");
    for (var key in aqiSourceData) {
        city_select.innerHTML += "<option value=" + key + " >"+ key + "</option>"; 
    }
    pageState.nowSelectCity = city_select.value;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    city_select.onchange = citySelectChange; 
}

/**
* 初始化图表需要的数据格式
*/
function initAqiChartData() {
// 将原始的源数据处理成图表需要的数据格式
// 处理好的数据存到 chartData 中
chartData = {};
var whichColor = randomColor();
var city = pageState.nowSelectCity;
var time = pageState.nowGraTime;
var item = aqiSourceData[city];
switch (time) {
    case 'day': 
    for (var i in item) {
        chartData[i] = {};
        chartData[i].aqi = item[i];
        chartData[i].color = whichColor();
        chartData[i].title = i+' \n空气质量:'+chartData[i].aqi;
    }
    break;
    case 'week': 
    var week =    1;
    for (var i in item) {
        var date = new Date(i);
        if (!chartData.hasOwnProperty(week)) {
            chartData[week] = {};
            chartData[week].aqi = 0;
            chartData[week].days = 0;
        }
        chartData[week].aqi += item[i];
        chartData[week].days++;
            // 判断是否是周日
            if (date.getDay() == 0) {
                chartData[week].aqi = parseInt(chartData[week].aqi/chartData[week].days);
                delete chartData[week].days;
                chartData[week].color = whichColor();
                chartData[week].title = '第'+week+'周'+' \n空气质量:'+chartData[week].aqi;
                week++;
            }
        }
        if (chartData[week].hasOwnProperty("days")) {
            chartData[week].aqi = parseInt(chartData[week].aqi/chartData[week].days);
            delete chartData[week].days;
            chartData[week].color = whichColor();
            chartData[week].title = '第'+week+'周'+' \n空气质量:'+chartData[week].aqi;
        }
        break;
        case 'month': 
        for (var i in item) {
            var date = new Date(i);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? '0' + m : m;
            date = y + '-' + m;
            if (!chartData.hasOwnProperty(date)) {
                chartData[date] = {};
                chartData[date].aqi = 0;
                chartData[date].days = 0;
            }
            chartData[date].aqi += parseInt(item[i]);
            chartData[date].days++;
        }
        for (var i in chartData) {
            chartData[i].aqi = parseInt(chartData[i].aqi/chartData[i].days);
            delete chartData[i].days;
            chartData[i].color = whichColor();
            chartData[i].title = i+' \n空气质量:'+chartData[i].aqi;
        }
        break;
    }
}

/**
* 初始化函数
*/
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
    renderChart();
}

init();
