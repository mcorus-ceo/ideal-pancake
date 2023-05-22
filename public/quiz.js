const urlParams = new URLSearchParams(window.location.search);
let URL = document.location.origin;
let uname = urlParams.get('name')
let key = urlParams.get('key')

const submitAns = (data) => {
    fetch(`${URL}/answer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name:uname,
            question: data,
        })
    }).then(res=>res.text()).then(json=>{
        window.location.reload()
    })
}