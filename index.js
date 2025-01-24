async function getUser() {
    const token = process.env.GH_TOKEN;
    const response = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    const user = await response.json();
    return user.login;  // 사용자 이름을 반환
}

async function getRepositories(owner) {
    const token = process.env.GH_TOKEN;
    const response = await fetch(`https://api.github.com/users/${owner}/repos`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch repositories for ${owner}`);
    }
    const repos = await response.json();
    return repos;
}

async function findRepoWithFile(owner, fileName) {
    const repos = await getRepositories(owner);
    for (const repo of repos) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo.name}/contents`, {
            headers: {
                Authorization: `Bearer ${process.env.GH_TOKEN}`,
            }
        });
        if (!response.ok) {
            console.log(`Failed to fetch contents for repo ${repo.name}`);
            continue;
        }
        const contents = await response.json();
        if (Array.isArray(contents) && contents.some(file => file.name === fileName)) {
            return repo.name;  // 파일이 있는 레포지토리 이름 반환
        }
    }
    return null;  // 파일을 찾지 못하면 null 반환
}

async function makeIssue() {
    const token = process.env.GH_TOKEN;
    const owner = await getUser();

    // 'index.js' 파일이 있는 레포지토리 찾기
    const repo = await findRepoWithFile(owner, 'index.js');

    if (!repo) {
        console.log('index.js 파일을 찾을 수 없습니다.');
        return;
    }

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            title: "오늘의 로또 번호",
            body: `## 오늘의 로또 번호
            - **${Math.floor(Math.random() * 45) + 1} ${Math.floor(Math.random() * 45) + 1} ${Math.floor(Math.random() * 45) + 1} ${Math.floor(Math.random() * 45) + 1} ${Math.floor(Math.random() * 45) + 1} ${Math.floor(Math.random() * 45) + 1}**
            `,
        })
    });

    if (response.ok) {
        console.log("성공");
    } else {
        console.log("실패");
    }
}

makeIssue();
