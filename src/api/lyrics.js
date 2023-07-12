import axios from "axios";
// import Lyric from 'lrc-parser';
import { url } from "@/assets/config/url.json";

// const parser = new Lyric(url + '/周杰伦 - 东风破.lrc', handler);
function handler({ lineNum, txt }) {
    console.log(lineNum, txt);
}
function getLyrics() {
    return axios.get(url + '/周杰伦 - 东风破.lrc')
        .then(response => {
            // const lrcContent = parser.parse(response.data);
            // console.log(lrcContent);
        })
        .catch(error => {
            console.log(error);
        })
}

const lyrics = await getLyrics()

export { lyrics }
