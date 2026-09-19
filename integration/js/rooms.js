/* 自习室查询：数据写死在 JS 数组中，按楼层／开放状态即时筛选（复用课堂五筛选模式） */

// 示例数据
var ROOMS = [
  { name: '图书馆一层自习室', floor: 1, seats: 180, free: 42, status: 'open', hours: '07:00 - 22:30' },
  { name: '图书馆二层自习室', floor: 2, seats: 160, free: 18, status: 'open', hours: '07:00 - 22:30' },
  { name: '主教学楼 301', floor: 3, seats: 80, free: 0, status: 'closing', hours: '07:30 - 21:00' },
  { name: '主教学楼 305', floor: 3, seats: 72, free: 25, status: 'open', hours: '07:30 - 21:00' },
  { name: '主教学楼 402', floor: 4, seats: 90, free: 12, status: 'open', hours: '07:30 - 21:00' },
  { name: '理科楼二层自习区', floor: 2, seats: 110, free: 33, status: 'maintenance', hours: '暂停开放' },
  { name: '文科楼三层自习区', floor: 3, seats: 64, free: 0, status: 'closed', hours: '08:00 - 20:00' },
  { name: '宿舍楼一层自习室', floor: 1, seats: 50, free: 9, status: 'open', hours: '06:30 - 23:30' }
];

// 状态 -> 展示文案与徽章样式
var STATUS_MAP = {
  open: { text: '开放中', badge: 'text-bg-success' },
  closing: { text: '即将关闭', badge: 'text-bg-warning' },
  closed: { text: '已闭馆', badge: 'text-bg-secondary' },
  maintenance: { text: '维护中', badge: 'text-bg-danger' }
};

var floorFilter = document.getElementById('floorFilter');
var statusFilter = document.getElementById('statusFilter');
var resetBtn = document.getElementById('resetFilter');
var roomList = document.getElementById('roomList');
var resultCount = document.getElementById('resultCount');

// 转义，避免把数据当 HTML 解析
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, function (ch) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
  });
}

// 单间自习室卡片
function roomCardHtml(room) {
  var status = STATUS_MAP[room.status];
  var usedPercent = room.seats === 0 ? 0 : Math.round((room.seats - room.free) / room.seats * 100);
  var freeText = room.status === 'open' || room.status === 'closing'
    ? '剩余座位 <strong>' + room.free + '</strong> / ' + room.seats
    : '座位 ' + room.seats + '（当前不可用）';

  return '' +
    '<div class="col-12 col-md-6 col-xl-4">' +
      '<div class="card room-card h-100">' +
        '<div class="card-body">' +
          '<div class="d-flex justify-content-between align-items-start mb-2">' +
            '<h3 class="h6 mb-0">' + escapeHtml(room.name) + '</h3>' +
            '<span class="badge ' + status.badge + '">' + status.text + '</span>' +
          '</div>' +
          '<p class="text-muted small mb-2">楼层：' + room.floor + ' 层　开放时间：' + escapeHtml(room.hours) + '</p>' +
          '<p class="small mb-2">' + freeText + '</p>' +
          '<div class="progress" role="progressbar" aria-valuenow="' + usedPercent + '" aria-valuemin="0" aria-valuemax="100">' +
            '<div class="progress-bar" style="width: ' + usedPercent + '%"></div>' +
          '</div>' +
          '<p class="text-muted small mt-2 mb-0">入座率 ' + usedPercent + '%</p>' +
        '</div>' +
      '</div>' +
    '</div>';
}

// 根据当前筛选条件渲染
function renderRooms() {
  var floor = floorFilter.value;
  var status = statusFilter.value;

  var filtered = ROOMS.filter(function (room) {
    var floorOk = floor === 'all' || String(room.floor) === floor;
    var statusOk = status === 'all' || room.status === status;
    return floorOk && statusOk;
  });

  resultCount.textContent = '共 ' + filtered.length + ' 间';

  if (filtered.length === 0) {
    roomList.innerHTML = '<div class="col-12"><div class="alert alert-light text-muted text-center py-4">' +
      '没有符合条件的自习室，请调整筛选条件。</div></div>';
    return;
  }

  roomList.innerHTML = filtered.map(roomCardHtml).join('');
}

// 筛选条件变化即时生效
floorFilter.addEventListener('change', renderRooms);
statusFilter.addEventListener('change', renderRooms);

resetBtn.addEventListener('click', function () {
  floorFilter.value = 'all';
  statusFilter.value = 'all';
  renderRooms();
});

// 首次渲染
renderRooms();
