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

export function calculateGranularity(statsArray: { additions: number, deletions: number }[]): number {
    if (!statsArray.length) {return 50;}
    const totalLines = statsArray.reduce((acc, s) => acc + s.additions + s.deletions, 0);
    const avgDiff = totalLines / statsArray.length;
    const { ATOMIC_MAX, MONOLITHIC_MIN } = ALGO_CONFIG.GRANULARITY;
    const score = 100 - ((avgDiff - ATOMIC_MAX) * (100 / (MONOLITHIC_MIN - ATOMIC_MAX)));
    return Math.max(0, Math.min(100, score));
}

export function calculateLength(messages: string[]): number {
    if (!messages.length) {return 50;}
    const avgLen = messages.reduce((acc, msg) => acc + msg.length, 0) / messages.length;
    const { CONCISE_MAX, DESCRIPTIVE_MIN } = ALGO_CONFIG.LENGTH;
    const score = 100 - ((avgLen - CONCISE_MAX) * (100 / (DESCRIPTIVE_MIN - CONCISE_MAX)));
    return Math.max(0, Math.min(100, score));
}

export function calculateCycle(dates: string[]): number {
    if (!dates.length) {return 50;}
    const { NIGHT_START, NIGHT_END } = ALGO_CONFIG.CYCLE;
    const nightCount = dates.filter(d => {
        const h = new Date(d).getHours();
        return NIGHT_START > NIGHT_END
            ? (h >= NIGHT_START || h < NIGHT_END)
            : (h >= NIGHT_START && h < NIGHT_END);
    }).length;
    return Math.floor((nightCount / dates.length) * 100);
}

export interface CommitData {
    message: string;
    files: { filename: string, patch: string, additions: number, deletions: number }[];
}

export function calculateHybridType(commitsData: CommitData[]): number {
    if (!commitsData.length) {return 50;}
    let featureVotes = 0;
    let classifiedCount = 0;

    commitsData.forEach(c => {
        let vote = 0;
        // Priority 1: Message
        if (ALGO_CONFIG.NLP.FEATURE.test(c.message)) {vote = 1;}
        else if (ALGO_CONFIG.NLP.FIX.test(c.message)) {vote = -1;}
        
        // Priority 2: Code
        else {
            let diffScore = 0;
            let hasCode = false;
            c.files.forEach(f => {
                if(!f.patch) {return;}
                const lines = f.patch.split('\n');
                const added = lines.filter(l => l.startsWith('+') && !l.startsWith('+++'));
                const deleted = lines.filter(l => l.startsWith('-') && !l.startsWith('---'));
                
                if (added.length > 10 && deleted.length === 0) {diffScore += 2;}
                else if (deleted.length > added.length) {diffScore -= 1;}

                added.forEach(line => {
                    const code = line.substring(1).trim();
                    if (ALGO_CONFIG.DIFF.STRUCTURAL.test(code)) {diffScore += 1;}
                    if (ALGO_CONFIG.DIFF.LOGIC.test(code)) {diffScore -= 1;}
                });
                hasCode = true;
            });

            if (hasCode) {
                if (diffScore >= 2) {vote = 1;}
                if (diffScore <= -2) {vote = -1;}
            }
        }

        if (vote !== 0) {
            classifiedCount++;
            if (vote === 1) {featureVotes++;}
        }
    });

    if (classifiedCount === 0) {return 50;}
    return Math.floor((featureVotes / classifiedCount) * 100);
}

export function generateProfileStats(statsAM: number, statsCD: number, statsFX: number, statsDN: number) {
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