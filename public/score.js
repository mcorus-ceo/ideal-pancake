document.addEventListener('DOMContentLoaded', (e)=> {
    const lines = document.querySelectorAll(".line")
    for (const line of lines) {
        if (line.children.length < 2) continue;
        const firstChild = line.children[1]
        const lastChild = line.lastElementChild;
        firstChild.classList.add('firstBorder');
        lastChild.classList.add('lastBorder');
    }
})