const processorArt = () => `
  <div class="device-art cpu-art">
    <div class="cpu-lid"><i></i><i></i><i></i><i></i></div>
  </div>`;

const memoryArt = () => `
  <div class="device-art ram-art"><i></i><i></i><i></i><i></i></div>`;

const storageArt = () => `
  <div class="device-art ssd-art"><i></i><i></i><b></b></div>`;

function value(key, initial) {
  return `<span data-value="${key}" data-default="${initial}">${initial}</span>`;
}

function connection(part, label = "", packet = "") {
  return `
    <div class="connection" data-part="${part}">
      <span class="connection-label">${label}</span>
      <span class="connection-line"><i class="packet${packet ? " packet-text" : ""}">${packet}</i></span>
    </div>`;
}

function hardwareCard(type, title, role, art, content) {
  return `
    <div class="hardware-card ${type}-card" data-part="${type}">
      <div class="art-slot">${art}</div>
      <div class="hardware-label"><strong>${title}</strong><span>${role}</span></div>
      <div class="hardware-content">${content}</div>
    </div>`;
}

function hardwareFlow(mode) {
  const storage = mode === "cycle"
    ? `<div class="mini-source"><code>const a = 10;<br>const b = 20;<br>const c = a + b;</code></div>`
    : `<span class="device-tag"><span class="tag-light"></span>${value("source", "app.js")}</span>`;
  let memory = `<span class="device-tag"><span class="tag-light"></span>${value("memory", "코드 · 데이터")}</span>`;
  let cpu = `<span class="device-tag"><span class="tag-light"></span>${value("processor", "명령 처리")}</span>`;

  if (mode === "cycle") {
    memory = `
      <div class="instruction-list">
        <span class="instruction-pointer">${value("pointer", "현재 명령")}</span>
        <code>${value("instruction", "ADD R3, R1, R2")}</code>
      </div>`;
    cpu = `
      <div class="decode-line" data-part="operation"><span>명령</span><code>${value("operation", "—")}</code></div>
      <div class="register-row">
        <span><small>R1</small><b>10</b></span>
        <span><small>R2</small><b>20</b></span>
        <span data-part="result"><small>R3</small><b>${value("result", "—")}</b></span>
      </div>`;
  } else if (mode === "memory") {
    memory = `<div class="memory-segments"><span>코드</span><span>데이터</span><span>스택</span><span>힙</span></div>`;
  }

  return `
    <div class="hardware-flow ${mode === "cycle" ? "hardware-cycle" : ""}">
      ${hardwareCard("ssd", "SSD", "저장장치", storageArt(), storage)}
      ${connection("load", "불러오기")}
      ${hardwareCard("ram", "RAM", "작업 공간", memoryArt(), memory)}
      ${connection("fetch", "명령 읽기", mode === "cycle" ? "ADD" : "")}
      ${hardwareCard("cpu", "CPU", "명령 실행", processorArt(), cpu)}
    </div>`;
}

const fieldIcon = () => `<span class="field-icon"><i></i></span>`;

function threadScene() {
  return `
    <div class="threads-scene">
      <div class="app-node" data-part="app">${fieldIcon()}<strong>앱</strong></div>
      <span class="plain-arrow">→</span>
      <div class="process-node" data-part="process">
        <strong>프로세스</strong>
        <span class="thread-pill" data-part="thread-js"><i></i> JS 스레드</span>
        <span class="thread-pill" data-part="thread-ui"><i></i> UI 스레드</span>
      </div>
      ${connection("route", "CPU 배정")}
      <div class="core-node" data-part="cpu">${processorArt()}<strong>CPU 코어</strong></div>
    </div>`;
}

function launchScene() {
  return `
    <div class="launch-scene">
      <div class="phone">
        <span class="phone-camera"></span>
        <div class="phone-home" data-part="tap">${fieldIcon()}<span>Football</span></div>
        <div class="phone-loading"><span class="phone-loader"></span></div>
        <div class="phone-app">
          <strong>Football</strong>
          <div class="pitch"><span></span><i></i></div>
          <span class="phone-app-title">경기 일정</span>
        </div>
        <span class="phone-home-bar"></span>
      </div>
      <ol class="launch-steps">
        <li data-part="tap"><i></i><strong>앱 실행 요청</strong><span>운영체제가 요청을 받음</span></li>
        <li data-part="process"><i></i><strong>프로세스 준비</strong><span>메모리와 실행 환경 준비</span></li>
        <li data-part="runtime"><i></i><strong>앱 코드 실행</strong><span>런타임과 스레드가 동작</span></li>
        <li data-part="screen"><i></i><strong>첫 화면 표시</strong><span>화면에 첫 프레임을 그림</span></li>
      </ol>
    </div>`;
}

function coresScene() {
  return `
    <div class="cores-scene">
      <div class="core-chip">
        <span class="core-chip-title">4코어 CPU</span>
        <div class="core-grid">
          ${[1, 2, 3, 4].map((id) => `
            <div class="core-unit" data-part="core-${id}">
              <span class="core-unit-name"><i></i>코어 ${id}</span>${value(`core${id}`, "대기")}
            </div>`).join("")}
        </div>
      </div>
    </div>`;
}

function registersScene() {
  return `
    <div class="registers-scene">
      <div class="register-panel source-panel" data-part="inputs">
        <strong>RAM</strong>
        <div class="register-row input-pair"><span><small>a</small><b>10</b></span><span><small>b</small><b>20</b></span></div>
      </div>
      ${connection("route", "LOAD")}
      <div class="register-panel cpu-panel" data-part="registers">
        <strong>CPU 레지스터</strong>
        <div class="register-row">
          <span><small>R1</small><b>${value("lhs", "—")}</b></span>
          <span><small>R2</small><b>${value("rhs", "—")}</b></span>
          <span data-part="result"><small>R3</small><b>${value("result", "—")}</b></span>
        </div>
        <code class="register-operation" data-part="result">10 + 20 = 30</code>
      </div>
    </div>`;
}

function cacheScene() {
  return `
    <div class="cache-scene">
      <div class="cache-end cpu-end" data-part="cpu">${processorArt()}<strong>CPU</strong></div>
      ${connection("lookup", "확인")}
      <div class="cache-bank" data-part="cache">
        <strong>캐시</strong>
        <div class="cache-levels"><span data-part="l1">L1</span><span>L2</span><span>L3</span></div>
        <span class="cache-status">${value("cacheStatus", "확인 중")}</span>
      </div>
      ${connection("load", "메모리 접근")}
      <div class="cache-end ram-end" data-part="ram">${memoryArt()}<strong>RAM</strong></div>
    </div>`;
}

function framesScene() {
  return `
    <div class="timeline-scene">
      <div class="timeline-heading"><strong>JS 스레드</strong><span>${value("frameStatus", "제시간에 갱신")}</span></div>
      <div class="frame-chart">
        <div class="frame-axis"><span>0 ms</span><span>16.7 ms</span><span>33.3 ms</span></div>
        <div class="frame-track">
          <div class="frame-deadline"><span>다음 프레임 마감</span></div>
          <div class="frame-work" data-part="work">화면 갱신 작업</div>
          <i class="frame-point first-frame" data-part="frame-one"></i>
          <i class="frame-point second-frame" data-part="frame-two"></i>
        </div>
      </div>
    </div>`;
}

function loopScene() {
  return `
    <div class="loop-scene">
      <div class="loop-panel">
        <div class="timeline-heading"><strong>JS 스레드</strong><span>${value("loopStatus", "계산 시작")}</span></div>
        <div class="loop-track">
          <div class="loop-task compute-task" data-part="compute"><code>calculate()</code></div>
          <div class="loop-task callback-task" data-part="callback">응답 콜백 실행</div>
        </div>
      </div>
      <div class="loop-queue" data-part="queue">
        <strong>다음에 처리할 작업</strong>
        <span class="queue-item" data-part="release"><i></i>${value("queueStatus", "응답 콜백 준비")}</span>
      </div>
    </div>`;
}

const diagrams = {
  flow: () => hardwareFlow("flow"),
  cycle: () => hardwareFlow("cycle"),
  memory: () => hardwareFlow("memory"),
  threads: threadScene,
  launch: launchScene,
  cores: coresScene,
  registers: registersScene,
  cache: cacheScene,
  frames: framesScene,
  loop: loopScene,
};

export function renderVisual(kind) {
  return diagrams[kind]();
}

export function setVisualStage(scene, stage, animate) {
  scene.dataset.phase = stage.id;
  scene.classList.toggle("scene-animate", animate);
  for (const item of scene.querySelectorAll("[data-part]")) {
    item.classList.toggle("is-active", stage.active.includes(item.dataset.part));
  }
  for (const item of scene.querySelectorAll("[data-value]")) {
    item.textContent = stage.values[item.dataset.value] ?? item.dataset.default;
  }
}
