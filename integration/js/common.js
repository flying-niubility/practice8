/* 全站公共脚本：断网提示（在线/离线状态监听） */

(function () {
  var alertBox = document.createElement('div');
  alertBox.id = 'offlineAlert';
  alertBox.setAttribute('role', 'alert');
  alertBox.innerHTML =
    '<div class="container py-2 small">' +
    '网络已断开：页面框架仍可查看，但 CDN 上的 Bootstrap / ECharts / Three.js 以及 data.json 可能加载失败，请联网后刷新页面。' +
    '</div>';

  // 插到 body 最顶部
  document.body.insertBefore(alertBox, document.body.firstChild);

  function syncStatus() {
    alertBox.classList.toggle('show', !navigator.onLine);
  }

  window.addEventListener('online', syncStatus);
  window.addEventListener('offline', syncStatus);
  syncStatus();
})();
