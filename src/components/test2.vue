<template>
    <div>
        <div class="lrc_main">
            <div v-loading="datas.load" class="lrc_container">
                <!-- <el-scrollbar style="border: 1px solid;width: 100vh;display: flex;justify-content:center;align-items: center;">
                    <div v-for="(item, index) in datas.Lrc.ms" :key="index"
                        style="border: 1px solid;height: 4vh;display: flex;justify-content:center;align-items: center;">
                        <div
                            :style="`${index == datas.hightLightLrc ? 'color: rgb(136, 247, 169);' : ''};${index == datas.hightLightLrc ? 'height: 50;' : ''};`">
                            {{ item[1] ? item[1] : item[0] }}
                        </div>
                    </div>
                </el-scrollbar> -->
                <div class="lrc_left">
                    <div>歌曲名：{{ datas.Lrc.ti }}</div>
                    <div>专辑名：{{ datas.Lrc.al }}</div>
                    <div>演唱者：{{ datas.Lrc.ar }}</div>
                </div>
                <i class="lrc_right" @click="changeLrc">
                    <div v-if="!datas.LrcShows">
                        <div class="lrc_show_style1" v-for="(item, index) in datas.scrollLrc" :key="index" :style="{
                            top: `${index * 50}px`,
                            color: `${index == 2 ? 'rgb(106, 245, 113)' : ''}`,
                            fontSize: `${item.fontSize}px`,
                            fontWeight: `${index == 2 ? 'bolder' : ''}`
                        }">{{ item.c }}</div>
                    </div>
                    <div ref="lrcElement"
                        @mouseover="handleMouseOver"
                        @mouseleave="handleMouseLeave" 
                        style="
                        border: 1px solid;height: 100%;
                        overflow-y: auto;
                        " v-else
                    >
                        <div class="lrc_show_style2" v-for="(item, index) in datas.Lrc.ms" :key="index"
                            :style="{
                                // top: `${item.top}%`,
                                fontSize: `${index == datas.hightLightLrc ? '20' : '13'}px`,
                                fontWeight: `${index == datas.hightLightLrc ? 'bolder' : ''}`,
                                color: `${index == datas.hightLightLrc ? 'rgb(106, 245, 113)' : ''}`,
                            }">{{ item.c }}</div>

                    </div>
                </i>
            </div>
        </div>
        <div style="width: 100vw;display: flex;justify-content:center;align-items: center;">
            <audio src="http://localhost:444/周杰伦 - 爱在西元前.mp3" ref="audio" @play="datas.onPlay" @error="datas.onError"
                @waiting="datas.onWaiting" @pause="datas.onPause" @timeupdate="datas.onTimeupdate"
                @loadedmetadata="datas.onLoadedmetadata" controls>
            </audio>
            <div>
                <el-button type="success" @click="play">播放</el-button>
                <el-button type="success" @click="pause">暂停</el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch, nextTick  } from "vue";
import formatLrcObj from "@/api/lyrics.js";
// import { lyrics, oLRC } from "@/api/lyrics.js";

console.log(await formatLrcObj('周杰伦 - 爱在西元前.lrc'));
// console.log(oLRC)
const audio = ref(null)
const lrcElement = ref(null)
const datas = reactive({
    LrcShows: true,//歌词显示类型
    load: false,//加载歌词
    hightLightLrc: 0,//当前演唱歌词索引
    Lrc: {},//歌词
    scrollLrc: [],//5行滚动歌词
    mouseIn: false,//鼠标进入歌词区域
    init() {
        datas.Lrc = []
        datas.scrollLrc = []
        datas.Lrc = { ...oLRC };
        for (let j = 0; j < 5; j++) {
            datas.scrollLrc.push(j < 2 ? {} : datas.Lrc.ms[j - 2])
        }
        datas.scrollLrc[0].fontSize = 10
        datas.scrollLrc[1].fontSize = 17
        datas.scrollLrc[2].fontSize = 20
        datas.scrollLrc[3].fontSize = 17
        datas.scrollLrc[4].fontSize = 10
        // for (let i = 0; i < datas.Lrc.ms.length; i++) {
        //     const ms = datas.Lrc.ms[i]
        //     ms.top = 45 + (i * 18)
        // }
    },
    onPlay(res) {
        console.log('音频开始播放', res)
        const target = res.target
        const audios = document.getElementsByTagName('audio');
        [...audios].forEach((item) => {
            if (item !== target) {
                item.pause()
            }
        })
    },
    onError() {
        alert('文件错误')
    },
    onWaiting(res) {
        console.log('音频开始等待', res)
    },
    onPause() {
        console.log('音频暂停');
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
        const nowTime = Math.floor(res.target.currentTime)
        for (let i = 0; i < datas.Lrc.ms.length; i++) {
            const ms = datas.Lrc.ms[i]
            if (ms.t - nowTime < 1) {
                datas.hightLightLrc = i
                // for (let j = 0; j < datas.scrollLrc.length; j++) {
                if (i == 0) {
                    datas.scrollLrc[0] = {}
                    datas.scrollLrc[1] = {}
                    datas.scrollLrc[2] = datas.Lrc.ms[0]
                    datas.scrollLrc[3] = datas.Lrc.ms[1]
                    datas.scrollLrc[4] = datas.Lrc.ms[2]
                } if (i == 1) {
                    datas.scrollLrc[0] = {}
                    datas.scrollLrc[1] = datas.Lrc.ms[0]
                    datas.scrollLrc[2] = datas.Lrc.ms[1]
                    datas.scrollLrc[3] = datas.Lrc.ms[2]
                    datas.scrollLrc[4] = datas.Lrc.ms[3]
                } if (i > 1 && i < datas.Lrc.ms.length - 2) {
                    for (let j = 0; j < datas.scrollLrc.length; j++) {
                        datas.scrollLrc[j] = datas.Lrc.ms[i - 2 + j]
                    }
                } if (i == datas.Lrc.ms.length - 2) {
                    datas.scrollLrc[0] = datas.Lrc.ms[i - 2]
                    datas.scrollLrc[1] = datas.Lrc.ms[i - 1]
                    datas.scrollLrc[2] = datas.Lrc.ms[i]
                    datas.scrollLrc[3] = datas.Lrc.ms[i + 1]
                    datas.scrollLrc[4] = {}
                } if (i == datas.Lrc.ms.length - 1) {
                    datas.scrollLrc[0] = datas.Lrc.ms[i - 2]
                    datas.scrollLrc[1] = datas.Lrc.ms[i - 1]
                    datas.scrollLrc[2] = datas.Lrc.ms[i - 0]
                    datas.scrollLrc[3] = {}
                    datas.scrollLrc[4] = {}
                }
                // datas.scrollLrc[j] = (
                //     i > 2 ? datas.Lrc.ms[i - 2 + j] :
                //         i == 2 ? datas.Lrc.ms[i - 1 + j] :
                //             i == 1 ? datas.Lrc.ms[i + j] :
                //                 i == 0 ? datas.Lrc.ms[j] :
                //                     {})
                // }
                datas.scrollLrc[0].fontSize = 10
                datas.scrollLrc[1].fontSize = 17
                datas.scrollLrc[2].fontSize = 20
                datas.scrollLrc[3].fontSize = 17
                datas.scrollLrc[4].fontSize = 10
                // let jian = 0
                // for (let i = datas.hightLightLrc; i > -1; i--) {
                //     const ms = datas.Lrc.ms[i]
                //     ms.top = 50 - (jian * 10)
                //     jian++
                // }
                // let jia = 0
                // for (let i = datas.hightLightLrc; i < datas.Lrc.ms.length; i++) {
                //     const ms = datas.Lrc.ms[i]
                //     ms.top = 50 + (jia * 10)
                //     jia++
                // }
                console.log('第几行', datas.hightLightLrc)
                console.log('类', datas.Lrc);
            }
        }
        if (nowTime == 0) {
            datas.init()
        }
        if(lrcElement.value && !datas.mouseIn){
            const height = lrcElement.value.clientHeight
            lrcElement.value.scrollTop = (datas.hightLightLrc+1)*45-(height/2)
            // console.log(lrcElement.value.scrollTop = (datas.hightLightLrc*30)-(height/2)-15);
        }
        console.log('更新音频流', nowTime);
        // console.log('更新音频流', res.target.currentTime);
    },
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
        console.log('语音元数据', res);
    },
})

const changeLrc = () => {
    console.log('切换');
    datas.LrcShows = !datas.LrcShows
}
// 播放音频
const play = () => {
    audio.value.play()
}
const pause = () => {
    audio.value.pause()
}

const handleMouseOver = () => {
    datas.mouseIn = true
}

const handleMouseLeave = () => {
    datas.mouseIn = false
}

watch(() => datas.LrcShows, 
    (newValue, oldValue) => {
    // if (!newValue) {
    //     nextTick(() => {
    //         const container = lrcElement.value
    //         container.scrollTop = 500
    //         console.log('改变为风格2', lrcElement.value);
    //     });
    // }
})

onMounted(() => {
    datas.load = true
    // let all = document.querySelector('.lrc_show_style2')
    // let heightS2 = all.clientHeight
    datas.init()
    // console.log(datas.scrollLrc);
    datas.load = false
})

</script>
<style lang="scss" scoped>
.lrc_main {
    display: flex;
    justify-content: center;
    align-items: center;


    .lrc_container {
        border: 1px solid;
        width: 50vw;
        height: 50vh;
        margin: 10px 0 10px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .lrc_left {
            flex: 1;
            // border: 1px solid;
            div {
                color: rgb(125, 248, 141);
                font-size: 25px;
                font-weight: bolder;
                // border: 1px solid;
                height: 4vh;
                margin: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }

        .lrc_right {
            flex: 1;
            height: 100%;
            // border: 1px solid;
            position: relative;

            .lrc_show_style1 {
                width: 99%;
                margin-top: 10vh;
                // border: 1px solid;
                position: absolute;
                // left: 50%;
                // transform: translateX(-50%);
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .lrc_show_style2 {
                width: 99%;
                height: 45px;
                // position: absolute;
                // border: 1px solid;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
    }
}
</style>