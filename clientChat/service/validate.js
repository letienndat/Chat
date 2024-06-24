async function getData(url = "", method = 'GET', token = '') {
  try {
    const response = await fetch(url, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      redirect: "follow",
      referrerPolicy: "no-referrer"
    });
    return response;
  } catch (e) {
    console.error(e);
    return {
      status: 500
    }
  }
}

async function validate() {
  try {
    const token = getItem('tokenJWT')
  
    getData(`${url}/user/info`, 'GET', token).then(async (response) => {
      if (response.status === 200) {
        if (window.location.href.endsWith('/signin/index.html') || window.location.href.endsWith('/signup/index.html')) {
          window.location.href = '../home/home.html'
        }
        document.body.classList.remove('none')
      } else {
        if (window.location.href.split('?')[0].endsWith('/home/home.html')) {
          window.location.href = '../signin/index.html'
        }
        document.body.classList.remove('none')
      }
    });
  } catch (e) {
    alert('Không thể kết nối tới server!')
    window.location.href = '../signin/index.html'
    document.body.classList.remove('none')
  }
}