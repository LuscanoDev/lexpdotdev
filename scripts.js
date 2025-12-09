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