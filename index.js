async function makeIssue() {
    const token = process.env.GH_TOKEN;
    const OWNER = "hanjungho";          // 계정 이름
    const REPO = "250124";              // 레포지토리 이름
    const response = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/issues`, {
        method: `POST`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            title: "오늘의 로또 번호",   // 수정
            body: `${Math.floor(Math.random() * 45) + 1} ${Math.floor(Math.random() * 45) + 1} ${Math.floor(Math.random() * 45) + 1} ${Math.floor(Math.random() * 45) + 1} ${Math.floor(Math.random() * 45) + 1} ${Math.floor(Math.random() * 45) + 1}`,     // 수정
        })
    });
    if (response.ok) {
        console.log("성공");
    } else {
        console.log("실패");
    }
}

makeIssue();