let currentDate = new Date();
let gomiData = {};

async function loadGomi() {
  const res = await fetch("gomi.json");
  gomiData = await res.json();
  renderCalendar();
}

function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  document.getElementById("current-month").textContent =
    `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  let calendarHTML = "";

  // 空白（1日が水曜なら2日分の空白）
  for (let i = 0; i < firstDay; i++) {
    calendarHTML += `<div></div>`;
  }

  for (let day = 1; day <= lastDate; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const gomiType = gomiData[dateKey] || "";

    const gomiClass = gomiType ? `gomi-${gomiType}` : "";

    calendarHTML += `
      <div class="day ${gomiClass}">
        <strong>${day}</strong><br>
        ${gomiType}
      </div>
    `;
  }

  document.getElementById("calendar").innerHTML = calendarHTML;
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

function enableNotification() {
  Notification.requestPermission().then((result) => {
    if (result === "granted") {
      alert("通知がオンになりました！");
      scheduleReminder();
    }
  });
}

function scheduleReminder() {
  setInterval(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    const key = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
    const gomi = gomiData[key];

    if (gomi) {
      new Notification(`明日は「${gomi}」の日です！`);
    }
  }, 60 * 60 * 1000); // 1時間ごとにチェック
}

loadGomi();
