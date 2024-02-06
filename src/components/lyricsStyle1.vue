<template>
    <div class="lrc_main">
        <div v-loading="datas.load" class="lrc_container">
            <div class="lrc_left">
                <div>歌曲名：{{ datas.Lrc.ti }}</div>
                <div>专辑名：{{ datas.Lrc.al }}</div>
                <div>演唱者：{{ datas.Lrc.ar }}</div>
            </div>
            <i class="lrc_right" @click="changeLrc">
                <div v-if="datas.LrcShows">
                    <div class="lrc_show_style1" v-for="(item, index) in datas.scrollLrc" :key="index" :style="{
                        top: `${index * 60}px`,
                        color: `${index == 2 ? 'rgb(106, 245, 113)' : ''}`,
                        fontSize: `${item.fontSize}px`,
                        fontWeight: `${index == 2 ? 'bolder' : ''}`
                    }">{{ item.c }}</div>
                </div>
                <div v-else class="scroll_lrc" ref="lrcElement" @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
                    <div class="lrc_show_style2" v-for="(item, index) in datas.Lrc.ms" :key="index" :style="{
                        // top: `${item.top}%`,
                        fontSize: `${index == datas.hightLightLrc ? '20' : '13'}px`,
                        fontWeight: `${index == datas.hightLightLrc ? 'bolder' : ''}`,
                        color: `${index == datas.hightLightLrc ? 'rgb(106, 245, 113)' : ''}`,
                    }">{{ item.c }}</div>

                </div>
            </i>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps(['lrc', 'audioStream']);
const lrcElement = ref(null)
const datas = reactive({
    LrcShows: true,//歌词显示类型
    load: false,//加载歌词
    hightLightLrc: 0,//当前演唱歌词索引
    Lrc: {},//歌词
    scrollLrc: [],//5行滚动歌词
    mouseIn: false,//鼠标进入歌词区域
    init() {//初始化
        datas.Lrc = []
        datas.scrollLrc = []
        datas.Lrc = { ...props.lrc };
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
    timeupdate(res) {//更新音频流时调用
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
                // console.log('第几行', datas.hightLightLrc)
                // console.log('类', datas.Lrc);
            }
        }
        if (nowTime == 0) {
            datas.init()
        }
        if (lrcElement.value && !datas.mouseIn) {
            const height = lrcElement.value.clientHeight
            lrcElement.value.scrollTop = (datas.hightLightLrc + 1) * 45 - (height / 2)
        }
        // console.log('更新音频流', nowTime);
    }
})

const changeLrc = () => {
    console.log('切换');
    datas.LrcShows = !datas.LrcShows
    nextTick(() => {
        if (!datas.LrcShows) {
            const height = lrcElement.value.clientHeight
            lrcElement.value.scrollTop = (datas.hightLightLrc + 1) * 45 - (height / 2)
        }
    });
}
const handleMouseOver = () => {//鼠标进入事件
    datas.mouseIn = true
}

const handleMouseLeave = () => {//鼠标离开事件
    datas.mouseIn = false
}
watch(() => props.audioStream,
    (newValue, oldValue) => {
        datas.timeupdate(newValue)
    })

onMounted(() => {
    datas.load = true
    datas.init()
    datas.load = false
})

</script>

<style lang="scss" scoped>
.lrc_main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .lrc_container {
        // border: 1px solid;
        width: 100vw;
        height: 100%;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;

        .lrc_left {
            flex: 2;

            // border: 1px solid;
            div {
                color: rgb(125, 248, 141);
                font-size: 20px;
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
            flex: 3;
            height: 96%;
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

            .scroll_lrc {
                // border: 1px solid;
                height: 100%;
                overflow-y: auto;

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
}

/* 定义滚动条样式 */
.scroll_lrc::-webkit-scrollbar {
    width: 6px;
    border-radius: 50px;
    /* 滚动条宽度 */
}

.scroll_lrc::-webkit-scrollbar-track {
    // background-color: #f1f1f1;
    background: rgba(1, 34, 85, 0);
    /* 滚动条背景色 */
}

.scroll_lrc::-webkit-scrollbar-thumb {
    background-color: #888;
    /* 滚动条滑块颜色 */
}

.scroll_lrc::-webkit-scrollbar-thumb:hover {
    background-color: #555;
    /* 滚动条滑块悬停时的颜色 */
}
</style>