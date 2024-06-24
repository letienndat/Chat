const signout = () => {
  removeItem("tokenJWT");
  removeItem("uuid");
  window.location.href = "../signin/index.html";
};

async function getData(url = "", method = "GET", token = "") {
  try {
    const response = await fetch(url, {
      method: method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
    return response;
  } catch (e) {
    handleNotConnect();
  }
}

const getParam = (name) => {
  var url = new URL(window.location.href);
  var params = new URLSearchParams(url.search);
  var paramsObject = {};

  params.forEach(function (value, key) {
    paramsObject[key] = value;
  });

  return paramsObject[name];
};

const getHeader = async (friendID) => {
  await getData(`${url}/message/list-friend`, "GET", getItem("tokenJWT")).then(
    async (response) => {
      if (response.status === 200) {
        var data = await response.json();
        console.log(data);

        var friend = data.data.find((item) => item.FriendID === friendID);

        if (!friend) {
          document.querySelector("#content").classList.add("none");
        }

        document.querySelector("#header").innerHTML = `
            <div class="show-hide-menu">
              <img id="show-hide-menu" src="../resources/scroll-to-end-page.svg" />
            </div>
            <div class="div-avatar">
                <img src="${
                  friend.Avatar
                    ? url + "/images" + friend.Avatar
                    : "../resources/avatar-default.png"
                }" alt="Avatar">
                <div class="status${friend.isOnline ? "" : " none"}"></div>
            </div>
            <div class="name_active">
                <div class="name">
                    <span>${friend.FullName}</span>
                </div>
                <div class="active">
                    <span>
                        ${friend.isOnline ? "Online" : "Offline"}
                    </span>
                </div>
            </div>
            `;

        var show_hide_menu = document.querySelector("#show-hide-menu");
        var list = document.querySelector("#list");
        var classList_show_hide_menu = show_hide_menu?.classList;
        var classList_list = list?.classList;

        show_hide_menu.addEventListener("click", () => {
          if (
            classList_list.contains("none") &&
            classList_show_hide_menu.contains("show")
          ) {
            classList_list.remove("none");
            classList_show_hide_menu.remove("show");
          } else {
            classList_list.add("none");
            classList_show_hide_menu.add("show");
          }
        });
      } else {
        handleNotConnect();
      }
    }
  );
};

const showMessage = async (messages, get_more) => {
  if (get_more) {
    messages.reverse();
  }
  var div = messages.map((line) => {
    var sub = line.map((e) => {
      let text_message = document.createElement("div");
      text_message.className = "text-message";

      let images_message = document.createElement("div");
      images_message.className = "images-message";
      let div_images = e.Images.map((image) => {
        let img = document.createElement("img");
        img.src = `${url}/${image.urlImage}`;
        img.onclick = function () {
          window.open(`${url.concat(image.urlImage)}`, "_blank");
        };

        return img;
      });
      div_images.forEach((div) => {
        images_message.appendChild(div);
      });
      if (e.Images.length > 0) {
        text_message.appendChild(images_message);
      }

      let files_message = document.createElement("div");
      files_message.className = "files-message";
      let div_files = e.Files.map((file) => {
        let file_message = document.createElement("div");
        file_message.className = "file-message";
        file_message.onclick = function () {
          window.open(`${url.concat(file.urlFile)}`);
        };

        let img = document.createElement("img");
        img.src = "../resources/icon-document.svg";
        let p = document.createElement("p");
        p.textContent = file.FileName;

        file_message.appendChild(img);
        file_message.appendChild(p);

        return file_message;
      });
      div_files.forEach((div) => {
        files_message.appendChild(div);
      });
      if (e.Files.length > 0) {
        text_message.appendChild(files_message);
      }

      let content = e.Content.replace(/\n/g, "<br>");

      let content_message = document.createElement("span");
      content_message.innerHTML = `${content || ""}`;

      if (content) {
        text_message.appendChild(content_message);
      }

      return text_message;
    });

    let _line = document.createElement("div");
    _line.className = `line${line[0].MessageType === 1 ? " me" : ""}`;

    let time = document.createElement("div");
    time.className = "time";
    time.innerHTML = `
        <span>${line[0].CreatedAt ? formatTime(line[0].CreatedAt) : ""}</span>
      `;
    _line.appendChild(time);

    let div_avatar_and_messages_and_send = document.createElement("div");
    div_avatar_and_messages_and_send.className =
      "div-avatar-and-messages-and-send";

    let div_avatar_and_messages = document.createElement("div");
    div_avatar_and_messages.className = "div-avatar-and-messages";

    let img = document.createElement("img");
    img.src = `${
      line[0].Avatar
        ? url + "/images" + line[0].Avatar
        : "../resources/avatar-default.png"
    }`;
    div_avatar_and_messages.appendChild(img);

    let messages = document.createElement("div");
    messages.className = "messages";
    sub.forEach((e) => {
      messages.appendChild(e);
    });
    div_avatar_and_messages.appendChild(messages);
    div_avatar_and_messages_and_send.appendChild(div_avatar_and_messages);

    let status_send = document.createElement("div");
    status_send.className = "status-send";
    status_send.innerHTML = `<img src="../resources/status-send.svg" alt="Status send">`;
    div_avatar_and_messages_and_send.appendChild(status_send);

    _line.appendChild(div_avatar_and_messages_and_send);

    return _line;
  });

  let in_content = document.querySelector("#in-content");

  if (!get_more) {
    in_content.innerHTML = ``;

    div_scroll = document.createElement("div");
    div_scroll.className = "scroll-to-end-page none";
    div_scroll.id = "scroll-to-end-page";
    div_scroll.innerHTML = `<img src="../resources/scroll-to-end-page.svg" alt="Scroll">`;

    div.push(div_scroll);
    div.reverse();
  }

  if (get_more) {
    let positionScrollCurrent = in_content.scrollHeight;

    div.forEach((e) => {
      in_content.insertBefore(e, in_content.firstChild);
    });

    in_content.scrollTop = in_content.scrollHeight - positionScrollCurrent;
  }

  const toEndPage = () => {
    in_content.scrollTop = in_content.scrollHeight;
  };

  if (!get_more) {
    div.forEach((e) => {
      in_content.insertBefore(e, in_content.firstChild);
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });

    toEndPage();
  }

  let scroll_to_end_page = document.querySelector("#scroll-to-end-page");

  scroll_to_end_page?.addEventListener("click", () => {
    toEndPage();
  });

  in_content?.addEventListener("scroll", () => {
    var scrollTop = in_content.scrollTop;
    var scrollHeight = in_content.scrollHeight - in_content.clientHeight;
    var distance = scrollHeight - scrollTop;
    if (distance >= 400) {
      scroll_to_end_page?.classList.remove("none");
    } else {
      scroll_to_end_page?.classList.add("none");
    }
  });
};

const getMessage = async (friendID, get_more) => {
  await getData(
    `${url}/message/get-message?FriendID=${friendID}${
      get_more ? "&get-more=true" : ""
    }
    `,
    "GET",
    getItem("tokenJWT")
  ).then(async (response) => {
    if (response.status === 200) {
      var data = await response.json();
      if (data.data.length > 0 || get_more) {
        if (!get_more) {
          message_latest = data.data[data.data.length - 1];
        }
        var messages = [];
        data.data.forEach((item, index) => {
          if (index === 0) {
            messages.push([item]);
          } else {
            var itemLast = messages[messages.length - 1];
            var lastItemLast = itemLast[itemLast.length - 1];

            if (item.MessageType !== lastItemLast.MessageType) {
              messages.push([item]);
            } else {
              var createAtFirst = new Date(item.CreatedAt);
              var createAtSecond = new Date(lastItemLast.CreatedAt);
              if ((createAtFirst - createAtSecond) / 1000 / 60 > 2) {
                messages.push([item]);
              } else {
                itemLast.push(item);
              }
            }
          }
        });

        showMessage(messages, get_more);
      } else if (!get_more || data.data.length === 0) {
        document.querySelector("#in-content").innerHTML = `
          <div class="empty-message">
              <img src="../resources/empty_message.svg" alt="Empty message">
              <span>Chưa có tin nhắn...</span>
          </div>
        `;
      }
    } else {
      handleNotConnect();
    }
  });
};

const formatTime = (inputDate) => {
  var date = new Date(inputDate);

  var today = new Date();
  today.setHours(0, 0, 0, 0);

  var inputDay = new Date(date);
  inputDay.setHours(0, 0, 0, 0);

  if (inputDay.getTime() === today.getTime()) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var timeString = hours + ":" + minutes + " " + ampm;

    return timeString;
  } else {
    var options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    var dateString = date.toLocaleString("en-US", options);

    return dateString;
  }
};

const loadOptions = () => {
  document.querySelector("#options").innerHTML = `
    <div class="add-file">
        <img id="add-file" src="../resources/btn-add-file.svg" alt="">
        <div class="sub-add-file none" id="sub-add-file">
          <div id="item-add-file" class="item-add-file">
              <span>Gửi ảnh/files</span>
          </div>
      </div>
    </div>
    <div class="input-text">
        <textarea name="input-message" id="input-message" spellcheck="false"
            placeholder="Nhập tin nhắn" autofocus></textarea>
        <div class="emoji">
            <img id='img-emoji' src="../resources/emojy.svg" alt="Emojy">
        </div>
    </div>
    <div class="send-message none" id="send-btn">
        <img src="../resources/btn-send.svg" alt="Send">
    </div>
    `;

  var container_preview = document.querySelector("#container-preview");
  var add_file = document.querySelector("#add-file");
  var sub_add_file = document.querySelector("#sub-add-file");
  var item_add_file = document.querySelector("#item-add-file");
  var file_input = document.querySelector("#file-input");
  var preview = document.querySelector("#preview");
  var add_file_preview = document.querySelector("#add-file-preview");
  var close_container_preview = document.querySelector(
    "#close-container-preview"
  );
  var send_btn = document.querySelector("#send-btn");
  var input_message = document.querySelector("#input-message");

  add_file.addEventListener("click", function () {
    let classList = sub_add_file.classList;
    if (classList.contains("none")) {
      classList.remove("none");
    } else {
      classList.add("none");
    }
  });

  document.addEventListener("click", function (event) {
    if (!add_file.contains(event.target)) {
      sub_add_file.classList.add("none");
    }
  });

  item_add_file.addEventListener("click", function () {
    file_input.click();
  });

  add_file_preview.addEventListener("click", () => {
    file_input.click();
  });

  file_input.addEventListener("change", (event) => {
    let status = !0;
    Array.from(event.target.files).forEach((value, index) => {
      const maxSize = 10 * 1024 * 1024; // 10 MB
      if (value.size > maxSize) {
        status = !1;
      } else {
        documents.set(index + documents.size, value);
      }
    });
    if (!status) {
      alert("File không được vượt quá 10MB");
    }
    preview.innerHTML = "";

    documents.forEach((value, key) => {
      var classList = container_preview.classList;
      if (classList.contains("none")) {
        classList.remove("none");
      }
      var send_btn = document.querySelector("#send-btn");
      if (send_btn) {
        send_btn.classList.remove("none");
      }

      input_message.focus();

      const reader = new FileReader();
      reader.onload = function (e) {
        const previewItem = document.createElement("div");
        previewItem.className = "item-preview";
        if (!value.type.startsWith("image/")) {
          previewItem.className = "item-preview not-image";
        }

        const img = document.createElement("img");
        if (value.type.startsWith("image/")) {
          img.src = e.target.result;
        } else {
          img.src = "../resources/icon-document.svg";
        }

        const p = document.createElement("p");
        p.textContent = value.name;

        const removeButton = document.createElement("div");
        removeButton.className = "button-remove";

        const removeButtonImg = document.createElement("img");
        removeButtonImg.src = "../resources/remove-value-input.svg";

        removeButton.addEventListener("click", function () {
          previewItem.remove();
          documents.delete(key);
          updateFileInput(documents);

          if (documents.size === 0 && input_message.value.trim() === "") {
            if (send_btn) {
              send_btn.classList.add("none");
            }
          }
        });

        previewItem.appendChild(img);
        previewItem.appendChild(p);
        removeButton.appendChild(removeButtonImg);
        previewItem.appendChild(removeButton);
        preview.appendChild(previewItem);
      };
      reader.readAsDataURL(value);
    });

    if (preview.style.width === "") {
      preview.style.width = `${preview.offsetWidth}px`;
    }

    const updateFileInput = (documents) => {
      const dataTransfer = new DataTransfer();
      documents.forEach((file) => dataTransfer.items.add(file));
      file_input.files = dataTransfer.files;
    };
  });

  close_container_preview.addEventListener("click", () => {
    var classList = container_preview.classList;
    if (!classList.contains("none")) {
      documents.clear();
      classList.add("none");

      var send_btn = document.querySelector("#send-btn");
      var input_message = document.querySelector("#input-message");
      if (input_message.value.trim() === "") {
        if (send_btn) {
          send_btn.classList.add("none");
        }
      }
    }
  });

  document.querySelector("#img-emoji").addEventListener("click", () => {
    var emoji_container = document.querySelector("#emoji-container");
    var classList = emoji_container.classList;
    if (classList.contains("none")) {
      classList.remove("none");
      return;
    }
    classList.add("none");
  });
};

const createNameChanel = (param1, param2) => {
  if (param1.localeCompare(param2) > 0) {
    return `${param2}${param1}`;
  }
  return `${param1}${param2}`;
};

const checkInput = (input) => {
  let send_btn = document.querySelector("#send-btn");
  if (input.value.trim() !== "" || documents.size > 0) {
    send_btn.classList.remove("none");
  } else {
    send_btn.classList.add("none");
  }
};

let scrollHandler = null;

const handleScroll = async (friendID) => {
  return async (event) => {
    var scrollTop = event.target.scrollTop;

    if (scrollTop === 0) {
      await getMessage(friendID, true);
    }
  };
};

const loadContent = async (friendID) => {
  document.querySelector("#content").classList.remove("none");

  await getHeader(friendID);
  await getMessage(friendID);
  loadOptions();
  loadEmoji();

  let in_content = document.querySelector("#in-content");

  if (scrollHandler) {
    in_content.removeEventListener("scroll", scrollHandler);
  }

  scrollHandler = await handleScroll(friendID);
  in_content.addEventListener("scroll", scrollHandler);

  function init() {
    var send_btn = document.querySelector("#send-btn");

    let ws;

    function showMessage(message) {
      getMessage(friendID);
    }

    function init() {
      let uuid = getItem("uuid");
      if (uuid === null) {
        removeItem("tokenJWT");
        window.location.href = "../signin/index.html";
      }
      if (ws) {
        ws.onerror = ws.onopen = ws.onclose = null;
        ws.close();
      }

      var urlSocket = url.replace('http://', 'ws://')
      urlSocket = urlSocket.replace('/api', ':9090')
      ws = new WebSocket(`${urlSocket}`);
      ws.onopen = () => {
        console.log("Connection opened!");
        ws.send(
          JSON.stringify({
            type: "join",
            token: getItem("tokenJWT"),
            channel: createNameChanel(uuid, friendID),
          })
        );
      };
      ws.onmessage = (value) => {};
      ws.onclose = function (e) {
        console.log(e);
        ws = null;
      };
      ws.onerror = (e) => {
        console.log(e);
      };
    }

    var input_message = document.querySelector("#input-message");

    input_message.addEventListener("input", () => {
      checkInput(input_message);
    });

    input_message.addEventListener("keypress", function (event) {
      if (event.shiftKey && event.key === "Enter") {
        var input = event.target;
        var startPos = input.selectionStart;
        var endPos = input.selectionEnd;
        var text = input.value;
        var newText =
          text.substring(0, startPos) + "\n" + text.substring(endPos);
        input.value = newText;
        input.selectionStart = startPos + 1;
        input.selectionEnd = startPos + 1;
        input.scrollTop = input.scrollHeight;
        event.preventDefault();
      } else if (event.key === "Enter") {
        if (input_message.value.trim() !== "" || documents.size > 0) {
          sendMessage();
        }
        event.preventDefault();
      }
    });

    function toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    }

    const sendMessage = async function () {
      if (!ws) {
        console.log("No WebSocket connection :(");
        return;
      }
      let uuid = getItem("uuid");
      if (uuid === null) {
        removeItem("tokenJWT");
        window.location.href = "../signin/index.html";
      }

      const images = [];
      const files = [];

      documents.forEach((document) => {
        if (document.type.startsWith("image/")) {
          images.push(document);
        } else {
          files.push(document);
        }
      });

      // Xử lý các tệp ảnh
      const imagePromises = images.map(async (file) => {
        const base64 = await toBase64(file);
        return {
          name: file.name,
          type: file.type,
          data: base64,
        };
      });

      // Xử lý các tệp không phải ảnh
      const filePromises = files.map(async (file) => {
        const base64 = await toBase64(file);
        return {
          name: file.name,
          type: file.type,
          data: base64,
        };
      });

      let objectSend = {
        type: "message",
        channel: createNameChanel(uuid, friendID),
        token: getItem("tokenJWT"),
        body: JSON.stringify({
          FriendID: friendID,
          Content: input_message.value,
        }),
        files: await Promise.all(filePromises),
        images: await Promise.all(imagePromises),
      };

      ws.send(JSON.stringify(objectSend));
      document.querySelector("#send-btn")?.classList.add("none");

      // showMessage(input_message.value);
      input_message.value = "";
      input_message.focus();

      var close_container_preview = document.querySelector(
        "#close-container-preview"
      );
      close_container_preview.click();
    };

    send_btn.addEventListener("click", () => {
      if (input_message.value.trim() !== "" || documents.size > 0) {
        sendMessage();
      }
    });

    init();
  }
  init();
};

const changeParams = (name, value) => {
  var url = new URL(window.location.href);
  if (value === undefined) {
    url.searchParams.delete(name);
  } else {
    url.searchParams.set(name, value);
  }
  history.pushState({}, document.title, url);
};

const handleNotConnect = () => {
  alert("Không thể kết nối tới server, vui lòng kết nối lại!");
  signout();
};

const noneFocusAndFocus = (param = undefined) => {
  let elementFoucs = document
    .querySelector("#list-items")
    ?.querySelector(".focus");

  if (param === undefined) {
    if (elementFoucs) {
      elementFoucs.classList.remove("focus");
    }
  } else {
    if (elementFoucs) {
      elementFoucs.classList.remove("focus");
    }

    let element = document.querySelector(`[data-friendid="${param}"]`);
    if (element) {
      element.classList.add("focus");
    }
  }
};

const selectFriend = async (friendID) => {
  if (getParam("FriendID") === friendID) {
    document.querySelector("#content").classList.add("none");
    changeParams("FriendID");
    noneFocusAndFocus();
    return;
  }
  message_latest = null;
  changeParams("FriendID", friendID);
  noneFocusAndFocus(friendID);
  await loadContent(friendID);
};

const loadEmoji = () => {
  html = emoji
    .map((e) => {
      return `
            <div class="emoji">${e}</div>
        `;
    })
    .join("");

  var input_message = document.querySelector("#input-message");
  var emoji_container = document.querySelector("#emoji-container");
  emoji_container.innerHTML = html;

  emoji_container.querySelectorAll("div").forEach((e) => {
    e.addEventListener("click", () => {
      input_message.value = input_message.value + e.textContent;
      checkInput(input_message);
      input_message.focus();
    });
  });
};

const showDataToListFriend = (data, type) => {
  var html = "";
  if (data.length > 0) {
    html = data
      .map((item) => {
        return `
          <div class="item${
            type === "search"
              ? ""
              : getParam("FriendID") === item.FriendID
              ? " focus"
              : ""
          }" data-FriendID=${item.FriendID} data-Username=${
          item.Username
        } onclick="selectFriend('${item.FriendID}')">
              <div class="avatar">
                  <img src="${
                    item.Avatar
                      ? url + "/images" + item.Avatar
                      : "../resources/avatar-default.png"
                  }" alt="Avatar">
                  <div class="status ${item.isOnline ? "" : "none"}"></div>
              </div>
              <div class="name_message">
                  <div class="name">
                      <span>${item.FullName || ""}</span>
                  </div>
                  <div class="message${type === "search" ? " none" : ""}">
                      <span>${
                        item.isSend === 1
                          ? item.Content === ""
                            ? item.Files.length > 0 || item.Images.length > 0
                              ? item.MessageType !== null
                                ? item.MessageType === 0
                                  ? "Đã nhận tài liệu"
                                  : "Đã gửi tài liệu"
                                : "Chưa có tin nhắn"
                              : ""
                            : item.UserID !== getItem("uuid")
                            ? item.Content
                            : `Bạn: ${item.Content}`
                          : "Chưa có tin nhắn"
                      }</span>
                  </div>
              </div>
              <div class="other none">
                  <div class="top">
                      <div class="notify">
                          <span>99</span>
                      </div>
                      <div class="mute">
                          <img src="../resources/icon-mute.svg" alt="Mute">
                      </div>
                  </div>
                  <div class="time-detail">
                      <span>Yesterday</span>
                  </div>
              </div>
          </div>
          `;
      })
      .join("");
  } else if (data.length === 0 && !type) {
    html = `<span>Danh sách bạn bè trống</span>`
  }

  list_items.innerHTML = html;
};

const loadListFriend = async () => {
  await getData(`${url}/message/list-friend`, "GET", getItem("tokenJWT")).then(
    async (response) => {
      if (response.status === 200) {
        var data = await response.json();
        console.log(data);
        showDataToListFriend(data.data);
      } else {
        handleNotConnect();
      }
    }
  );
};

const showContentInListFriend = (friendID, data) => {
  var div_friend = document.querySelector(`[data-friendid="${friendID}"]`);
  if (div_friend) {
    div_friend.querySelector(".message > span").innerHTML =
      data.Content === ""
        ? data.Files.length > 0 || data.Images.length > 0
          ? data.UserID === friendID
            ? "Đã nhận tài liệu"
            : "Đã gửi tài liệu"
          : ""
        : data.UserID === friendID
        ? data.Content
        : `Bạn: ${data.Content}`;
  }
};

const showNewMessage = (message_new) => {
  var createAtFirst = new Date(message_latest.CreatedAt);
  var createAtSecond = new Date(message_new.CreatedAt);

  let text_message = document.createElement("div");
  text_message.className = "text-message";

  let images_message = document.createElement("div");
  images_message.className = "images-message";
  let div_images = message_new.Images.map((image) => {
    let img = document.createElement("img");
    img.src = `${url}/${image.urlImage}`;
    img.onclick = function () {
      window.open(`${url.concat(image.urlImage)}`, "_blank");
    };

    return img;
  });
  div_images.forEach((div) => {
    images_message.appendChild(div);
  });
  if (message_new.Images.length > 0) {
    text_message.appendChild(images_message);
  }

  let files_message = document.createElement("div");
  files_message.className = "files-message";
  let div_files = message_new.Files.map((file) => {
    let file_message = document.createElement("div");
    file_message.className = "file-message";
    file_message.onclick = function () {
      window.open(`${url.concat(file.urlFile)}`);
    };

    let img = document.createElement("img");
    img.src = "../resources/icon-document.svg";
    let p = document.createElement("p");
    p.textContent = file.FileName;

    file_message.appendChild(img);
    file_message.appendChild(p);

    return file_message;
  });
  div_files.forEach((div) => {
    files_message.appendChild(div);
  });
  if (message_new.Files.length > 0) {
    text_message.appendChild(files_message);
  }

  let content = message_new.Content.replace(/\n/g, "<br>");

  let content_message = document.createElement("span");
  content_message.innerHTML = `${content || ""}`;

  if (content) {
    text_message.appendChild(content_message);
  }

  if (
    message_latest.MessageType !== message_new.MessageType ||
    (createAtSecond - createAtFirst) / 1000 / 60 > 2
  ) {
    let _line = document.createElement("div");
    _line.className = `line${message_new.MessageType === 1 ? " me" : ""}`;

    let time = document.createElement("div");
    time.className = "time";
    time.innerHTML = `
        <span>${
          message_new.CreatedAt ? formatTime(message_new.CreatedAt) : ""
        }</span>
      `;
    _line.appendChild(time);

    let div_avatar_and_messages_and_send = document.createElement("div");
    div_avatar_and_messages_and_send.className =
      "div-avatar-and-messages-and-send";

    let div_avatar_and_messages = document.createElement("div");
    div_avatar_and_messages.className = "div-avatar-and-messages";

    let img = document.createElement("img");
    img.src = `${
      message_new.Avatar
        ? url + "/images" + message_new.Avatar
        : "../resources/avatar-default.png"
    }`;
    div_avatar_and_messages.appendChild(img);

    let messages = document.createElement("div");
    messages.className = "messages";
    messages.appendChild(text_message);

    div_avatar_and_messages.appendChild(messages);
    div_avatar_and_messages_and_send.appendChild(div_avatar_and_messages);

    let status_send = document.createElement("div");
    status_send.className = "status-send";
    status_send.innerHTML = `<img src="../resources/status-send.svg" alt="Status send">`;
    div_avatar_and_messages_and_send.appendChild(status_send);

    _line.appendChild(div_avatar_and_messages_and_send);

    (function toEndPage() {
      let in_content = document.querySelector("#in-content");
      if (
        Math.abs(
          Math.floor(in_content.scrollHeight - in_content.scrollTop) -
            Math.floor(in_content.clientHeight)
        ) < 5
      ) {
        document.querySelector("#in-content").appendChild(_line);
        in_content.scrollTop = in_content?.scrollHeight;
        return;
      }
      document.querySelector("#in-content").appendChild(_line);
    })();
  } else {
    let messages = document.querySelectorAll(
      ".div-avatar-and-messages > .messages"
    );
    let messages_need_update = messages[messages.length - 1];

    (function toEndPage() {
      let in_content = document.querySelector("#in-content");
      if (
        Math.abs(
          Math.floor(in_content.scrollHeight - in_content.scrollTop) -
            Math.floor(in_content.clientHeight)
        ) < 5
      ) {
        messages_need_update.appendChild(text_message);
        in_content.scrollTop = in_content?.scrollHeight;
        return;
      }
      messages_need_update.appendChild(text_message);
    })();
  }

  message_latest = message_new;
};

const sendConnect = () => {
  let ws;

  function init() {
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }

    var urlSocket = url.replace('http://', 'ws://')
    urlSocket = urlSocket.replace('/api', ':9090')
    console.log(urlSocket);
    ws = new WebSocket(`${urlSocket}`);
    ws.onopen = () => {
      console.log("Connection opened!");
      ws.send(
        JSON.stringify({
          type: "connect",
          token: getItem("tokenJWT"),
        })
      );
    };
    ws.onmessage = (value) => {
      data = JSON.parse(value.data);
      if (data.status !== 1) {
        signout();
        return;
      }
      let uuid = getItem("uuid");
      if (uuid === null) {
        removeItem("tokenJWT");
        window.location.href = "../signin/index.html";
      }
      if (data.type === "connect") {
        friend_id_online = data.data.UserID;
        var div_friend = document.querySelector(
          `[data-friendid="${friend_id_online}"]`
        );
        if (div_friend) {
          var classNameDivFriend =
            div_friend.querySelector(".avatar > .status").classList;
          if (classNameDivFriend.contains("none")) {
            classNameDivFriend.remove("none");
          }
        }
        if (getParam("FriendID") === friend_id_online) {
          var classNameHeaderAvatar =
            document.querySelector("#header .status").classList;
          if (classNameHeaderAvatar.contains("none")) {
            classNameHeaderAvatar.remove("none");
          }
        }
      } else if (data.type === "message") {
        var id_friend = data.data.channel;
        id_friend = id_friend.replace(uuid, "");
        showContentInListFriend(id_friend, data.data);
        if (getParam("FriendID") === id_friend) {
          if (data.data.UserID === getItem("uuid")) {
            data.data.MessageType = 1;
          }
          showNewMessage(data.data);
          if (data.data.MessageType === 1) {
            (function toEndPage() {
              let in_content = document.querySelector("#in-content");
              in_content.scrollTop = in_content?.scrollHeight;
            })();
          }
        }
      }
    };
    ws.onclose = function (e) {
      console.log(e);
      ws = null;
    };
    ws.onerror = (e) => {
      console.error(e);
    };
  }

  init();
};

const loadProfile = () => {
  try {
    getData(`${url}/user/info`, "GET", getItem("tokenJWT")).then(
      async (response) => {
        if (response.status === 200) {
          let data = await response.json();
          console.log(data);

          let avatar = document.querySelector("#avatar");
          let fullname = document.querySelector("#fullname");

          if (data.data.Avatar) {
            avatar.src = `${url}/images${data.data.Avatar}`;
          }
          fullname.textContent = data.data.FullName;
        } else {
          console.log("fail");
        }
      }
    );
  } catch (e) {
    handleNotConnect();
  }
};

const load = () => {
  sendConnect();
  loadProfile();
  loadListFriend();
  var friendID = getParam("FriendID");

  if (friendID) {
    loadContent(friendID);
  }
};

window.onload = () => {
  var menu = document.querySelector("#menu");
  var sub_menu = document.querySelector("#sub-menu");

  menu.addEventListener("click", function () {
    let classList = sub_menu.classList;
    if (classList.contains("none")) {
      classList.remove("none");
    } else {
      classList.add("none");
    }
  });

  document.addEventListener("click", function (event) {
    if (!menu.contains(event.target)) {
      sub_menu.classList.add("none");
    }
  });

  var input_search = document.querySelector("#input-search");
  var btn_search = document.querySelector("#btn-search");
  var btn_can_search = document.querySelector("#btn-can-search");
  var btn_remove_value_input = document.querySelector(
    "#btn-remove-value-input"
  );
  var total_result_search = document.querySelector("#total-result-search");

  function debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
      const context = this;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }

  async function handleSearch(event) {
    const searchName = event.target.value;

    if (searchName.trim() !== "") {
      btn_search.classList.add("none");
      btn_can_search.classList.remove("none");
      btn_remove_value_input.classList.remove("none");
      await getData(
        `${url}/message/list-friend?s=${searchName}`,
        "GET",
        getItem("tokenJWT")
      )
        .then(async (response) => {
          if (response.status === 200) {
            let data = await response.json();
            console.log(data);
            showDataToListFriend(data.data, "search");
            total_result_search.textContent = `${data.data.length} result`;
            total_result_search.classList.remove("none");
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
    if (searchName === "") {
      btn_search.classList.remove("none");
      btn_can_search.classList.add("none");
      btn_remove_value_input.classList.add("none");
      await getData(`${url}/message/list-friend`, "GET", getItem("tokenJWT"))
        .then(async (response) => {
          if (response.status === 200) {
            let data = await response.json();
            console.log(data);
            showDataToListFriend(data.data);
            total_result_search.classList.add("none");
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }

  input_search.addEventListener("input", debounce(handleSearch, 200));

  btn_can_search.addEventListener("click", async () => {
    const searchName = input_search.value;

    if (searchName.trim() !== "") {
      await getData(
        `${url}/message/list-friend?s=${searchName}`,
        "GET",
        getItem("tokenJWT")
      )
        .then(async (response) => {
          console.log(response);
          showDataToListFriend(data.data, "search");
          total_result_search.textContent = `${data.data.length} result`;
          total_result_search.classList.remove("none");
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });

  btn_remove_value_input.addEventListener("click", async () => {
    btn_search.classList.remove("none");
    btn_can_search.classList.add("none");
    btn_remove_value_input.classList.add("none");
    input_search.value = "";
    input_search.focus();

    await getData(`${url}/message/list-friend`, "GET", getItem("tokenJWT"))
      .then(async (response) => {
        if (response.status === 200) {
          let data = await response.json();
          console.log(data);
          showDataToListFriend(data.data);
          total_result_search.classList.add("none");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  });
};

var list_items = document.querySelector("#list-items");
var documents = new Map();
var message_latest = null;

autosize(document.getElementById("input-message"));
load();
