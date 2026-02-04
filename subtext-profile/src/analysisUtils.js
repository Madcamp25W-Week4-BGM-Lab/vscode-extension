// src/analysisUtils.js

// --- CONFIGURATION ---
export const ALGO_CONFIG = {
  GRANULARITY: { ATOMIC_MAX: 20, MONOLITHIC_MIN: 250 },
  LENGTH: { CONCISE_MAX: 5, DESCRIPTIVE_MIN: 75 },
  CYCLE: { NIGHT_START: 18, NIGHT_END: 6 },
  NLP: {
    FEATURE: /^(feat|new|add|create|implement|init|build|make)(:|\s)/i, 
    FIX: /^(fix|bug|resolve|patch|repair|correct|hotfix|oops|refactor)(:|\s)/i,
  },
  DIFF: {
    STRUCTURAL: /class |function |const |let |var |import |export |interface |type |new |component/i,
    LOGIC: /if\(|if |else|return|try |catch|throw |typeof |!=|==|&&|\|\|/i,
  },
  FILES: {
    CODE: ['.jsx', '.js', '.tsx', '.ts', '.py', '.rb', '.go', '.rs', '.java', '.cpp', '.c', '.vue'], 
    MAINTENANCE: ['.json', '.yml', '.yaml', '.toml', '.xml', '.config.js', '.gitignore', '.test.js', '.spec.js'] 
  }
};

// --- CORE CALCULATORS ---

export function calculateGranularity(statsArray) { 
  // statsArray item structure: { additions: number, deletions: number }
  if (!statsArray || !statsArray.length) return 50;
  const totalLines = statsArray.reduce((acc, s) => acc + s.additions + s.deletions, 0);
  const avgDiff = totalLines / statsArray.length;
  const { ATOMIC_MAX, MONOLITHIC_MIN } = ALGO_CONFIG.GRANULARITY;
  const score = 100 - ((avgDiff - ATOMIC_MAX) * (100 / (MONOLITHIC_MIN - ATOMIC_MAX)));
  return Math.max(0, Math.min(100, score));
}

export function calculateLength(messages) {
  // messages: array of strings
  if (!messages || !messages.length) return 50;
  const avgLen = messages.reduce((acc, msg) => acc + msg.length, 0) / messages.length;
  const { CONCISE_MAX, DESCRIPTIVE_MIN } = ALGO_CONFIG.LENGTH;
  const score = 100 - ((avgLen - CONCISE_MAX) * (100 / (DESCRIPTIVE_MIN - CONCISE_MAX)));
  return Math.max(0, Math.min(100, score));
}

export function calculateCycle(dates) {
  // dates: array of Date objects or ISO strings
  if (!dates || !dates.length) return 50;
  const { NIGHT_START, NIGHT_END } = ALGO_CONFIG.CYCLE;
  const nightCount = dates.filter(d => {
    const h = new Date(d).getHours();
    return ALGO_CONFIG.CYCLE.NIGHT_START > ALGO_CONFIG.CYCLE.NIGHT_END 
      ? (h >= NIGHT_START || h < NIGHT_END)
      : (h >= NIGHT_START && h < NIGHT_END);
  }).length;
  return Math.floor((nightCount / dates.length) * 100);
}

// --- CLASSIFICATION LOGIC ---

export function classifyCommit(commit) {
  /**
   * Expected commit structure:
   * { 
   * message: string, 
   * files: [{ filename: string, patch: string (optional), additions: number, deletions: number }] 
   * }
   */
  
  // 1. PRIORITY 1: MESSAGE
  if (ALGO_CONFIG.NLP.FEATURE.test(commit.message)) return 1; 
  if (ALGO_CONFIG.NLP.FIX.test(commit.message)) return -1;

  // 2. PRIORITY 2: DIFF CONTENT
  let diffScore = 0;
  let hasCode = false;

  if (commit.files && commit.files.length > 0) {
    commit.files.forEach(f => {
      // If patch is unavailable (e.g. binary or too large), skip detailed scan
      if (!f.patch) return; 

      const lines = f.patch.split('\n');
      const added = lines.filter(l => l.startsWith('+') && !l.startsWith('+++'));
      const deleted = lines.filter(l => l.startsWith('-') && !l.startsWith('---'));

      if (added.length > 10 && deleted.length === 0) diffScore += 2; 
      else if (deleted.length > added.length) diffScore -= 1;        

      added.forEach(line => {
        const code = line.substring(1).trim();
        if (ALGO_CONFIG.DIFF.STRUCTURAL.test(code)) diffScore += 1;
        if (ALGO_CONFIG.DIFF.LOGIC.test(code)) diffScore -= 1;
      });

      hasCode = true;
    });
  }

  if (hasCode) {
    if (diffScore >= 2) return 1;
    if (diffScore <= -2) return -1;
  }

  // 3. PRIORITY 3: FILE EXTENSION
  let fileScore = 0;
  if (commit.files) {
    commit.files.forEach(f => {
      const ext = '.' + f.filename.split('.').pop();
      if (ALGO_CONFIG.FILES.CODE.includes(ext)) fileScore += 1;
      if (ALGO_CONFIG.FILES.MAINTENANCE.includes(ext)) fileScore -= 1;
    });
  }

  if (fileScore > 0) return 1;
  if (fileScore < 0) return -1;
  
  return 0;
}

export function calculateHybridType(commitsData) {
  if (!commitsData || !commitsData.length) return 50;

  let featureVotes = 0;
  let classifiedCount = 0;

  commitsData.forEach(c => {
    const vote = classifyCommit(c);
    if (vote !== 0) {
      classifiedCount++;
      if (vote === 1) featureVotes++;
    }
  });

  if (classifiedCount === 0) return 50;
  return Math.floor((featureVotes / classifiedCount) * 100);
}

// Helper to assemble final profile object
export function generateProfileStats(statsAM, statsCD, statsFX, statsDN) {
  const type = [
    statsAM >= 50 ? 'A' : 'M',
    statsCD >= 50 ? 'C' : 'D',
    statsFX >= 50 ? 'F' : 'X',
    statsDN >= 50 ? 'N' : 'D'
  ].join('');

  return {
    type,
    stats: { 
      AM: Math.round(statsAM), 
      CD: Math.round(statsCD), 
      FX: Math.round(statsFX), 
      DN: Math.round(statsDN) 
    }
  };
}