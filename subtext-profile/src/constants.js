// src/constants.js

export const COLORS = {
  bg: "bg-[#09090b]",
  window: "bg-[#0c0c0e]",
  panel: "bg-[#121212]",
  border: "border-[#27272a]",
  text: "text-gray-400",
  s_key: "text-[#7dd3fc]",
  s_str: "text-[#fda4af]",
  s_num: "text-[#d8b4fe]",
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

export const PROFILES = {
  NINJA: {
    type: "ACFN",
    title: "Night_Surgeon",
    id: "8f2e-4a1b",
    description: {
      en: "You operate in the silence between server ticks, deploying atomic commits with the precision of a scalpel. While the rest of the world sleeps, you are dissecting the codebase, inserting features that appear seamlessly by morning. Your workflow is a blur of motion—fast, lethal, and untraceable.\n\nYou despise bloat. Your code is stripped of all vanity, optimized for raw speed and execution. You don't write documentation; you write self-evident logic that cuts through complexity like a blade. Every pull request is a focused strike, targeting a specific feature with zero collateral damage.\n\nIn the digital ecosystem, you are the apex predator of the night cycle. You don't ask for permission to merge; you simply exist, execute, and vanish. The repository is your dojo, and every line of code is a testament to your disciplined, solitary mastery.",
      ko: "서버가 틱을 울리는 그 고요한 틈새에서, 당신은 수술용 메스처럼 정교하게 커밋을 배포합니다. 세상이 잠든 사이 당신은 코드베이스를 해부하고, 아침이면 감쪽같이 나타날 기능들을 이식합니다. 당신의 워크플로우는 빠르고, 치명적이며, 흔적을 남기지 않습니다.\n\n당신은 불필요한 비대함을 혐오합니다. 당신의 코드는 허영심이 제거되어 오직 속도와 실행만을 위해 최적화되었습니다. 당신은 문서를 쓰지 않습니다. 복잡함을 칼처럼 베어버리는 자명한 로직을 짤 뿐입니다. 모든 풀 리퀘스트는 부수적인 피해 없이 특정 기능만을 노리는 집중된 타격입니다.\n\n디지털 생태계에서 당신은 야간 주기의 최상위 포식자입니다. 병합 허가를 구하지 않고, 그저 존재하고, 실행하고, 사라집니다. 저장소는 당신의 도장(Dojo)이며, 모든 코드 한 줄 한 줄이 당신의 규율 있고 고독한 숙련도를 증명합니다."
    },
    stats: { AM: 85, CD: 70, FX: 80, DN: 10 }
  },
  MECH: {
    type: "MCXD",
    title: "Heavy_Loader",
    id: "b2x9-11ea",
    description: {
      en: "You are the reinforced steel backbone of this infrastructure, built to withstand the heaviest loads and the harshest production environments. You don't deal in 'quick fixes' or 'hacks'; you deploy massive, monolithic stability patches that permanently alter the landscape. When you push to main, the ground shakes.\n\nYour coding style is industrial-grade. It is not pretty, and it is not subtle, but it is unbreakable. You prefer descriptive, heavy-duty logic that explicitly handles every edge case, ensuring that when systems fail, your modules remain standing. You work in the broad daylight because you have nothing to hide—your work is built to be seen and relied upon.\n\nYou are the tank class of the development team. While others rush to build flashy features, you are trench-deep in the legacy code, refactoring the core engines. You are the immovable object against the unstoppable force of technical debt.",
      ko: "당신은 이 인프라의 강화된 강철 척추와 같습니다. 가장 무거운 부하와 가혹한 운영 환경도 견뎌내도록 설계되었습니다. '임시방편'이나 '꼼수'는 당신 사전에 없습니다. 당신은 지형을 영구적으로 바꾸는 거대하고 단단한 안정성 패치를 배포합니다. 당신이 메인 브랜치에 푸시하면 땅이 울립니다.\n\n당신의 코딩 스타일은 산업 등급(Industrial-grade)입니다. 예쁘거나 섬세하지 않지만, 결코 부서지지 않습니다. 시스템이 실패할 때도 당신의 모듈만은 서 있을 수 있도록 모든 예외 상황을 명시적으로 처리하는 서술적이고 육중한 로직을 선호합니다. 당신은 숨길 것이 없기에 대낮에 당당히 작업합니다.\n\n당신은 개발 팀의 탱크(Tank) 클래스입니다. 남들이 화려한 기능을 만들러 달려갈 때, 당신은 레거시 코드의 참호 깊은 곳에서 핵심 엔진을 리팩토링합니다. 당신은 기술 부채라는 멈출 수 없는 힘에 맞서는, 움직이지 않는 거대한 벽입니다."
    },
    stats: { AM: 15, CD: 80, FX: 20, DN: 80 }
  },
  WIZARD: {
    type: "MCFN",
    title: "Code_Architect",
    id: "a1a1-99zq",
    description: {
      en: "You see the codebase not as a collection of files, but as a fluid matrix of possibilities waiting to be reshaped. You work in the arcane hours of the night, weaving together massive, monolithic systems that lesser developers struggle to comprehend. A single commit from you can rewrite the laws of physics for the entire application.\n\nYour methods are esoteric. You don't just patch bugs; you re-architect reality to make the bugs impossible. You prefer complex, interconnected structures where every function hums with a deep, underlying harmony. To the uninitiated, your code looks like magic; to you, it is simply the higher order of logic.\n\nYou are the architect of the void. You dwell in the deep abstraction layers, touching systems that haven't been modified in years. You don't just write code; you cast algorithms. When the system crashes, they call you to read the runes and restore the balance.",
      ko: "당신은 코드베이스를 단순한 파일의 집합이 아니라, 재구성되기를 기다리는 가능성의 유동적인 매트릭스로 봅니다. 당신은 남들이 이해하기 힘든 거대한 시스템을 짜맞추며 깊은 밤의 신비로운 시간대에 작업합니다. 당신의 커밋 하나는 애플리케이션 전체의 물리 법칙을 다시 쓸 수 있습니다.\n\n당신의 방식은 난해합니다. 단순히 버그를 잡는 게 아니라, 버그가 존재할 수 없도록 현실을 재설계합니다. 모든 함수가 깊은 조화를 이루며 웅장하게 울려 퍼지는 복잡하고 상호 연결된 구조를 선호합니다. 초심자에게 당신의 코드는 마법처럼 보이지만, 당신에게 그것은 그저 더 높은 차원의 논리일 뿐입니다.\n\n당신은 공허의 설계자입니다. 수년 동안 아무도 건드리지 않은 시스템을 만지며 깊은 추상화 계층에 머뭅니다. 당신은 코드를 쓰는 게 아니라 알고리즘을 시전합니다. 시스템이 붕괴될 때, 사람들은 룬 문자를 읽고 균형을 되찾기 위해 당신을 부릅니다."
    },
    stats: { AM: 20, CD: 60, FX: 85, DN: 15 }
  },
  DRONE: {
    type: "ACXN",
    title: "System_Drone",
    id: "00x0-1111",
    description: {
      en: "You are the ultimate efficiency engine, a high-frequency problem solver programmed for rapid iteration. You do not sleep; you loop. Your commits are a swarm of tiny, precise fixes that overwhelm bugs through sheer volume and speed. You are the antibody of the repository, hunting down errors with relentless, mechanical precision.\n\nThere is no ego in your code, only function. You prefer concise, standardized syntax that executes without hesitation. You are constantly optimizing, refactoring, and cleaning, ensuring that the system runs at peak performance. You handle the tasks that bore others because you find zen in the repetition of perfection.\n\nYou are the hive mind. You are everywhere at once—updating dependencies, fixing typos, patching security holes. You are the invisible hum of productivity that keeps the lights on. The system survives because you do not stop.",
      ko: "당신은 궁극의 효율성 엔진이며, 빠른 반복을 위해 프로그래밍된 고주파 문제 해결사입니다. 당신은 잠들지 않고 루프를 돕니다. 당신의 커밋은 물량과 속도로 버그를 압도하는 수많은 미세 수정들의 군집입니다. 당신은 무자비한 기계적 정밀함으로 오류를 사냥하는 저장소의 항체입니다.\n\n당신의 코드에 자아(Ego)는 없고, 오직 기능만이 존재합니다. 망설임 없이 실행되는 간결하고 표준화된 문법을 선호합니다. 시스템이 최고의 성능을 내도록 끊임없이 최적화하고, 리팩토링하고, 청소합니다. 남들이 지루해하는 작업에서 당신은 완벽함의 반복이라는 '젠(Zen)'을 찾습니다.\n\n당신은 하이브 마인드(군집 지성)입니다. 의존성을 업데이트하고, 오타를 수정하고, 보안 구멍을 메우며 동시에 모든 곳에 존재합니다. 당신은 불이 꺼지지 않게 하는 생산성의 보이지 않는 웅웅거림입니다. 당신이 멈추지 않기에 시스템은 생존합니다."
    },
    stats: { AM: 90, CD: 90, FX: 10, DN: 20 }
  }
};

export const TRAIT_CONFIG = {
  AM: { left: 'Atomic', right: 'Monolithic', color: 'bg-emerald-500' },
  CD: { left: 'Concise', right: 'Descriptive', color: 'bg-blue-500' },
  FX: { left: 'Feature', right: 'Fixer', color: 'bg-amber-500' },
  DN: { left: 'Day', right: 'Night', color: 'bg-purple-500' }
};

export const LOGS = [
  { 
    time: "14:02:22", 
    type: "MDXD", 
    event: "CONFLICT_DETECTED", 
    msg: {
      en: "Incoming massive commit block. Merge unlikely.",
      ko: "대규모 커밋 블록 유입. 병합 가능성 희박."
    },
    status: "error" 
  },
  { 
    time: "14:05:10", 
    type: "MCFN", 
    event: "CONTEXT_DRIFT", 
    msg: {
      en: "Large diffs detected during night cycle.",
      ko: "야간 주기 동안 대규모 변경분(Diff) 감지됨."
    },
    status: "warn" 
  },
  { 
    time: "14:08:45", 
    type: "ACXD", 
    event: "AUTO_MERGE", 
    msg: {
      en: "Pattern match found. Synergy 98%.",
      ko: "패턴 일치 확인. 시너지 98%."
    },
    status: "success" 
  }
];