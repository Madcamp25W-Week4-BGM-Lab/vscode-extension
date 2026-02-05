export const COLORS = {
  bg: "bg-[#09090b]",
  window: "bg-[#0c0c0e]",
  panel: "bg-[#121212]",
  border: "border-[#27272a]",
  text: "text-gray-400",
  s_key: "text-[#7dd3fc]", // Sky blue for keys
  s_str: "text-[#fda4af]", // Rose for strings
  s_num: "text-[#d8b4fe]", // Purple for numbers
};

export const UI_TEXT = {
  en: {
    navbar_title: "SUBTEXT_ANALYZER",
    export_btn: "EXPORT RESULT",
    identity_label: "Identity Calculated",
    core_params: "Core System Parameters",
    source_def: "Source Definition",
    compatibility: "Compatibility Log",
    read_only: "Read Only",
    target_unit: "Target Unit",
    system_online: "SYSTEM ONLINE",
    stat_granularity: "Commit Granularity",
    stat_style: "Communication Style",
    stat_problem: "Problem Solving Approach",
    stat_activity: "Peak Activity Cycle",
    trait_atomic: "Atomic", trait_monolithic: "Monolithic",
    trait_concise: "Concise", trait_descriptive: "Descriptive",
    trait_feature: "Feature", trait_fixer: "Fixer",
    trait_day: "Day", trait_night: "Night"
  },
  ko: {
    navbar_title: "서브텍스트_분석기",
    export_btn: "결과 내보내기",
    identity_label: "정체성 연산 완료",
    core_params: "핵심 시스템 변수",
    source_def: "소스 코드 정의",
    compatibility: "호환성 로그",
    read_only: "읽기 전용",
    target_unit: "대상 유닛",
    system_online: "시스템 온라인",
    stat_granularity: "커밋 세분화 레벨",
    stat_style: "커뮤니케이션 스타일",
    stat_problem: "문제 해결 접근법",
    stat_activity: "최대 활동 주기",
    trait_atomic: "아토믹 (초소형)", trait_monolithic: "모놀리식 (일체형)",
    trait_concise: "간결함", trait_descriptive: "서술적",
    trait_feature: "기능 구현", trait_fixer: "버그 수정",
    trait_day: "주간", trait_night: "야간"
  }
};

export const TRAIT_CONFIG = {
  AM: { left: 'Atomic', right: 'Monolithic', color: 'bg-emerald-500' },
  CD: { left: 'Concise', right: 'Descriptive', color: 'bg-blue-500' },
  FX: { left: 'Feature', right: 'Fixer', color: 'bg-amber-500' },
  DN: { left: 'Day', right: 'Night', color: 'bg-purple-500' }
};

export const PROFILES = {
  ACFN: { 
    type: "ACFN", 
    title: "Night_Surgeon", 
    oneliner: { en: "The Assassin: Silently stacking features at dawn.", ko: "새벽에 말 없이 기능 쌓는 암살자" },
    id: "8f2e-4a1b", 
    description: { en: "You operate in the silence between server ticks, deploying atomic commits with the precision of a scalpel. While the rest of the world sleeps, you are dissecting the codebase, inserting features that appear seamlessly by morning.\n\nYou despise bloat. Your code is stripped of all vanity, optimized for raw speed and execution. You don't write documentation; you write self-evident logic that cuts through complexity like a blade.\n\nIn the digital ecosystem, you are the apex predator of the night cycle. You don't ask for permission to merge; you simply exist, execute, and vanish.", ko: "서버가 틱을 울리는 그 고요한 틈새에서, 당신은 수술용 메스처럼 정교하게 커밋을 배포합니다. 세상이 잠든 사이 당신은 코드베이스를 해부하고, 아침이면 감쪽같이 나타날 기능들을 이식합니다.\n\n당신은 불필요한 비대함을 혐오합니다. 당신의 코드는 허영심이 제거되어 오직 속도와 실행만을 위해 최적화되었습니다. 문서를 쓰는 대신, 복잡함을 단칼에 베어버리는 자명한 로직을 작성합니다.\n\n디지털 생태계에서 당신은 야간 주기의 최상위 포식자입니다. 병합 허가를 구하지 않고, 그저 존재하고, 실행하고, 사라집니다." }, 
    stats: { AM: 85, CD: 70, FX: 80, DN: 90 } 
  },
  ACFD: { 
    type: "ACFD", 
    title: "Day_Mercenary", 
    oneliner: { en: "The Standard: Steadily building features by day.", ko: "낮에 차근차근 기능 쌓는 정석 개발자" },
    id: "7d3c-9x2a", 
    description: { en: "You are a soldier of fortune in the open sunlight. Efficient, professional, and deadly fast. You treat coding like a tactical mission: get in, deploy the feature, get out. No wasted keystrokes, no late-night heroics, just pure business.\n\nYour commits are short bursts of progress delivered during standard operating hours. You don't need the cover of darkness to work your magic; you do it in plain sight, shipping features while others are still pouring their coffee.\n\nYou are the engine of the daily stand-up. While others debate theory, you have already pushed to production.", ko: "당신은 대낮의 전장을 누비는 용병입니다. 효율적이고, 전문적이며, 치명적으로 빠릅니다. 당신에게 코딩은 전술 작전과 같습니다. 진입하고, 기능을 배포하고, 탈출합니다. 낭비되는 키스트로크도, 밤샘의 영웅담도 없이 오직 비즈니스만이 존재합니다.\n\n당신의 커밋은 업무 시간 내에 전달되는 짧은 진보의 파편들입니다. 어둠의 엄호 따윈 필요 없습니다. 남들이 커피를 따르는 동안 당신은 이미 프로덕션에 기능을 배포했습니다.\n\n당신은 데일리 스탠드업의 엔진입니다. 남들이 이론을 토론할 때, 당신은 이미 결과물을 푸시했습니다." }, 
    stats: { AM: 80, CD: 80, FX: 80, DN: 20 } 
  },
  ACXN: { 
    type: "ACXN", 
    title: "System_Drone", 
    oneliner: { en: "The Dark Hero: Hunting bugs at dawn.", ko: "새벽에 버그를 사냥하는 다크 히어로" },
    id: "00x0-1111", 
    description: { en: "You are the ultimate efficiency engine, a high-frequency problem solver programmed for rapid iteration. You do not sleep; you loop. Your commits are a swarm of tiny, precise fixes that overwhelm bugs through sheer volume and speed.\n\nThere is no ego in your code, only function. You prefer concise, standardized syntax that executes without hesitation. You are the antibody of the repository, hunting down errors with relentless, mechanical precision.\n\nYou are the hive mind. The system survives because you do not stop.", ko: "당신은 궁극의 효율성 엔진이며, 빠른 반복을 위해 프로그래밍된 고주파 문제 해결사입니다. 당신은 잠들지 않고 루프를 돕니다. 당신의 커밋은 물량과 속도로 버그를 압도하는 수많은 미세 수정들의 군집입니다.\n\n당신의 코드에 자아(Ego)는 없고, 오직 기능만이 존재합니다. 망설임 없이 실행되는 간결하고 표준화된 문법을 선호합니다. 당신은 무자비한 기계적 정밀함으로 오류를 사냥하는 저장소의 항체입니다.\n\n당신은 하이브 마인드입니다. 당신이 멈추지 않기에 시스템은 생존합니다." }, 
    stats: { AM: 90, CD: 90, FX: 10, DN: 80 } 
  },
  ACXD: { 
    type: "ACXD", 
    title: "Rapid_Response", 
    oneliner: { en: "The Pragmatist: Quietly organizing bugs by day.", ko: "낮에 버그만 조용히 정리하는 실무형" },
    id: "rr44-22zz", 
    description: { en: "You are the repository's EMT. When the build breaks at 2 PM, you are the first responder on the scene. You specialize in triage—applying fast, atomic patches to stop the bleeding instantly.\n\nYou don't have time for philosophy. Your communication is terse, your diffs are minimal, and your uptime is 100%. You clear the ticket queue with a rhythm that keeps the entire team moving forward.\n\nYou are the grease in the gears. Invisible when things work, indispensable when they break.", ko: "당신은 저장소의 응급구조사(EMT)입니다. 오후 2시에 빌드가 깨지면, 가장 먼저 현장에 도착하는 것이 당신입니다. 당신은 중증도 분류(Triage)의 전문가이며, 즉각적으로 출혈을 막기 위해 빠르고 작은 패치를 적용합니다.\n\n당신에게 철학을 논할 시간은 없습니다. 당신의 소통은 간결하고, 변경분은 최소한이며, 가동 시간은 100%입니다. 당신은 팀 전체가 앞으로 나아갈 수 있도록 리듬감 있게 티켓 큐를 비워냅니다.\n\n당신은 기어 사이의 윤활유입니다. 잘 돌아갈 땐 보이지 않지만, 고장 났을 땐 없어서는 안 될 존재입니다." }, 
    stats: { AM: 85, CD: 85, FX: 15, DN: 10 } 
  },
  ADFN: { 
    type: "ADFN", 
    title: "Void_Poet", 
    oneliner: { en: "The Artisan: Designing and documenting at dawn.", ko: "새벽에 설계하고 기록까지 남기는 장인" },
    id: "vp99-00aa", 
    description: { en: "You are a storyteller operating in the void. You build features piece by piece, but unlike the silent Ninja, you leave behind a rich tapestry of documentation and commentary. You believe that code without context is dead on arrival.\n\nYour commits happen in the quiet hours, but they speak volumes. Each atomic change is accompanied by a detailed explanation of the 'Why'. You are building a legacy, ensuring that whoever maintains this code in 10 years will understand your midnight thoughts.\n\nYou write code for machines, but comments for humans.", ko: "당신은 공허 속에서 활동하는 이야기꾼입니다. 당신은 기능을 조각조각 빌드하지만, 침묵하는 닌자와 달리 풍부한 문서와 주석의 태피스트리를 남깁니다. 맥락 없는 코드는 죽은 코드라고 믿기 때문입니다.\n\n당신의 커밋은 조용한 시간에 이루어지지만, 많은 것을 말해줍니다. 각각의 작은 변화에는 '왜'에 대한 상세한 설명이 동반됩니다. 10년 뒤 이 코드를 유지보수할 누군가가 당신의 한밤중의 고뇌를 이해할 수 있도록, 당신은 유산을 남기고 있습니다.\n\n당신은 기계를 위해 코드를 짜지만, 인간을 위해 주석을 씁니다." }, 
    stats: { AM: 80, CD: 20, FX: 80, DN: 85 } 
  },
  ADFD: { 
    type: "ADFD", 
    title: "Open_Source_Paladin", 
    oneliner: { en: "The Steady: Building features with full explanations.", ko: "설명 달면서 기능 쌓는 착실한 타입" },
    id: "os-pal-77", 
    description: { en: "You are the model open-source contributor. You work in the daylight, transparently and verbosely. Your PR descriptions are works of art, complete with screenshots, reasoning, and edge-case analysis.\n\nYou build features with a focus on community and collaboration. You break problems down into digestible atomic chunks so that others can review and learn. You are the teacher everyone wants on their team.\n\nYour code is an open book, inviting everyone to read.", ko: "당신은 모범적인 오픈 소스 기여자입니다. 대낮에 투명하고 상세하게 작업합니다. 당신의 PR 설명은 스크린샷, 논리적 근거, 예외 케이스 분석이 포함된 예술 작품입니다.\n\n당신은 커뮤니티와 협업에 중점을 두고 기능을 만듭니다. 다른 사람들이 검토하고 배울 수 있도록 문제를 소화 가능한 작은 덩어리로 쪼갭니다. 당신은 누구나 팀에 모시고 싶어 하는 선생님입니다.\n\n당신의 코드는 모두가 읽을 수 있도록 펼쳐진 책입니다." }, 
    stats: { AM: 75, CD: 25, FX: 75, DN: 15 } 
  },
  ADXN: { 
    type: "ADXN", 
    title: "Forensic_Analyst", 
    oneliner: { en: "The Maniac: Reading logs and debugging at dawn.", ko: "새벽에 로그 읽는 디버깅 광인" },
    id: "csi-00-xx", 
    description: { en: "You treat bugs like crime scenes. You don't just fix the error; you write a case file about how it happened. Working late into the night, you trace the execution path, documenting the failure state before applying a surgical fix.\n\nYour git logs are a database of knowledge. 'Fixed null pointer' is not enough for you; you explain the race condition that caused it. You are the guardian of historical truth in the repository.\n\nYou solve the mystery so it never happens again.", ko: "당신은 버그를 범죄 현장처럼 다룹니다. 단순히 오류를 고치는 데 그치지 않고, 왜 그런 일이 일어났는지 사건 파일을 작성합니다. 늦은 밤까지 실행 경로를 추적하고, 외과적 수정을 가하기 전에 실패 상태를 기록합니다.\n\n당신의 Git 로그는 지식의 데이터베이스입니다. '널 포인터 수정'으로는 충분하지 않습니다. 당신은 그것을 유발한 경쟁 상태(Race Condition)까지 설명해야 직성이 풀립니다. 당신은 저장소의 역사적 진실을 수호하는 자입니다.\n\n다시는 같은 일이 벌어지지 않도록, 당신은 미스터리를 해결합니다." }, 
    stats: { AM: 80, CD: 30, FX: 20, DN: 90 } 
  },
  ADXD: { 
    type: "ADXD", 
    title: "Compliance_Officer", 
    oneliner: { en: "The QA: Analyzing root causes by day.", ko: "낮에 버그 원인까지 분석하는 QA형" },
    id: "audit-99", 
    description: { en: "You ensure the system follows the rules. You spend your days auditing code, fixing linting errors, and improving test coverage. Every small fix you make is documented with references to the style guide or ticket number.\n\nYou are the bureaucrat of the codebase, in the best possible way. You bring order to chaos through thousands of tiny, well-labeled adjustments. Without you, technical debt would swallow the project whole.\n\nConsistency is your weapon, and clarity is your shield.", ko: "당신은 시스템이 규칙을 따르도록 감시합니다. 하루 종일 코드를 감사하고, 린트(Lint) 오류를 수정하며, 테스트 커버리지를 높입니다. 당신이 만드는 모든 작은 수정은 스타일 가이드나 티켓 번호와 함께 문서화됩니다.\n\n당신은 코드베이스의 관료입니다(물론 좋은 의미에서요). 당신은 수천 개의 꼬리표가 달린 작은 조정들을 통해 혼돈에 질서를 부여합니다. 당신이 없다면 기술 부채가 프로젝트를 집어삼킬 것입니다.\n\n일관성은 당신의 무기이며, 명확성은 당신의 방패입니다." }, 
    stats: { AM: 85, CD: 35, FX: 10, DN: 20 } 
  },
  MCFN: { 
    type: "MCFN", 
    title: "Code_Architect", 
    oneliner: { en: "The Phantom: Drops a massive commit at dawn and vanishes.", ko: "새벽에 대형 커밋 던지고 사라짐" },
    id: "a1a1-99zq", 
    description: { en: "You work in the arcane hours of the night, weaving together massive, monolithic systems that lesser developers struggle to comprehend. A single commit from you can rewrite the laws of physics for the entire application.\n\nYour methods are esoteric. You don't just patch bugs; you re-architect reality. You prefer complex, interconnected structures where every function hums with a deep, underlying harmony. To the uninitiated, your code looks like magic.\n\nYou are the architect of the void. You dwell in the deep abstraction layers. When the system crashes, they call you to read the runes.", ko: "당신은 남들이 이해하기 힘든 거대한 시스템을 짜맞추며 깊은 밤의 신비로운 시간대에 작업합니다. 당신의 커밋 하나는 애플리케이션 전체의 물리 법칙을 다시 쓸 수 있습니다.\n\n당신의 방식은 난해합니다. 단순히 버그를 잡는 게 아니라, 현실을 재설계합니다. 모든 함수가 깊은 조화를 이루며 웅장하게 울려 퍼지는 복잡하고 상호 연결된 구조를 선호합니다. 초심자에게 당신의 코드는 마법처럼 보입니다.\n\n당신은 공허의 설계자입니다. 깊은 추상화 계층에 머뭅니다. 시스템이 붕괴될 때, 사람들은 룬 문자를 해독하기 위해 당신을 부릅니다." }, 
    stats: { AM: 20, CD: 60, FX: 85, DN: 85 } 
  },
  MCFD: { 
    type: "MCFD", 
    title: "Industrial_Builder", 
    oneliner: { en: "The Bulldozer: Pushing massive features in one go by day.", ko: "낮에 한 방에 기능 몰아치는 불도저" },
    id: "bob-build-01", 
    description: { en: "You are a heavy machinery operator. You push massive features in broad daylight without saying a word. Your PRs are giant blocks of code titled simply 'update core' or 'v2 implementation'.\n\nYou are trusted implicitly. You don't need to explain your work because it just works. You move mountains while everyone else is moving stones. You are the backbone of rapid prototyping and major version shifts.\n\nAction over words. Results over process.", ko: "당신은 중장비 기사입니다. 대낮에 말 한마디 없이 거대한 기능들을 밀어 넣습니다. 당신의 PR은 그저 '코어 업데이트' 혹은 'v2 구현'이라는 제목이 달린 거대한 코드 덩어리일 뿐입니다.\n\n당신은 절대적인 신뢰를 받습니다. 설명할 필요가 없습니다. 그냥 작동하니까요. 남들이 돌을 옮길 때 당신은 산을 옮깁니다. 당신은 쾌속 프로토타이핑과 메이저 버전 업데이트의 척추입니다.\n\n말보다는 행동. 과정보다는 결과." }, 
    stats: { AM: 15, CD: 70, FX: 90, DN: 15 } 
  },
  MCXN: { 
    type: "MCXN", 
    title: "Shadow_Mechanic", 
    oneliner: { en: "The Bomber: Total refactoring bomb at dawn.", ko: "새벽에 전면 리팩토링 폭탄" },
    id: "ghost-fix-x", 
    description: { en: "You are the ghost in the machine. You perform massive refactors at 3 AM without leaving a changelog. One morning, the team wakes up and the entire legacy module is gone, replaced by something faster, cleaner, and silent.\n\nYou fix architecture, not typos. You rip out the rotting foundations of the code and pour concrete in the dark. You are feared by junior developers and revered by seniors.\n\nYou operate in the shadows, but your impact is felt everywhere.", ko: "당신은 기계 속의 유령입니다. 새벽 3시에 변경 로그 하나 남기지 않고 대규모 리팩토링을 수행합니다. 어느 날 아침 팀이 일어나면, 낡은 레거시 모듈은 사라지고 더 빠르고 깨끗한 무언가로 대체되어 있습니다.\n\n당신은 오타가 아니라 아키텍처를 고칩니다. 썩어가는 코드의 기반을 뜯어내고 어둠 속에서 콘크리트를 들이붓습니다. 주니어 개발자들은 당신을 두려워하고, 시니어들은 당신을 숭배합니다.\n\n당신은 그림자 속에서 움직이지만, 그 영향력은 모든 곳에 미칩니다." }, 
    stats: { AM: 10, CD: 80, FX: 20, DN: 95 } 
  },
  MCXD: { 
    type: "MCXD", 
    title: "Heavy_Loader", 
    oneliner: { en: "The Sweeper: Wiping out bugs by day.", ko: "낮에 버그를 싹 쓸어버림" },
    id: "b2x9-11ea", 
    description: { en: "You are the reinforced steel backbone of this infrastructure. You don't deal in 'quick fixes'; you deploy massive, monolithic stability patches that permanently alter the landscape. When you push to main, the ground shakes.\n\nYour coding style is industrial-grade. It is not pretty, but it is unbreakable. You work in the broad daylight because you have nothing to hide—your work is built to be seen and relied upon.\n\nYou are the tank class. You are the immovable object against the unstoppable force of technical debt.", ko: "당신은 이 인프라의 강화된 강철 척추입니다. '임시방편'은 취급하지 않습니다. 지형을 영구적으로 바꾸는 거대하고 단단한 안정성 패치를 배포합니다. 당신이 메인 브랜치에 푸시하면 땅이 울립니다.\n\n당신의 코딩 스타일은 산업 등급입니다. 예쁘지는 않지만, 결코 부서지지 않습니다. 당신은 숨길 것이 없기에 대낮에 당당히 작업합니다.\n\n당신은 탱크(Tank) 클래스입니다. 기술 부채라는 멈출 수 없는 힘에 맞서는, 움직이지 않는 거대한 벽입니다." }, 
    stats: { AM: 15, CD: 80, FX: 20, DN: 20 } 
  },
  MDFN: { 
    type: "MDFN", 
    title: "Deep_Space_Titan", 
    oneliner: { en: "The Epic: Committing grand narratives at dawn.", ko: "새벽에 대서사시 커밋" },
    id: "titan-00", 
    description: { en: "You are creating a universe. Working through the long night, you commit massive frameworks accompanied by novels of documentation. You are not just writing code; you are defining the philosophy of the system.\n\nYour PRs are legendary events that take days to review. You consider every angle, describe every design decision, and implement entire subsystems in one go. You are the solo founder energy within a team environment.\n\nA solitary giant building a cathedral in the dark.", ko: "당신은 하나의 우주를 창조하고 있습니다. 긴 밤을 지새우며 소설 같은 문서가 첨부된 거대한 프레임워크를 커밋합니다. 당신은 코드를 쓰는 게 아니라, 시스템의 철학을 정의하고 있습니다.\n\n당신의 PR은 리뷰하는 데만 며칠이 걸리는 전설적인 사건입니다. 모든 각도를 고려하고, 모든 설계 결정을 서술하며, 하위 시스템 전체를 한 번에 구현합니다. 당신은 팀 안에 있는 '1인 창업자'와 같습니다.\n\n어둠 속에서 대성당을 짓고 있는 고독한 거인입니다." }, 
    stats: { AM: 10, CD: 10, FX: 90, DN: 90 } 
  },
  MDFD: { 
    type: "MDFD", 
    title: "Enterprise_Architect", 
    oneliner: { en: "The Scholar: Writing a thesis with a single PR.", ko: "낮에 PR 하나로 논문 씀" },
    id: "corp-arch-01", 
    description: { en: "You design systems that are meant to last for decades. You work visibly, producing extensive design docs and massive, well-structured implementations. You favor correctness over speed, and completeness over iteration.\n\nYour code is bureaucratic in the most stable sense. It is fully compliant, fully commented, and completely bulletproof. You build the foundations that the rest of the company stands on.\n\nYou are the grand planner of the digital city.", ko: "당신은 수십 년간 지속될 시스템을 설계합니다. 방대한 설계 문서와 거대하고 잘 구조화된 구현체를 만들어내며 공개적으로 작업합니다. 속도보다는 정확성을, 반복보다는 완성도를 선호합니다.\n\n당신의 코드는 가장 안정적인 의미에서 관료적입니다. 규정을 완벽히 준수하고, 주석이 가득하며, 방탄처럼 튼튼합니다. 당신은 회사의 나머지가 딛고 설 기반을 만듭니다.\n\n당신은 디지털 도시의 위대한 도시 계획가입니다." }, 
    stats: { AM: 15, CD: 15, FX: 85, DN: 15 } 
  },
  MDXN: { 
    type: "MDXN", 
    title: "Cryptographer", 
    oneliner: { en: "The Oracle: Log hell + long explanations at dawn.", ko: "새벽에 로그 지옥 + 장문 설명" },
    id: "crypto-x-99", 
    description: { en: "You dive into the deepest, darkest legacy code that everyone else is afraid to touch. You analyze the monolith, understand its secrets, and rewrite it from the inside out. You leave behind detailed logs of what you found in the abyss.\n\nYou are a historian and a mechanic. You explain the ancient logic of the codebase while modernizing it. Your work is slow, heavy, and incredibly important.\n\nYou act as the translator between the past and the future.", ko: "당신은 남들이 건드리기 두려워하는 가장 깊고 어두운 레거시 코드로 뛰어듭니다. 모놀리스를 분석하고, 비밀을 파헤치고, 안에서부터 밖으로 다시 씁니다. 당신은 심연에서 무엇을 발견했는지 상세한 기록을 남깁니다.\n\n당신은 역사학자이자 정비공입니다. 코드베이스의 고대 로직을 현대화하면서 동시에 그것을 설명해 줍니다. 당신의 작업은 느리고, 무겁지만, 믿을 수 없을 만큼 중요합니다.\n\n당신은 과거와 미래를 잇는 번역가입니다." }, 
    stats: { AM: 20, CD: 20, FX: 30, DN: 85 } 
  },
  MDXD: { 
    type: "MDXD", 
    title: "Legacy_Keeper", 
    oneliner: { en: "The Auditor: 3 pages of bug explanations by day.", ko: "낮에 버그 설명 3페이지" },
    id: "maintainer-01", 
    description: { en: "You are the librarian of the repository. You manage the massive migrations, the version upgrades, and the dependency audits during working hours. You meticulously document every change to ensure compliance and stability.\n\nYou are the safety net. You don't build flashy features; you ensure that the flashy features don't collapse the building. You write the changelogs that the users actually read.\n\nStability is your currency, and you are rich.", ko: "당신은 저장소의 사서(Librarian)입니다. 업무 시간에 대규모 마이그레이션, 버전 업그레이드, 의존성 감사를 관리합니다. 규정 준수와 안정성을 위해 모든 변경 사항을 꼼꼼히 문서화합니다.\n\n당신은 안전망입니다. 화려한 기능을 만들지는 않지만, 화려한 기능들이 건물을 무너뜨리지 않도록 지탱합니다. 당신은 유저들이 실제로 읽는 변경 로그를 작성하는 사람입니다.\n\n안정성은 당신의 화폐이며, 당신은 부자입니다." }, 
    stats: { AM: 25, CD: 25, FX: 20, DN: 20 } 
  }
};

export const LOGS = {
  ACFN: [
    { time: "14:02:22", type: "MDFD", event: "CONFLICT_DETECTED", msg: { en: "Mandatory documentation field missing in commit.", ko: "커밋에 필수 문서 필드가 누락되었습니다." }, status: "error" },
    { time: "14:05:10", type: "ACFD", event: "CONTEXT_DRIFT", msg: { en: "Daylight exposure detected. Stealth compromised.", ko: "주간 노출 감지됨. 은신 상태 해제." }, status: "warn" },
    { time: "14:08:45", type: "ACXN", event: "AUTO_MERGE", msg: { en: "Rapid iteration sync complete. Zero latency.", ko: "고속 반복 동기화 완료. 지연 시간 제로." }, status: "success" }
  ],
  ACFD: [
    { time: "14:02:22", type: "MCFN", event: "CONFLICT_DETECTED", msg: { en: "Abstract logic undefined. Ticket scope exceeded.", ko: "추상 로직 미정의. 티켓 범위 초과." }, status: "error" },
    { time: "14:05:10", type: "ACFN", event: "CONTEXT_DRIFT", msg: { en: "After-hours commit rejected. OT not approved.", ko: "업무 시간 외 커밋 거부됨. 초과 근무 미승인." }, status: "warn" },
    { time: "14:08:45", type: "ACXD", event: "AUTO_MERGE", msg: { en: "Hotfix handoff successful. Client satisfied.", ko: "핫픽스 인계 성공. 클라이언트 만족." }, status: "success" }
  ],
  ACXN: [
    { time: "14:02:22", type: "ADFN", event: "CONFLICT_DETECTED", msg: { en: "Comment density too high. Parse error.", ko: "주석 밀도 과다. 파싱 오류 발생." }, status: "error" },
    { time: "14:05:10", type: "MCXN", event: "CONTEXT_DRIFT", msg: { en: "Refactor too large for atomic batch.", ko: "아토믹 배치를 위한 리팩토링 규모 초과." }, status: "warn" },
    { time: "14:08:45", type: "ACFN", event: "AUTO_MERGE", msg: { en: "feature_branch merged. 0 conflicts detected.", ko: "feature_branch 병합됨. 충돌 없음." }, status: "success" }
  ],
  ACXD: [
    { time: "14:02:22", type: "MDFN", event: "CONFLICT_DETECTED", msg: { en: "Review pending for 3 days. Blocking queue.", ko: "리뷰 3일째 대기 중. 큐 블로킹 발생." }, status: "error" },
    { time: "14:05:10", type: "ACFD", event: "CONTEXT_DRIFT", msg: { en: "SLA warning. Response time slipping.", ko: "SLA 경고. 응답 시간 지연 중." }, status: "warn" },
    { time: "14:08:45", type: "ACXN", event: "AUTO_MERGE", msg: { en: "Critical bug patch propagated to all nodes.", ko: "치명적 버그 패치 전 노드 전파 완료." }, status: "success" }
  ],
  ADFN: [
    { time: "14:02:22", type: "ACXN", event: "CONFLICT_DETECTED", msg: { en: "Code lacking context. Narrative flow broken.", ko: "코드 맥락 부족. 내러티브 흐름 끊김." }, status: "error" },
    { time: "14:05:10", type: "MDFN", event: "CONTEXT_DRIFT", msg: { en: "Scope creep. Chapter 4 rewriting Chapter 1.", ko: "범위 확장 감지. 챕터 4가 챕터 1을 재작성 중." }, status: "warn" },
    { time: "14:08:45", type: "ADFD", event: "AUTO_MERGE", msg: { en: "Documentation sync. Story matches implementation.", ko: "문서 동기화. 스토리와 구현 일치." }, status: "success" }
  ],
  ADFD: [
    { time: "14:02:22", type: "ACFN", event: "CONFLICT_DETECTED", msg: { en: "PR rejected. No description provided.", ko: "PR 거부됨. 설명이 제공되지 않음." }, status: "error" },
    { time: "14:05:10", type: "ADFN", event: "CONTEXT_DRIFT", msg: { en: "Tone mismatch. Too informal for public repo.", ko: "어조 불일치. 공개 저장소에 비해 너무 비격식적." }, status: "warn" },
    { time: "14:08:45", type: "MDFD", event: "AUTO_MERGE", msg: { en: "Community guidelines aligned. Merge approved.", ko: "커뮤니티 가이드라인 준수. 병합 승인됨." }, status: "success" }
  ],
  ADXN: [
    { time: "14:02:22", type: "MCFD", event: "CONFLICT_DETECTED", msg: { en: "Root cause obscured by massive diff.", ko: "대규모 변경분으로 인해 근본 원인 파악 불가." }, status: "error" },
    { time: "14:05:10", type: "MDXN", event: "CONTEXT_DRIFT", msg: { en: "Too deep in legacy. Return to surface?", ko: "레거시 너무 깊숙이 진입. 표면으로 복귀하시겠습니까?" }, status: "warn" },
    { time: "14:08:45", type: "ADXD", event: "AUTO_MERGE", msg: { en: "Audit trail verified. Case closed.", ko: "감사 추적 확인됨. 사건 종결." }, status: "success" }
  ],
  ADXD: [
    { time: "14:02:22", type: "ACFN", event: "CONFLICT_DETECTED", msg: { en: "Style guide violation. Whitespace error.", ko: "스타일 가이드 위반. 공백 오류." }, status: "error" },
    { time: "14:05:10", type: "ADXN", event: "CONTEXT_DRIFT", msg: { en: "Analysis paralysis. Fix the lint first.", ko: "분석 마비. 린트(Lint)부터 수정하십시오." }, status: "warn" },
    { time: "14:08:45", type: "MDFD", event: "AUTO_MERGE", msg: { en: "Standardization complete. 100% Coverage.", ko: "표준화 완료. 커버리지 100% 달성." }, status: "success" }
  ],
  MCFN: [
    { time: "14:02:22", type: "ACFD", event: "CONFLICT_DETECTED", msg: { en: "Short-term thinking detected. Architecture invalid.", ko: "단기적 사고 감지됨. 아키텍처 유효하지 않음." }, status: "error" },
    { time: "14:05:10", type: "MCXN", event: "CONTEXT_DRIFT", msg: { en: "Reality distortion field unstable.", ko: "현실 왜곡 필드 불안정." }, status: "warn" },
    { time: "14:08:45", type: "MDFN", event: "AUTO_MERGE", msg: { en: "Mana pool synced. Spell woven.", ko: "마나 풀 동기화됨. 주문 시전 완료." }, status: "success" }
  ],
  MCFD: [
    { time: "14:02:22", type: "ADXN", event: "CONFLICT_DETECTED", msg: { en: "Nitpicking detected. Velocity slowed.", ko: "사소한 지적 감지됨. 개발 속도 저하." }, status: "error" },
    { time: "14:05:10", type: "MCFN", event: "CONTEXT_DRIFT", msg: { en: "Abstraction leakage. Keep it concrete.", ko: "추상화 누수 발생. 구체성을 유지하십시오." }, status: "warn" },
    { time: "14:08:45", type: "MCXD", event: "AUTO_MERGE", msg: { en: "Foundation reinforced. Load stable.", ko: "기반 강화됨. 부하 안정적." }, status: "success" }
  ],
  MCXN: [
    { time: "14:02:22", type: "ADFD", event: "CONFLICT_DETECTED", msg: { en: "Visibility too high. Cannot operate.", ko: "가시성 너무 높음. 작전 수행 불가." }, status: "error" },
    { time: "14:05:10", type: "MCFN", event: "CONTEXT_DRIFT", msg: { en: "Refactor changing core physics. Unsafe.", ko: "리팩토링이 핵심 물리 법칙을 변경 중. 위험." }, status: "warn" },
    { time: "14:08:45", type: "MDXN", event: "AUTO_MERGE", msg: { en: "Legacy code silently replaced.", ko: "레거시 코드 조용히 교체됨." }, status: "success" }
  ],
  MCXD: [
    { time: "14:02:22", type: "ACFN", event: "CONFLICT_DETECTED", msg: { en: "Commit too small. Inefficient I/O.", ko: "커밋 너무 작음. 비효율적 I/O." }, status: "error" },
    { time: "14:05:10", type: "MCFD", event: "CONTEXT_DRIFT", msg: { en: "Feature creep threatening stability.", ko: "기능 비대화가 안정성을 위협함." }, status: "warn" },
    { time: "14:08:45", type: "MDXD", event: "AUTO_MERGE", msg: { en: "Version bump successful. LTS active.", ko: "버전 업그레이드 성공. LTS 활성화." }, status: "success" }
  ],
  MDFN: [
    { time: "14:02:22", type: "ACXD", event: "CONFLICT_DETECTED", msg: { en: "Do not rush the masterpiece. Haste is waste.", ko: "걸작을 재촉하지 마십시오. 서두름은 낭비입니다." }, status: "error" },
    { time: "14:05:10", type: "ADFN", event: "CONTEXT_DRIFT", msg: { en: "Documentation outweighing implementation.", ko: "문서가 구현체보다 비대해지고 있음." }, status: "warn" },
    { time: "14:08:45", type: "MCFN", event: "AUTO_MERGE", msg: { en: "Cosmic alignment achieved. System birthed.", ko: "우주적 정렬 달성. 시스템 탄생." }, status: "success" }
  ],
  MDFD: [
    { time: "14:02:22", type: "ACFN", event: "CONFLICT_DETECTED", msg: { en: "Unauthorized change. Where is the ticket?", ko: "승인되지 않은 변경. 티켓이 어디 있습니까?" }, status: "error" },
    { time: "14:05:10", type: "ADFD", event: "CONTEXT_DRIFT", msg: { en: "Public comments diverting design goal.", ko: "공개 댓글이 설계 목표를 이탈시키고 있음." }, status: "warn" },
    { time: "14:08:45", type: "ADXD", event: "AUTO_MERGE", msg: { en: "Blueprint ratified. Construction proceeds.", ko: "청사진 비준됨. 건설 진행." }, status: "success" }
  ],
  MDXN: [
    { time: "14:02:22", type: "ACFD", event: "CONFLICT_DETECTED", msg: { en: "You do not understand the ancient laws.", ko: "당신은 고대의 법칙을 이해하지 못합니다." }, status: "error" },
    { time: "14:05:10", type: "ADXN", event: "CONTEXT_DRIFT", msg: { en: "Do not document the secret sauce.", ko: "핵심 비법(Secret Sauce)을 문서화하지 마십시오." }, status: "warn" },
    { time: "14:08:45", type: "MCXN", event: "AUTO_MERGE", msg: { en: "Protocol handshake. Abyss acknowledges.", ko: "프로토콜 핸드셰이크. 심연이 응답함." }, status: "success" }
  ],
  MDXD: [
    { time: "14:02:22", type: "MCFN", event: "CONFLICT_DETECTED", msg: { en: "Experimental branch merged to prod. Rollback!", ko: "실험 브랜치가 프로덕션에 병합됨. 롤백하라!" }, status: "error" },
    { time: "14:05:10", type: "ACXD", event: "CONTEXT_DRIFT", msg: { en: "Patching symptom, not cure. Debt rising.", ko: "증상만 치료 중, 원인은 미해결. 기술 부채 증가." }, status: "warn" },
    { time: "14:08:45", type: "MCXD", event: "AUTO_MERGE", msg: { en: "Infrastructure integrity 100%. Sleep mode engaged.", ko: "인프라 무결성 100%. 절전 모드 전환." }, status: "success" }
  ]
};