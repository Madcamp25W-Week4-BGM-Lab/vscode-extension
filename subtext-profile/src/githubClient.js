import { Octokit } from "octokit";
import { 
  calculateGranularity, 
  calculateLength, 
  calculateCycle, 
  calculateHybridType,
  generateProfileStats 
} from './analysisUtils';

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

  // STEP 1: Fetch Full History
  let userCommits = [];
  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner, repo, author: contributor.name, per_page: 100
    });
    userCommits = data;
  } catch (e) {
    console.warn("Could not fetch specific user history, falling back to cached list.");
    userCommits = contributor.commits;
  }

  // STEP 2: Calculate "Cheap" Stats (Using metadata)
  const allMessages = userCommits.map(c => c.commit.message);
  const allDates = userCommits.map(c => c.commit.author.date);
  
  const scoreCD = calculateLength(allMessages); 
  const scoreDN = calculateCycle(allDates);     

  // STEP 3: Deep Scan for "Expensive" Stats
  const DEEP_LIMIT = 15;
  const deepScanTarget = userCommits.slice(0, DEEP_LIMIT);
  
  const allStats = [];
  const deepData = []; 

  const details = await Promise.all(deepScanTarget.map(c => 
    octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', { 
      owner, repo, ref: c.sha 
    })
  ));

  details.forEach((d, index) => {
    allStats.push(d.data.stats); // { additions, deletions }

    deepData.push({
      message: deepScanTarget[index].commit.message,
      files: d.data.files.map(f => ({
        filename: f.filename,
        patch: f.patch, // Crucial for logic detection
        additions: f.additions,
        deletions: f.deletions
      }))
    });
  });

  const scoreAM = calculateGranularity(allStats);
  const scoreFX = calculateHybridType(deepData); 

  // Assemble Result
  const result = generateProfileStats(scoreAM, scoreCD, scoreFX, scoreDN);

  return {
    ...result,
    username: contributor.name,
    totalCommits: userCommits.length 
  };
}