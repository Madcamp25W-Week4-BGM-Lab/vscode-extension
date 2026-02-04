import simpleGit from 'simple-git';
import { 
  calculateGranularity, 
  calculateLength, 
  calculateCycle, 
  calculateHybridType,
  generateProfileStats 
} from './analysisUtils';

/**
 * Analyzes the local git history for the current user.
 * Matches the style of githubClient.analyzeContributorInRepo
 * * @param {string} projectRoot - The absolute path to the folder (e.g. /Users/me/project)
 * @param {string} authorEmail - The email to filter commits by
 */
export async function analyzeLocalUser(projectRoot, authorEmail) {
    // Initialize the git instance for this specific call (Stateless style)
    const git = simpleGit(projectRoot);

    try {
        // 1. Get Metadata (Log)
        const log = await git.log({ 
            '--max-count': 100, 
            '--author': authorEmail 
        });

        if (log.total === 0) {
            return null; // Handle case where user has no local commits yet
        }

        // 2. Cheap Stats (Message Length & Time Cycle)
        const allMessages = log.all.map(c => c.message);
        const allDates = log.all.map(c => c.date);
        
        const scoreCD = calculateLength(allMessages);
        const scoreDN = calculateCycle(allDates);

        // 3. Deep Scan (Granularity & Type)
        // We scan the top 15 commits for file stats and patch data
        const DEEP_LIMIT = 15;
        const deepScanTarget = log.all.slice(0, DEEP_LIMIT);
        
        const allStats = [];
        const deepData = [];

        // We use a loop here to await the git commands sequentially
        for (const commit of deepScanTarget) {
            // A. Get File Stats (Additions/Deletions)
            // 'git show --numstat' is faster than getting the full diff for stats
            const rawStats = await git.raw(['show', '--numstat', '--format=', commit.hash]);
            
            let currentCommitStats = { additions: 0, deletions: 0 };
            const fileList = [];

            if (rawStats) {
                const lines = rawStats.split('\n').filter(Boolean);
                lines.forEach(line => {
                    const parts = line.split(/\s+/);
                    // parts = ["5", "0", "src/App.js"]
                    // specific check for binary files using "-"
                    if (parts[0] !== '-' && parts[1] !== '-') {
                        const a = parseInt(parts[0]) || 0;
                        const d = parseInt(parts[1]) || 0;
                        currentCommitStats.additions += a;
                        currentCommitStats.deletions += d;
                        fileList.push({ filename: parts[2], additions: a, deletions: d });
                    }
                });
            }
            allStats.push(currentCommitStats);

            // B. Get Patch Content (For "Feature vs Fix" Logic detection)
            // We fetch the raw commit content to scan for keywords like "if(", "class", etc.
            const rawPatch = await git.show([commit.hash]);
            
            deepData.push({
                message: commit.message,
                files: fileList.map(f => ({
                    ...f,
                    patch: rawPatch // We pass the full patch to the calculator
                }))
            });
        }

        // 4. Calculate Final Scores using the shared Utils
        const scoreAM = calculateGranularity(allStats);
        const scoreFX = calculateHybridType(deepData);

        // 5. Assemble Profile
        const result = generateProfileStats(scoreAM, scoreCD, scoreFX, scoreDN);

        return {
            ...result,
            username: log.all[0].author_name, // Use the name from the latest commit
            email: authorEmail,
            totalCommits: log.total
        };

    } catch (error) {
        console.error("Local Analysis Failed:", error);
        throw error;
    }
}