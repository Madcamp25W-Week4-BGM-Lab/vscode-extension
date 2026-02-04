import { Octokit } from "octokit";

// --- 1. CONFIGURATION ---
export const ALGO_CONFIG = {
  // Shared Thresholds
  GRANULARITY: { ATOMIC_MAX: 20, MONOLITHIC_MIN: 250 },
  LENGTH: { CONCISE_MAX: 5, DESCRIPTIVE_MIN: 75 },
  CYCLE: { NIGHT_START: 18, NIGHT_END: 6 },

  // STRATEGY 1: MESSAGE (Highest Priority)
  NLP: {
    // strict regex to catch explicit intent
    FEATURE: /^(feat|new|add|create|implement|init|build|make)(:|\s)/i, 
    FIX: /^(fix|bug|resolve|patch|repair|correct|hotfix|oops|refactor)(:|\s)/i,
  },

  // STRATEGY 2: DIFF CONTENT (Middle Priority)
  DIFF: {
    // Structural keywords = Creation = Feature
    STRUCTURAL: /class |function |const |let |var |import |export |interface |type |new |component/i,
    // Logic/Control keywords = Correction = Fix
    LOGIC: /if\(|if |else|return|try |catch|throw |typeof |!=|==|&&|\|\|/i,
  },

  // STRATEGY 3: FILE EXTENSION (Fallback)
  FILES: {
    CODE: ['.jsx', '.js', '.tsx', '.ts', '.py', '.rb', '.go', '.rs', '.java', '.cpp', '.c', '.vue'], 
    MAINTENANCE: ['.json', '.yml', '.yaml', '.toml', '.xml', '.config.js', '.gitignore', '.test.js', '.spec.js'] 
  }
};

// --- 2. CALCULATORS ---

// ... [calculateGranularity, calculateLength, calculateCycle unchanged] ...
function calculateGranularity(statsArray) { 
  if (!statsArray.length) return 50;
  const totalLines = statsArray.reduce((acc, s) => acc + s.additions + s.deletions, 0);
  const avgDiff = totalLines / statsArray.length;
  const { ATOMIC_MAX, MONOLITHIC_MIN } = ALGO_CONFIG.GRANULARITY;
  const score = 100 - ((avgDiff - ATOMIC_MAX) * (100 / (MONOLITHIC_MIN - ATOMIC_MAX)));
  return Math.max(0, Math.min(100, score));
}

function calculateLength(messages) {
  if (!messages.length) return 50;
  const avgLen = messages.reduce((acc, msg) => acc + msg.length, 0) / messages.length;
  const { CONCISE_MAX, DESCRIPTIVE_MIN } = ALGO_CONFIG.LENGTH;
  const score = 100 - ((avgLen - CONCISE_MAX) * (100 / (DESCRIPTIVE_MIN - CONCISE_MAX)));
  return Math.max(0, Math.min(100, score));
}

function calculateCycle(dates) {
  if (!dates.length) return 50;
  const { NIGHT_START, NIGHT_END } = ALGO_CONFIG.CYCLE;
  const nightCount = dates.filter(d => {
    const h = new Date(d).getHours();
    return ALGO_CONFIG.CYCLE.NIGHT_START > ALGO_CONFIG.CYCLE.NIGHT_END 
      ? (h >= NIGHT_START || h < NIGHT_END)
      : (h >= NIGHT_START && h < NIGHT_END);
  }).length;
  return Math.floor((nightCount / dates.length) * 100);
}

/**
 * THE WATERFALL CLASSIFIER
 * Priority: Message > Diff > File Extension
 */
function classifyCommit(commit) {
  // commit = { message, files: [{ filename, patch, additions, deletions }] }
  
  // 1. PRIORITY 1: MESSAGE (Explicit Intent)
  // If the user explicitly labelled it, trust them.
  if (ALGO_CONFIG.NLP.FEATURE.test(commit.message)) return 1; // Feature
  if (ALGO_CONFIG.NLP.FIX.test(commit.message)) return -1;    // Fix

  // 2. PRIORITY 2: DIFF CONTENT (The "Shape" of the code)
  // If the message is vague ("wip", "update"), look at the code.
  let diffScore = 0;
  let hasCode = false;

  if (commit.files && commit.files.length > 0) {
    commit.files.forEach(f => {
      // Skip binary/large files without patches
      if (!f.patch) return; 

      const lines = f.patch.split('\n');
      const added = lines.filter(l => l.startsWith('+') && !l.startsWith('+++'));
      const deleted = lines.filter(l => l.startsWith('-') && !l.startsWith('---'));

      // Heuristic A: Pure Creation vs Pure Deletion
      if (added.length > 10 && deleted.length === 0) diffScore += 2; // Strong Feature
      else if (deleted.length > added.length) diffScore -= 1;        // Refactor/Fix

      // Heuristic B: Content Scanning
      added.forEach(line => {
        const code = line.substring(1).trim();
        if (ALGO_CONFIG.DIFF.STRUCTURAL.test(code)) diffScore += 1; // Defining things
        if (ALGO_CONFIG.DIFF.LOGIC.test(code)) diffScore -= 1;      // Fixing logic
      });

      hasCode = true;
    });
  }

  // Use Diff Score if it's decisive enough
  if (hasCode) {
    if (diffScore >= 2) return 1;  // Likely Feature
    if (diffScore <= -2) return -1; // Likely Fix
  }

  // 3. PRIORITY 3: FILE EXTENSION (Fallback)
  // If diff was ambiguous (score -1 to 1), fall back to file type.
  let fileScore = 0;
  if (commit.files) {
    commit.files.forEach(f => {
      const ext = '.' + f.filename.split('.').pop();
      if (ALGO_CONFIG.FILES.CODE.includes(ext)) fileScore += 1;
      if (ALGO_CONFIG.FILES.MAINTENANCE.includes(ext)) fileScore -= 1;
    });
  }

  if (fileScore > 0) return 1;  // Touched code -> Assume Feature
  if (fileScore < 0) return -1; // Touched config -> Assume Fix/Maint
  
  return 0; // Truly Unknown
}

function calculateHybridType(commitsData) {
  if (!commitsData.length) return 50;

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


// --- 3. EXPORTED FUNCTIONS ---

// 1. Fetch Contributors (Metadata Scan)
export async function fetchRepoContributors(token, repoString) {
  const octokit = new Octokit({ auth: token });
  const [owner, repo] = repoString.split('/');

  const { data: commits } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner, repo, per_page: 100
  });

  const contributors = {};
  commits.forEach(c => {
    const name = c.author ? c.author.login : c.commit.author.name;
    if (!contributors[name]) contributors[name] = { name, avatar: c.author?.avatar_url, commits: [] };
    contributors[name].commits.push({ sha: c.sha, message: c.commit.message, date: c.commit.author.date });
  });

  return Object.values(contributors).sort((a,b) => b.commits.length - a.commits.length);
}

// 2. Analyze Specific Contributor (Deep Scan)
export async function analyzeContributorInRepo(token, repoString, contributor) {
  const octokit = new Octokit({ auth: token });
  const [owner, repo] = repoString.split('/');

  // STEP 1: Fetch the user's FULL history in this repo (Metadata only)
  // This solves your concern: We get up to 100 commits, not just the ones from the main scan.
  let userCommits = [];
  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner,
      repo,
      author: contributor.name, // Filter by this specific user
      per_page: 100 // Get as much history as possible (Cost: 1 Call)
    });
    userCommits = data;
  } catch (e) {
    console.warn("Could not fetch specific user history, falling back to cached list.");
    userCommits = contributor.commits;
  }

  // STEP 2: Calculate "Cheap" Stats (Using ALL 100 commits)
  // We have Dates and Messages in the metadata, so use the full dataset for accuracy.
  const allMessages = userCommits.map(c => c.commit.message);
  const allDates = userCommits.map(c => c.commit.author.date);
  
  const scoreCD = calculateLength(allMessages); // High Accuracy (N=100)
  const scoreDN = calculateCycle(allDates);     // High Accuracy (N=100)

  // STEP 3: Deep Scan for "Expensive" Stats (Granularity & Waterfall Type)
  // We strictly limit this to the top 10 to save API quota.
  // Fetching diffs for 100 commits = 100 calls = Too slow/expensive.
  const DEEP_LIMIT = 15;
  const deepScanTarget = userCommits.slice(0, DEEP_LIMIT);
  
  const allStats = [];
  const deepData = []; 

  // Parallel Fetch Details (Cost: 10 Calls)
  const details = await Promise.all(deepScanTarget.map(c => 
    octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', { 
      owner, 
      repo, 
      ref: c.sha 
    })
  ));

  details.forEach((d, index) => {
    allStats.push(d.data.stats); // Additions/Deletions

    deepData.push({
      message: deepScanTarget[index].commit.message,
      files: d.data.files.map(f => ({
        filename: f.filename,
        patch: f.patch, // Raw Code Diff
        additions: f.additions,
        deletions: f.deletions
      }))
    });
  });

  // Calculate Deep Stats based on the sample
  const scoreAM = calculateGranularity(allStats);
  const scoreFX = calculateHybridType(deepData); // Waterfall Logic

  // Generate Type
  const type = [
    scoreAM >= 50 ? 'A' : 'M',
    scoreCD >= 50 ? 'C' : 'D',
    scoreFX >= 50 ? 'F' : 'X',
    scoreDN >= 50 ? 'N' : 'D'
  ].join('');

  return {
    type,
    stats: { 
      AM: Math.round(scoreAM), 
      CD: Math.round(scoreCD), 
      FX: Math.round(scoreFX), 
      DN: Math.round(scoreDN) 
    },
    username: contributor.name,
    totalCommits: userCommits.length // Display the TRUE count found (up to 100)
  };
}