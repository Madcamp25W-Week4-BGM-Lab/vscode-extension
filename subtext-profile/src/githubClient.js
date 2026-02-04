import { Octokit } from "octokit";

export async function analyzeProfile(token, username) {
  // Initialize the client with the user's token
  const octokit = new Octokit({ auth: token });

  // 1. THE GRAPHQL QUERY
  // This fetches the user's ID, their top 6 repos, and the last 20 commits of each.
  const query = `
    query($login: String!) {
      user(login: $login) {
        id
        login
        repositories(first: 6, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}, isFork: false) {
          nodes {
            name
            defaultBranchRef {
              target {
                ... on Commit {
                  history(first: 20, author: {id: $userId}) { 
                    nodes {
                      message
                      committedDate
                      additions
                      deletions
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    // A. Get User ID first (Required to filter history by ONLY this user)
    const { user: { id: userId } } = await octokit.graphql(
      `query($login: String!) { user(login: $login) { id } }`, 
      { login: username }
    );

    // B. Run the Mega Query
    // Note: We inject the userId into the query string to filter commits
    const data = await octokit.graphql(query.replace('$userId', `"${userId}"`), {
      login: username
    });

    // C. Flatten Data
    const allCommits = data.user.repositories.nodes
      .map(repo => repo.defaultBranchRef?.target?.history?.nodes || [])
      .flat();

    if (allCommits.length === 0) throw new Error("NO_COMMITS_FOUND");

    // --- CALCULATE STATS ---

    // 1. GRANULARITY (Atomic vs Monolithic)
    // Avg lines changed (additions + deletions)
    const totalLines = allCommits.reduce((acc, c) => acc + c.additions + c.deletions, 0);
    const avgDiff = totalLines / allCommits.length;
    // Score: < 20 lines = 100 (Atomic). > 300 lines = 0 (Monolithic).
    const scoreAM = Math.max(0, Math.min(100, 100 - ((avgDiff - 20) * (100 / 280))));

    // 2. LENGTH (Concise vs Descriptive)
    // Avg message length
    const avgLen = allCommits.reduce((acc, c) => acc + c.message.length, 0) / allCommits.length;
    // Score: < 20 chars = 100 (Concise). > 120 chars = 0 (Descriptive).
    const scoreCD = Math.max(0, Math.min(100, 100 - ((avgLen - 20) * (100 / 100))));

    // 3. TYPE (Feature vs Fixer)
    // Keyword analysis
    const featKeys = /feat|add|new|create|implement|init/i;
    const feats = allCommits.filter(c => featKeys.test(c.message)).length;
    const fixes = allCommits.filter(c => /fix|bug|resolve|patch|repair/i.test(c.message)).length;
    const totalClassified = feats + fixes || 1;
    const scoreFX = Math.floor((feats / totalClassified) * 100);

    // 4. CYCLE (Day vs Night)
    // Time analysis (Using local hours from Date object is rough but works for vibe)
    const nightCommits = allCommits.filter(c => {
      const h = new Date(c.committedDate).getHours();
      return h < 6 || h >= 20; // 8PM - 6AM
    }).length;
    const scoreDN = Math.floor((nightCommits / allCommits.length) * 100);

    // D. Generate Code (e.g., "ACFN")
    const type = [
      scoreAM >= 50 ? 'A' : 'M',
      scoreCD >= 50 ? 'C' : 'D',
      scoreFX >= 50 ? 'F' : 'X',
      scoreDN >= 50 ? 'N' : 'D'
    ].join('');

    return {
      type,
      stats: { AM: Math.round(scoreAM), CD: Math.round(scoreCD), FX: Math.round(scoreFX), DN: Math.round(scoreDN) },
      username: username,
      totalCommits: allCommits.length
    };

  } catch (err) {
    console.error("Analysis Error:", err);
    throw err;
  }
}