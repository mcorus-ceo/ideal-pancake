let URL = document.location.origin;

document.querySelector("#loginBtn").addEventListener('click', function(ev) {
    let btn = ev.target
    let btnRect = btn.getBoundingClientRect()
    
    let modalTop = Math.floor(btnRect.top) + Math.floor(btnRect.height)
    let modalLeft = Math.floor(btnRect.left)

    let loginModal = document.querySelector('#loginModal')

    loginModal.style = `display: block; --login-top: ${modalTop + 15}px; --login-left: ${modalLeft}px;`

    let loginModalBtn = document.querySelector('#loginModalSubmitBtn')
    loginModalBtn.addEventListener('click', function(e) {
        let usernameEl = document.querySelector('#loginModalUsername')
        let passwordEl = document.querySelector('#loginModalPassword')

        if (!usernameEl.value) {
            usernameEl.placeholder = 'Username required!'
            usernameEl.setAttribute('highlight',null)
            return;
        }
        if (!passwordEl.value) {
            passwordEl.placeholder = 'Password required!'
            passwordEl.setAttribute('highlight',null)
            return;
        }
        fetch(`${URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameEl.value,
                password: passwordEl.value,
            })
        }).then(res=>res.json()).then(data=>{
            switch (data.code) {
                case 403:
                    document.querySelector("#loginModalError").innerHTML = data.error
                    break;
                case 200:
                    document.location.href =
                        `${URL}/admin?username=${usernameEl.value}&password=${passwordEl.value}`
                    break;
                default:
                    document.querySelector("#loginModalError").innerHTML = 'Server error occured';
                    break;
            }
        })
    })
})

document.querySelector("#jQuizBtn").addEventListener('click', function(ev) {
    let btn = ev.target
    let btnRect = btn.getBoundingClientRect()
    
    let modalTop = Math.floor(btnRect.top) + Math.floor(btnRect.height)
    let modalLeft = Math.floor(btnRect.left)

    let joinModal = document.querySelector('#joinModal')

    joinModal.style = `display: block; --login-top: ${modalTop + 15}px; --login-left: ${modalLeft}px;`

    let joinModalBtn = document.querySelector('#joinModalSubmitBtn')
    joinModalBtn.addEventListener('click', function(e) {
        let NameEl = document.querySelector('#joinModalName')
        let KeyEl = document.querySelector('#joinModalKey')

        if (!NameEl.value) {
            NameEl.placeholder = 'Name required!'
            NameEl.setAttribute('highlight',null)
            return;
        }
        if (!KeyEl.value) {
            KeyEl.placeholder = 'Key required!'
            KeyEl.setAttribute('highlight',null)
            return;
        }
        fetch(`${URL}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: NameEl.value,
                key: KeyEl.value,
            })
        }).then(res=>res.json()).then(data=>{
            switch (data.code) {
                case 403:
                    document.querySelector("#joinModalError").innerHTML = data.error
                    break;
                case 418:
                    document.querySelector("#joinModalError").innerHTML = data.error
                    break;
                case 200:
                    document.location.href =
                        `${URL}/quiz?name=${NameEl.value}&key=${KeyEl.value}`
                    break;
                default:
                    document.querySelector("#joinModalError").innerHTML = 'Server error occured';
                    break;
            }
        })
    })
})