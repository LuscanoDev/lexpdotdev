async function loadplayer() {
    const playerFrame = document.getElementById('player-frame');
    const albumcoverElem = document.getElementById('album-cover');
    playerFrame.style.opacity = '0.5';
    albumcoverElem.src = "/img/placeholdermusic.png";

    const LASTFM_API_KEY = "eed9554ea30c7d16192dcda32547d745";
    const username = "lexpdev"; // change username here
    const url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&extended=true&api_key="
        + LASTFM_API_KEY + "&limit=1&user=" + username;

    async function httpGet(url) {
        const resp = await fetch(url);
        if (!resp.ok) throw new Error('HTTP error ' + resp.status);
        return await resp.text();
    }

    // converts unix time to relative time text (eg. 2 hours ago)
    function relativeTime(time, time_text) {
        var time_now = Math.round(Date.now() / 1000);
        var time_diff = time_now - time;

        let SEC_IN_MIN = 60;
        let SEC_IN_HOUR = SEC_IN_MIN * 60;
        let SEC_IN_DAY = SEC_IN_HOUR * 24;

        if (time_diff < SEC_IN_HOUR) {
            let minutes = Math.round(time_diff / SEC_IN_MIN);
            return minutes + " minuto" + ((minutes != 1) ? "s" : "") + " atrás";
        }
        if (time_diff >= SEC_IN_HOUR && time_diff < SEC_IN_DAY) {
            let hours = Math.round(time_diff / SEC_IN_HOUR);
            return hours + " hora" + ((hours != 1) ? "s" : "") + " atrás";
        }
        if (time_diff >= SEC_IN_DAY)
            return time_text;
    }

    try {
        var text = await httpGet(url);
        var json = JSON.parse(text);
        var last_track = json.recenttracks.track[0];
        var track = last_track.name;
        var trackLink = last_track.url;
        var artistLink = last_track.artist.url;
        var artist = last_track.artist.name;
        let relative_time = null;

        if (last_track.date) {
            var unix_date = last_track.date.uts;
            var date_text = last_track.date["#text"];
            relative_time = relativeTime(unix_date, date_text);
        }

        var now_playing = (last_track["@attr"] == undefined) ? false : true;
        var imageLink = last_track.image[2]["#text"];
        if (!imageLink) {
            imageLink = "/img/placeholdermusic.png";
        }
        var loved = last_track.loved == "1";

        const trackElem = document.getElementById('track');
        const artistElem = document.getElementById('artist');
        const dateElem = document.getElementById('date');

        const trackLinkElem = document.createElement('a');
        trackLinkElem.id = "track";
        trackLinkElem.href = trackLink;
        trackLinkElem.target = "_blank";
        trackLinkElem.textContent = track;
        trackElem.replaceChildren(trackLinkElem);

        const artistLinkElem = document.createElement('a');
        artistLinkElem.id = 'artist';
        artistLinkElem.href = artistLink;
        artistLinkElem.target = "_blank";
        artistLinkElem.textContent = artist;
        artistElem.replaceChildren(artistLinkElem);

        const userLinkElem = document.createElement('span');
        userLinkElem.textContent = (relative_time != null) ? relative_time : "tocando agora...";
        dateElem.replaceChildren(userLinkElem);

        albumcoverElem.src = imageLink;

        console.log(
            "Artista: " + artist + "\n" +
            "Faixa: " + track + "\n" +
            "Data: " + relative_time + "\n" +
            "Tocando: " + now_playing + "\n" +
            "Curtida: " + loved
        );
    } finally {
        playerFrame.style.opacity = '1';
    }
}

loadplayer();

document.addEventListener('DOMContentLoaded', function () {
    const photoContainer = document.querySelector('.photo-container');
    const photos = document.querySelectorAll('.photossection img');
    const photoOverlay = document.querySelector('.photo-overlay');
    const photoClose = document.querySelector('.photo-close');
    const photoImg = document.querySelector('.photoimg');
    const photoDescription = document.querySelector('.photodescription');

    photoClose.addEventListener('click', function () {
        photoOverlay.style.display = 'none';
    });

    photoOverlay.addEventListener('click', function (e) {
        if (e.target === photoOverlay) {
            photoOverlay.style.display = 'none';
        }
    });


    photoContainer.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    photos.forEach(photo => {
        photo.addEventListener('click', function (e) {
            e.preventDefault();

            const title = photo.getAttribute('ptitle');
            const description = photo.getAttribute('pdescription');
            const camera = photo.getAttribute('camera');
            const date = photo.getAttribute('date');
            const location = photo.getAttribute('location');
            const fullres = photo.getAttribute('fullres');
            const preview = photo.src;

            photoImg.innerHTML = `<a href="${fullres}" target="_blank"><img src="${preview}" alt="${title}"></a>`;

            let descriptionHTML = `
                    <h2 class="galleryh2">${title}</h2>
                    <p>${description}</p>
                `;

            if (camera) {
                descriptionHTML += `
                        <div class="photoinfo">
                            <img src="/img/camera.svg"> <span>${camera}</span>
                        </div>
                    `;
            }

            if (date) {
                descriptionHTML += `
                        <div class="photoinfo">
                            <img src="/img/calendar.svg"> <span>${date}</span>
                        </div>
                    `;
            }

            if (location) {
                descriptionHTML += `
                        <div class="photoinfo">
                            <img src="/img/location.svg"> <span>${location}</span>
                        </div>
                    `;
            }

            descriptionHTML += `
                        <p class="note">aperte fora da tela ou no X para sair da imagem<br><br>clique na imagem para ver ela em melhor qualidade</p>
                `;

            photoDescription.innerHTML = descriptionHTML;
            photoOverlay.style.display = 'flex';
        });
    });
});

const banner = document.querySelector('.bannerimg');
const randomN = Math.floor(Math.random() * 5) + 5; // nos não falamos sobre o 1.png...
banner.src = `/img/banners/${randomN}.png`;

// oneko.js: https://github.com/adryd325/oneko.js

(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement("div");
  let persistPosition = true;

  let nekoPosX = 32;
  let nekoPosY = 32;
  
  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const nekoSpeed = 10;
  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
  };

  function init() {
    let nekoFile = "/oneko.gif"
    const curScript = document.currentScript
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat
    }
    if (curScript && curScript.dataset.persistPosition) {
      if (curScript.dataset.persistPosition === "") {
        persistPosition = true;
      } else {
        persistPosition = JSON.parse(curScript.dataset.persistPosition.toLowerCase());
      }
    }
  
    if (persistPosition) {
      let storedNeko = JSON.parse(window.localStorage.getItem("oneko"));
      if (storedNeko !== null) {
        nekoPosX = storedNeko.nekoPosX;
        nekoPosY = storedNeko.nekoPosY;
        mousePosX = storedNeko.mousePosX;
        mousePosY = storedNeko.mousePosY;
        frameCount = storedNeko.frameCount;
        idleTime = storedNeko.idleTime;
        idleAnimation = storedNeko.idleAnimation;
        idleAnimationFrame = storedNeko.idleAnimationFrame;
        nekoEl.style.backgroundPosition = storedNeko.bgPos;
      }
    }
  
    nekoEl.id = "oneko";
    nekoEl.ariaHidden = true;
    nekoEl.style.width = "32px";
    nekoEl.style.height = "32px";
    nekoEl.style.position = "fixed";
    nekoEl.style.pointerEvents = "none";
    nekoEl.style.imageRendering = "pixelated";
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = 2147483647;

    nekoEl.style.backgroundImage = `url(${nekoFile})`;
    
    document.body.appendChild(nekoEl);

    document.addEventListener("mousemove", function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });
    
    if (persistPosition) {
      window.addEventListener("beforeunload", function (event) {
        window.localStorage.setItem("oneko", JSON.stringify({
          nekoPosX: nekoPosX,
          nekoPosY: nekoPosY,
          mousePosX: mousePosX,
          mousePosY: mousePosY,
          frameCount: frameCount,
          idleTime: idleTime,
          idleAnimation: idleAnimation,
          idleAnimationFrame: idleAnimationFrame,
          bgPos: nekoEl.style.backgroundPosition
        }));
      });
    }
    
    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    // Stops execution if the neko element is removed from DOM
    if (!nekoEl.isConnected) {
      return;
    }
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
    }
    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      frame();
    }
    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;

    // every ~ 20 seconds
    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
      let avalibleIdleAnimations = ["sleeping", "scratchSelf"];
      if (nekoPosX < 32) {
        avalibleIdleAnimations.push("scratchWallW");
      }
      if (nekoPosY < 32) {
        avalibleIdleAnimations.push("scratchWallN");
      }
      if (nekoPosX > window.innerWidth - 32) {
        avalibleIdleAnimations.push("scratchWallE");
      }
      if (nekoPosY > window.innerHeight - 32) {
        avalibleIdleAnimations.push("scratchWallS");
      }
      idleAnimation =
        avalibleIdleAnimations[
          Math.floor(Math.random() * avalibleIdleAnimations.length)
        ];
    }

    switch (idleAnimation) {
      case "sleeping":
        if (idleAnimationFrame < 8) {
          setSprite("tired", 0);
          break;
        }
        setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) {
          resetIdleAnimation();
        }
        break;
      case "scratchWallN":
      case "scratchWallS":
      case "scratchWallE":
      case "scratchWallW":
      case "scratchSelf":
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) {
          resetIdleAnimation();
        }
        break;
      default:
        setSprite("idle", 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite("alert", 0);
      // count down after being alerted before moving
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction;
    direction = diffY / distance > 0.5 ? "N" : "";
    direction += diffY / distance < -0.5 ? "S" : "";
    direction += diffX / distance > 0.5 ? "W" : "";
    direction += diffX / distance < -0.5 ? "E" : "";
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  init();
})();