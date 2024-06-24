function remove_value() {
  var input = document.getElementById("input_username");
  input.value = "";
}

function show_password(is_confirm) {
  if (!is_confirm) {
    let password = document.getElementById("input_password");
    let checkIsShow = password.type === "text";
    if (checkIsShow) {
      password.type = "password";
    } else {
      password.type = "text";
    }
  } else {
    password = document.getElementById("input_password_confirm");
    let checkIsShow = password.type === "text";
    if (checkIsShow) {
      password.type = "password";
    } else {
      password.type = "text";
    }
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

const submitFormSignup = (e) => {
  var notify_submit = document.querySelector('.notify-submit')
  var classList = notify_submit.classList
  classList.add('none')

  e.preventDefault()

  var input_fullname = document.querySelector('#input_fullname')
  var input_username = document.querySelector('#input_username')
  var input_password = document.querySelector('#input_password')
  var input_password_confirm = document.querySelector('#input_password_confirm')

  if (input_password_confirm.value.trim() !== '' &&
    input_password.value.trim() !== '' &&
    input_password_confirm.value === input_password.value
  ) {
    var body = {
      FullName: input_fullname.value,
      Username: input_username.value,
      Password: input_password.value,
    }

    try {
      postData(`${url}/auth/register`, body).then(async (response) => {
        if (response.status === 200) {
          var data = await response.json()
          window.location.href = '../signin/index.html'
        } else {
          console.error(response);
          classList.remove('none')
        }
      });
    } catch (e) {
      console.error(e);
      classList.remove('none')
    }
  } else {
    classList.remove('none')
  }
}