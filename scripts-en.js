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
            return minutes + " minute" + ((minutes != 1) ? "s" : "") + " ago";
        }
        if (time_diff >= SEC_IN_HOUR && time_diff < SEC_IN_DAY) {
            let hours = Math.round(time_diff / SEC_IN_HOUR);
            return hours + " hour" + ((hours != 1) ? "s" : "") + " ago";
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
        userLinkElem.textContent = (relative_time != null) ? relative_time : "now playing...";
        dateElem.replaceChildren(userLinkElem);

        albumcoverElem.src = imageLink;

        console.log(
            "Artist: " + artist + "\n" +
            "Track: " + track + "\n" +
            "Date: " + relative_time + "\n" +
            "Now playing: " + now_playing +
            "Liked: " + loved
        );
    } finally {
        playerFrame.style.opacity = '1';
    }
}

loadplayer();

const banner = document.querySelector('.bannerimg');
const randomN = Math.floor(Math.random() * 5) + 5; // nos não falamos sobre o 1.png...
banner.src = `/img/banners/${randomN}.png`;