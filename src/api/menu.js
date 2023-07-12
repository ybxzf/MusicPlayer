import axios from "axios";
import { url } from "@/assets/config/url.json";

function getMenu() {
    return axios.get(url)
        .then(response => {
            const musicList = []
            const regex = /<a.*?>(.*?)<\/a>/g;
            let match;
            while ((match = regex.exec(response.data)) !== null) {
                const mp3 = decodeURIComponent(match[1]);
                if (mp3.includes('.mp3') || mp3.includes('.flac')) {
                    musicList.push({
                        "name": mp3,
                        "url": url + '/' + mp3,
                        "lrc": url + '/' + mp3.slice(0, -4) + '.lrc',
                        "like": false,
                    })
                }
            }
            return musicList
        })
        .catch(error => {
            console.log(error);
        })
}

const menu = await getMenu()

export { menu }
