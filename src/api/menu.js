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

// const menu = await getMenu()
const gitURL = 'https://github.ybxzf.cn/static/musicMenu/'
const menu = [
    {
        "name": "一千年以后 - 林俊杰.mp3",
        "url": gitURL + '/' + "一千年以后 - 林俊杰.mp3",
        "lrc": gitURL + '/' + "一千年以后 - 林俊杰.lrc",
        "like": false,
    },
    {
        "name": "Butter-Fly伴奏.mp3",
        "url": gitURL + '/' + "Butter-Fly伴奏.mp3",
        "lrc": gitURL + '/' + "Butter-Fly伴奏.mp3",
        "like": false,
    },
]

export { menu }
