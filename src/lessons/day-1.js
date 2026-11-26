function stage(id, label, caption, active, values = {}) {
  return { id, label, caption, active, values };
}

const groups = [
  {
    title: "실행의 큰 그림",
    slides: [
      {
        id: "program-start",
        name: "프로그램의 실행",
        title: "프로그램은 어디에서 실행될까?",
        description: "RAM은 실행 중인 코드와 데이터를 담는 작업 공간입니다. CPU는 명령을 가져와 실행합니다.",
        visual: "flow",
        figureTitle: "프로그램의 실행 흐름",
        stages: [
          stage("stored", "저장된 코드", "내 코드는 SSD에 파일로 저장됩니다. 여기서는 app.js를 실행한다고 생각해 보세요.", ["ssd"]),
          stage("instruction", "실행 가능한 명령", "JavaScript는 Node.js 같은 실행 환경이 처리합니다. CPU에서 실행되는 단위는 기계 명령입니다.", ["ssd"], { source: "app.js + Node.js" }),
          stage("loaded", "메모리에 들어오기", "실행에 필요한 명령과 데이터가 RAM에 놓입니다. 실행 중에 필요한 부분을 더 가져올 수도 있습니다.", ["ssd", "load", "ram"], { memory: "코드 · 데이터" }),
          stage("executing", "명령 실행", "CPU는 명령을 가져와 한 단계씩 처리합니다. 명령과 데이터는 CPU 내부 캐시를 거칠 수 있습니다.", ["ram", "fetch", "cpu"], { memory: "코드 · 데이터", processor: "명령 실행 중" }),
        ],
      },
      {
        id: "instruction-cycle",
        name: "명령 실행의 세 단계",
        title: "CPU는 명령을 어떻게 실행할까?",
        description: "CPU는 명령을 가져오고, 해석하고, 실행합니다. 두 값을 더하는 명령으로 이 세 단계를 따라가 봅시다.",
        visual: "cycle",
        figureTitle: "Fetch → Decode → Execute",
        note: "덧셈 원리를 보여주는 모형입니다. JavaScript 엔진에서 실제로 어떤 명령이 실행되는지는 Day 2에서 다룹니다.",
        stages: [
          stage("ready", "덧셈 준비", "RAM에는 ADD 명령이 있고, CPU의 레지스터 R1과 R2에는 이미 10과 20이 들어 있습니다.", ["ram"]),
          stage("fetch", "Fetch · 명령 가져오기", "CPU가 다음에 실행할 ADD 명령을 가져옵니다. 이 그림에서는 명령이 RAM에 있다고 가정합니다.", ["ram", "fetch", "cpu"], { operation: "ADD" }),
          stage("decode", "Decode · 명령 해석하기", "CPU가 ADD를 해석해 R1과 R2를 더하고, 결과를 R3에 써야 한다는 것을 확인합니다.", ["cpu", "operation"], { operation: "ADD" }),
          stage("execute", "Execute · 명령 실행하기", "10과 20을 더해 R3에 30을 저장합니다. CPU는 다음 명령으로 넘어가 같은 흐름을 반복합니다.", ["cpu", "result"], { operation: "ADD", result: "30", pointer: "다음 명령", instruction: "STORE R3, result" }),
        ],
      },
      {
        id: "ssd-and-ram",
        name: "SSD와 RAM",
        title: "SSD에 파일이 있는데 왜 RAM이 필요할까?",
        description: "SSD는 파일을 오래 보관합니다. 프로그램은 실행 중에 RAM에서 코드와 데이터를 빠르게 읽습니다.",
        visual: "memory",
        figureTitle: "저장된 파일에서 실행 중인 메모리로",
        stages: [
          stage("stored", "파일이 저장된 상태", "프로그램, 사진, 문서처럼 전원을 꺼도 남아야 하는 파일은 SSD에 저장합니다.", ["ssd"]),
          stage("loaded", "필요한 부분을 RAM으로", "OS는 프로그램 실행에 필요한 메모리를 준비합니다. 파일의 필요한 부분은 실행 중인 메모리로 들어옵니다.", ["ssd", "load", "ram"]),
          stage("executing", "실행 중의 작업 공간", "코드와 데이터가 메모리에 놓이고 CPU가 그 내용을 사용합니다. 스택과 힙도 프로그램이 메모리를 사용하는 방식입니다.", ["ram", "fetch", "cpu"], { processor: "명령과 데이터 사용" }),
        ],
      },
      {
        id: "process-and-thread",
        name: "프로세스와 스레드",
        title: "CPU에서 실제로 무엇이 실행될까?",
        description: "실행 중인 프로그램을 프로세스라고 합니다. 프로세스 안에는 하나 이상의 스레드가 있고, 운영체제는 스레드에 CPU 시간을 배정합니다.",
        visual: "threads",
        figureTitle: "앱 → 프로세스 → 스레드 → CPU",
        stages: [
          stage("application", "앱 실행", "앱을 실행하면 OS가 앱에 필요한 실행 환경을 준비합니다.", ["app"]),
          stage("process", "프로세스 안의 스레드", "프로세스는 메모리와 같은 자원을 담습니다. 그 안의 스레드는 각각 실행할 명령의 흐름을 갖습니다.", ["process", "thread-js", "thread-ui"]),
          stage("scheduled", "스레드에 CPU 배정", "OS가 실행할 스레드를 선택합니다. CPU는 배정받은 스레드의 기계 명령을 실행합니다.", ["thread-js", "route", "cpu"]),
        ],
      },
      {
        id: "app-launch",
        name: "앱의 첫 화면",
        title: "앱을 누르면 첫 화면까지 무슨 일이 일어날까?",
        description: "아직 실행 중이 아닌 React Native 축구 앱을 열어 봅시다. 아이콘을 누른 순간부터 첫 화면이 나올 때까지 여러 구성 요소가 함께 일합니다.",
        visual: "launch",
        figureTitle: "축구 앱을 처음 열 때",
        stages: [
          stage("tap", "앱 아이콘 터치", "앱 아이콘을 누르면 휴대폰의 운영체제가 앱 실행 요청을 받습니다.", ["tap"]),
          stage("process", "OS가 프로세스 준비", "운영체제가 앱을 위한 프로세스와 메모리를 준비하고 앱 코드가 실행될 수 있게 합니다.", ["process"]),
          stage("runtime", "런타임과 스레드가 실행", "React Native 런타임과 앱 코드가 시작됩니다. CPU는 OS가 배정한 스레드의 명령을 실행합니다.", ["runtime"]),
          stage("screen", "첫 화면 표시", "앱이 화면에 필요한 작업을 마치면 사용자가 보는 첫 화면이 표시됩니다.", ["screen"]),
        ],
      },
    ],
  },
  {
    title: "CPU의 구성",
    slides: [
      {
        id: "cores",
        name: "코어",
        title: "코어가 많으면 무엇이 달라질까?",
        description: "코어는 CPU 안에서 명령을 실행하는 단위입니다. 운영체제가 여러 스레드를 서로 다른 코어에 배정하면 함께 실행할 수 있습니다.",
        visual: "cores",
        figureTitle: "스레드가 코어에 배정되는 모습",
        stages: [
          stage("single", "스레드 한 개 실행", "JS 스레드 하나가 코어 하나에 배정됩니다. 다른 코어가 있어도 그 스레드의 코드가 코어마다 나뉘는 것은 아닙니다.", ["core-1"], { core1: "JS 스레드" }),
          stage("parallel", "여러 스레드 실행", "실행할 다른 스레드가 있으면 운영체제가 다른 코어에도 배정할 수 있습니다. 이 예에서는 UI 스레드와 작업 스레드가 함께 실행됩니다.", ["core-1", "core-2", "core-3"], { core1: "JS 스레드", core2: "UI 스레드", core3: "작업 스레드" }),
        ],
      },
      {
        id: "registers",
        name: "레지스터",
        title: "CPU는 계산할 값을 어디에 둘까?",
        description: "레지스터는 CPU 안의 아주 작은 저장 공간입니다. CPU는 계산에 사용할 값과 계산 결과를 레지스터에 담을 수 있습니다.",
        visual: "registers",
        figureTitle: "10과 20을 더할 때의 레지스터",
        stages: [
          stage("memory", "값이 메모리에 있음", "이 예에서는 더할 두 값 10과 20이 RAM에 있습니다.", ["inputs"]),
          stage("loaded", "값을 레지스터로 가져오기", "LOAD 명령으로 10과 20을 각각 R1과 R2에 가져옵니다.", ["inputs", "route", "registers"], { lhs: "10", rhs: "20" }),
          stage("sum", "결과를 레지스터에 두기", "ADD 명령은 R1과 R2를 더하고, 30을 R3에 둡니다.", ["registers", "result"], { lhs: "10", rhs: "20", result: "30" }),
        ],
      },
      {
        id: "cache",
        name: "캐시",
        title: "캐시는 CPU를 어떻게 도울까?",
        description: "캐시는 CPU 가까이에 있는 빠른 저장 공간입니다. 필요한 내용이 캐시에 있으면 RAM까지 접근하는 시간을 줄일 수 있습니다.",
        visual: "cache",
        figureTitle: "캐시에 있는 데이터와 없는 데이터",
        stages: [
          stage("lookup", "캐시 확인", "CPU는 명령이나 데이터를 가져올 때 가까운 캐시를 먼저 확인합니다.", ["cpu", "lookup", "cache"]),
          stage("hit", "캐시에 있는 경우", "필요한 내용이 캐시에 있으면 그 자리에서 가져옵니다. 이를 캐시 적중이라고 합니다.", ["cpu", "lookup", "cache", "l1"], { cacheStatus: "데이터 있음" }),
          stage("miss", "캐시에 없는 경우", "필요한 내용이 어떤 캐시에도 없으면 RAM에서 가져와야 합니다. 계속 사용할 수 있도록 캐시에도 담을 수 있습니다.", ["cpu", "lookup", "cache", "load", "ram"], { cacheStatus: "데이터 없음" }),
        ],
      },
    ],
  },
  {
    title: "실무와 복습",
    slides: [
      {
        id: "dropped-frames",
        name: "React Native와 프레임",
        title: "앱의 애니메이션은 왜 끊길까?",
        description: "화면이 부드럽게 움직이려면 프레임이 제시간에 준비되어야 합니다. JS 스레드의 작업이 길어지면 그 스레드에 의존하는 화면 갱신이 늦을 수 있습니다.",
        visual: "frames",
        figureTitle: "JS 작업과 다음 프레임 마감",
        stages: [
          stage("on-time", "마감 전에 작업 완료", "60Hz 화면의 다음 갱신까지 약 16.7ms가 있습니다. 이 예에서는 JS 작업이 그 전에 끝납니다.", ["work", "frame-one"], { frameStatus: "제시간에 갱신" }),
          stage("late", "마감 넘어감", "JS 작업이 마감선을 넘어갑니다. 이 작업의 결과가 필요한 화면은 이번 프레임에 갱신되기 어렵습니다.", ["work", "frame-two"], { frameStatus: "갱신 지연" }),
        ],
      },
      {
        id: "node-event-loop",
        name: "Node.js와 이벤트 루프",
        title: "Node.js는 왜 응답을 늦게 보낼까?",
        description: "Node.js에서 오래 걸리는 동기 계산이 JS 스레드를 차지하면, 같은 스레드에서 처리할 요청과 콜백은 기다립니다.",
        visual: "loop",
        figureTitle: "한 스레드에서 차례를 기다리는 작업",
        stages: [
          stage("arrival", "작업이 들어옴", "요청을 처리하는 코드가 CPU 계산을 시작합니다. 계산을 실행하는 동안 응답 콜백도 준비될 수 있습니다.", ["compute"], { loopStatus: "계산 시작" }),
          stage("blocked", "동기 계산이 길어짐", "JS 스레드가 아직 계산을 실행하고 있습니다. 준비된 응답 콜백은 계산이 끝날 때까지 기다립니다.", ["compute", "queue"], { loopStatus: "계산 중", queueStatus: "응답 콜백 대기" }),
          stage("released", "다음 작업 처리", "계산이 끝나고 제어가 이벤트 루프로 돌아오면, 기다리던 콜백을 실행할 수 있습니다.", ["release", "callback"], { loopStatus: "응답 콜백 실행", queueStatus: "콜백이 실행으로 이동" }),
        ],
      },
      {
        id: "recap",
        name: "오늘의 요약",
        title: "오늘 기억할 네 가지",
        description: "첫 화면의 그림을 다시 보면서 CPU와 메모리의 역할을 정리해 봅시다.",
        visual: "flow",
        figureTitle: "저장 → 메모리 → 실행",
        stages: [
          stage("overview", "", "", ["ssd", "load", "ram", "fetch", "cpu"], { memory: "코드 · 데이터", processor: "명령 실행" }),
        ],
        points: [
          "CPU는 명령을 가져오고, 해석하고, 실행합니다.",
          "RAM은 실행 중인 코드와 데이터를 보관하는 작업 공간입니다.",
          "SSD에 저장된 내용은 실행에 필요한 만큼 메모리에 들어옵니다.",
          "CPU가 실행하는 단위는 기계 명령입니다.",
        ],
      },
      {
        id: "check-understanding",
        name: "확인 문제",
        title: "그림 없이도 설명할 수 있을까?",
        description: "답을 먼저 머릿속으로 생각해 보세요. 질문을 누르면 정답과 짧은 설명이 펼쳐집니다.",
        questions: [
          {
            prompt: "CPU가 SSD의 JavaScript 파일을 그대로 직접 실행할까요?",
            answer: "아니요. Node.js가 JavaScript 파일을 읽고 처리합니다. CPU는 그 과정에 필요한 기계 명령을 실행합니다.",
            diagram: "JavaScript 파일 → Node.js → CPU에서 기계 명령 실행",
          },
          {
            prompt: "RAM과 CPU의 역할을 한 문장씩 설명한다면?",
            answer: "RAM은 실행 중인 코드와 데이터를 담는 작업 공간입니다. CPU는 명령을 읽고 실제로 실행합니다.",
            diagram: "RAM · 보관       CPU · 실행",
          },
          {
            prompt: "SSD, RAM, CPU 레지스터 중 가장 빠른 저장 공간은 무엇일까요?",
            answer: "CPU 레지스터입니다. CPU 내부에서 연산에 필요한 값을 바로 사용할 수 있는 작은 저장 공간입니다.",
            diagram: "빠른 쪽   레지스터 → RAM → SSD",
          },
          {
            prompt: "React Native 앱이 버벅일 때 CPU가 관련될 수 있는 이유는 무엇일까요?",
            answer: "화면 갱신에 필요한 작업을 스레드가 제시간에 마치지 못하면 새 프레임이 늦게 나올 수 있기 때문입니다.",
            diagram: "긴 작업 → 프레임 마감 통과 → 갱신 지연",
          },
          {
            prompt: "애플리케이션 → 프로세스 → _____ → CPU. 빈칸에 무엇이 들어갈까요?",
            answer: "스레드입니다. 운영체제가 스레드에 CPU 시간을 배정하면 CPU는 그 스레드의 명령을 실행합니다.",
            diagram: "애플리케이션 → 프로세스 → 스레드 → CPU",
          },
        ],
      },
    ],
  },
];

export default { day: 1, heading: "CPU와 RAM", groups };
