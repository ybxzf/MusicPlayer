<template>
    <div>
        <div style="width: 100vw;height:50vh;border: 1px solid;">
            <div class="detail">
                <div class="song-title">
                    <p ref="song">{{ song }}</p>
                    <p ref="singer">{{ singer }}</p>
                </div>
                <div class="wrapper">
                    <ul class="content">
                        <li v-for="(item, index) of ms" :key=item.index>{{ item.c }}</li>
                    </ul>
                </div>
            </div>
        </div>
        <audio src="http://10.242.59.150:444/周杰伦 - 东风破.mp3" ref="audio" @play="datas.onPlay" @error="datas.onError"
            @waiting="datas.onWaiting" @pause="datas.onPause" @timeupdate="datas.onTimeupdate"
            @loadedmetadata="datas.onLoadedmetadata" controls>
        </audio>

        <el-button type="success" @click="play">播放</el-button>
        <el-button type="success" @click="pause">暂停</el-button>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { lyrics } from "@/api/lyrics.js";


const audio = ref(null)
const datas = reactive({
    Lrc: "",
    ms: [],
    song: '',
    singer: '',
    audio: {
        currentTime: 0,
        maxTime: 0,
        playing: false,
        muted: false,
        speed: 1,
        waiting: true,
        preload: 'auto'
    },
    onPlay(res) {
        console.log('音频开始播放', res)
        datas.audio.playing = true
        datas.audio.loading = false
        const target = res.target
        const audios = document.getElementsByTagName('audio');
        [...audios].forEach((item) => {
            if (item !== target) {
                item.pause()
            }
        })
    },
    onError() {
        datas.audio.waiting = true
        alert('文件错误')
    },
    onWaiting() {
        console.log('音频开始等待', res)
    },
    onPause() {
        console.log('音频暂停');
        datas.audio.playing = false
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
        console.log('更新音频流');
    },
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
        datas.audio.waiting = false
        datas.audio.maxTime = parseInt(res.target.duration)
    },
})
// 播放音频
const play = () => {
    audio.value.play()
}
const pause = () => {
    audio.value.pause()
}

onMounted(() => {
    if(datas.Lrc.length == 0){

    }
})

</script>
<style scoped></style>
