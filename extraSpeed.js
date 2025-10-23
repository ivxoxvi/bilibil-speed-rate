// ==UserScript==
// @name         bilibili 视频3倍速
// @version      2025-10-24.1
// @description  无侵入的解锁哔哩哔哩视频三倍速，直接在倍速中选择3x即可。
// @author       vxoxv
// @match        https://www.bilibili.com/video/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/512.png
// ==/UserScript==

(function () {
  "use strict";

  // Extra speed rates you desire
  const userRate = [2.5, 3.0];

  const rateMenuSelector = ".bpx-player-ctrl-playbackrate-menu";
  const rateItemSelector = ".bpx-player-ctrl-playbackrate-menu-item";
  const activeRateItemSelector = ".bpx-state-active";
  const videoSelector = ".bpx-player-video-wrap";

  window.addEventListener("load", () => {
    scriptLog("first try");
    let done = firstTry();
    if (done) {
      scriptLog("done");
    } else {
      scriptLog("add observer");
      addMutationObserver();
    }
  });

  function scriptLog(text, color = "skyblue") {
    console.log(
      `%c [3x video]: ${text}`,
      `color: ${color}; font-weight: bold;`
    );
  }

  function firstTry() {
    try {
      let rateMenu = document.querySelector(rateMenuSelector);
      let template = rateMenu.firstElementChild;
      userRate.forEach((rate) => {
        let item = template.cloneNode(true);
        item.innerText = `${rate}x`;
        item.dataset.value = rate;
        item.style.color = "red";
        rateMenu.appendChild(item);
      });
    } catch (e) {
      scriptLog("first try fail");
      console.log(e);
      return false;
    }
    return true;
  }

  function addMutationObserver() {
    new MutationObserver((mutations, observer) => {
      try {
        for (const mutation of mutations) {
          if (!mutation.addedNodes.length) {
            continue;
          }
          for (const node of mutation.addedNodes) {
            if (node.nodeType !== 1) {
              continue;
            }
            let menu;
            if (node.matches(rateMenuSelector)) {
              menu = node;
            } else {
              menu = node.querySelector(rateMenuSelector);
            }
            if (!menu) {
              continue;
            }
            let template = node.firstElementChild;
            userRate.forEach((rate) => {
              let item = template.cloneNode(true);
              item.innerText = `${rate}x`;
              item.dataset.value = rate;
              item.style.color = "red";
              node.appendChild(item);
            });
            observer.disconnect();
          }
        }
      } catch (e) {
        scriptLog("observe fail");
        console.log(e);
        observer.disconnect();
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
})();
