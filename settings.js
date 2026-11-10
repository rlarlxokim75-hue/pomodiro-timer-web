const STORAGE_KEY = "pomodoro-minutes";
const DEFAULT_MINUTES = 25;
const MIN_MINUTES = 1;
const MAX_MINUTES = 60;

const input = document.querySelector(".input-minutes");
const saveBtn = document.querySelector(".btn-save");

function isValid(value) {
  if (value.trim() === "") return false;
  const minutes = Number(value);
  return Number.isInteger(minutes) && minutes >= MIN_MINUTES && minutes <= MAX_MINUTES;
}

// 입력값이 비었거나 범위를 벗어나면 저장 버튼 비활성화
function updateSaveButton() {
  saveBtn.disabled = !isValid(input.value);
}

function loadMinutes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null && isValid(saved)) return Number(saved);
  } catch (e) {
    // localStorage를 쓸 수 없는 환경이면 기본값 사용
  }
  return DEFAULT_MINUTES;
}

function saveMinutes() {
  if (!isValid(input.value)) return;

  try {
    localStorage.setItem(STORAGE_KEY, String(Number(input.value)));
  } catch (e) {
    alert("설정을 저장할 수 없습니다.");
    return;
  }
  location.href = "index.html";
}

input.value = loadMinutes();
input.oninput = updateSaveButton;
saveBtn.onclick = saveMinutes;

updateSaveButton();
