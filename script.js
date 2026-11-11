const STORAGE_KEY = "pomodoro-minutes";
const DEFAULT_MINUTES = 25;

const display = document.querySelector(".timer-display");
const startBtn = document.querySelector(".btn-start");
const stopBtn = document.querySelector(".btn-stop");
const resetBtn = document.querySelector(".btn-reset");
const settingsBtn = document.querySelector(".btn-settings");

// 저장된 설정 시간(분)을 초 단위로 읽어옴. 없거나 잘못된 값이면 기본값 사용
function loadFocusSeconds() {
  let minutes = DEFAULT_MINUTES;
  try {
    const saved = Number(localStorage.getItem(STORAGE_KEY));
    if (Number.isInteger(saved) && saved >= 1 && saved <= 60) {
      minutes = saved;
    }
  } catch (e) {
    // localStorage를 쓸 수 없는 환경이면 기본값 유지
  }
  return minutes * 60;
}

let focusSeconds = loadFocusSeconds();
let remaining = focusSeconds; // 남은 시간(초)
let endTime = null; // 타이머가 끝나는 시각(ms)
let intervalId = null;

function render() {
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  display.textContent = `${minutes}:${seconds}`;
  document.title = `${minutes}:${seconds} - Pomodoro`;
}

function tick() {
  remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
  render();

  if (remaining === 0) {
    stopTimer();
  }
}

function startTimer() {
  if (intervalId !== null || remaining === 0) return; // 이미 실행 중이거나 끝난 상태

  endTime = Date.now() + remaining * 1000;
  intervalId = setInterval(tick, 250);
}

function stopTimer() {
  if (intervalId === null) return;

  clearInterval(intervalId);
  intervalId = null;
}

function resetTimer() {
  stopTimer();
  remaining = focusSeconds;
  render();
}

// 설정 시간이 바뀌었으면 새 시간으로 타이머를 맞춤
function applySettings() {
  const next = loadFocusSeconds();
  if (next === focusSeconds) return;

  focusSeconds = next;
  resetTimer();
}

startBtn.onclick = startTimer;
stopBtn.onclick = stopTimer;
resetBtn.onclick = resetTimer;
settingsBtn.onclick = () => {
  location.href = "settings.html";
};

// 뒤로가기로 캐시된 페이지가 복원될 때 / 다른 탭에서 설정을 바꿨을 때 반영
window.onpageshow = applySettings;
window.onstorage = (event) => {
  if (event.key === STORAGE_KEY) applySettings();
};

render();

// 현재 시각 표시
const clock = document.querySelector(".clock");

function renderClock() {
  const now = new Date();
  clock.textContent = now.toLocaleString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  clock.dateTime = now.toISOString();
}

renderClock();
setInterval(renderClock, 1000);
