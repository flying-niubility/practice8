/* 使用统计：加载 data.json，用 ECharts 渲染各自习室使用量柱状图（复用课堂六图表代码） */

(function () {
  var chartDom = document.getElementById('usageChart');
  var sourceDom = document.getElementById('chartSource');

  // ECharts 库未加载（如离线导致 CDN 失败）时给出明确提示
  if (typeof echarts === 'undefined') {
    chartDom.innerHTML = '<div class="alert alert-warning m-3">图表库 ECharts 未能加载，请联网后刷新页面。</div>';
    return;
  }

  var chart = echarts.init(chartDom);

  // 窗口尺寸变化时重绘
  window.addEventListener('resize', function () {
    chart.resize();
  });

  fetch('data.json')
    .then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      var names = data.records.map(function (item) { return item.name; });
      var values = data.records.map(function (item) { return item.usage; });

      chart.setOption({
        title: {
          text: data.title,
          left: 'center',
          textStyle: { fontSize: 16 }
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            var p = params[0];
            return p.name + '<br/>使用量：' + p.value + ' ' + data.unit;
          }
        },
        grid: { left: 60, right: 24, top: 60, bottom: 70 },
        xAxis: {
          type: 'category',
          data: names,
          axisLabel: { interval: 0, rotate: names.length > 5 ? 25 : 0 }
        },
        yAxis: {
          type: 'value',
          name: '单位：' + data.unit,
          nameTextStyle: { padding: [0, 0, 0, 30] }
        },
        series: [{
          name: '使用量',
          type: 'bar',
          data: values,
          barMaxWidth: 46,
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#3b82c4' },
                { offset: 1, color: '#1f5fa8' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          label: { show: true, position: 'top', fontSize: 11 }
        }]
      });

      sourceDom.textContent =
        '数据来源：' + data.source + '　统计周期：本周　更新日期：' + data.updated;
    })
    .catch(function (err) {
      chartDom.innerHTML = '<div class="alert alert-danger m-3">' +
        '数据加载失败（' + err.message + '）。请确认通过本地服务器（如 python -m http.server）访问页面。</div>';
    });
})();
