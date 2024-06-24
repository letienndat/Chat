function remove_value() {
  var input = document.getElementById("input_username");
  input.value = "";
}

function show_password() {
  var password = document.getElementById("input_password");
  let checkIsShow = password.type === "text";
  if (checkIsShow) {
    password.type = "password";
  } else {
    password.type = "text";
  }
}

async function postData(url = "", data = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
    return response;
  } catch (e) {
    return {
      status: 500
    }
  }
}

const submitFormSignin = (e) => {
  e.preventDefault()
  var notify_submit = document.querySelector('.notify-submit')
  var classList = notify_submit.classList
  classList.add('none')

  var input_username = document.querySelector('#input_username')
  var input_password = document.querySelector('#input_password')

  var body = {
    Username: input_username.value,
    Password: input_password.value,
  }

  if (body.Username.trim() !== '' && body.Password.trim() !== '') {
    try {
      postData(`${url}/auth/login`, body).then(async (response) => {
        if (response.status === 200) {
          var data = await response.json()

          setItem("uuid", data.data.UserID)
          setItem("tokenJWT", data.data.token)
          window.location.href = '../home/home.html'
        } else {
          classList.remove('none')
        }
      });
    } catch (e) {
      classList.remove('none')
    }
  } else {
    classList.remove('none')
  }

}