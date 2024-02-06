<template>
    <div v-loading="datas.load" id="app"
        @click.self="datas.checkBgURL(datas.playingIndex + Math.floor(Math.random() * 100))" :style="datas.backgroundDiv">
        <!-- 搜索框 -->
        <div class="search">
            <span style="width:160px">
                <el-input clearable v-model.trim="datas.nameKey" placeholder="请输入要搜索的内容" @keyup.enter="datas.resetList"
                    style="background-color: transparent;color:#fff;font-size:16px;width: 30vh;" />
            </span>
            <el-button type="primary" @click="datas.resetList" style="margin-left: 10px;">搜索</el-button>
            <i v-if="datas.isLikeList" class="ilike" @click="datas.checkList()"> 我喜欢的 </i>
            <i v-else style="color:red;cursor:pointer" @click="datas.checkList()"> 全部列表 </i>
            <span class="list-length"> 共{{ datas.musicList.length }}首</span>
        </div>
        <!-- 歌曲菜单 -->
        <div class="music-list">
            <div v-for="(item, index) in datas.musicList" :key="item.url" class="music-item"
                :class="item.url === datas.music.url ? 'playing' : ''">
                <span class="music-item-name" :title="item.name" @click="datas.check(index)" v-text="item.name"></span>
                <i v-if="item.ilike" class="ilike" @click="datas.dislike(item)">
                    <el-button type="danger" >取消</el-button>
                </i>
                <i v-else class="hae-icon icon-heartempty" @click="datas.like(item)">
                    <el-button type="success" >收藏</el-button>
                </i>
            </div>
        </div>
        <!-- 歌词框 -->
        <div class="lyricsbar">
            <lyricsStyle1 v-if="Object.keys(datas.lrc).length !== 0" :audioStream="datas.audioStream" :lrc="datas.lrc" />
        </div>
        <!-- 播放工具框 -->
        <div class="toolbar">
            <audio ref="audio" :src="datas.music.url" @ended="datas.next(1, true)" @timeupdate="datas.onTimeupdate"
                @loadedmetadata="datas.onLoadedmetadata" @waiting="datas.onWaiting" controls autoplay>垃圾浏览器不支持</audio>
            <div class="music-name"><span v-text="datas.music.name" class="music-item-name"></span></div>
            <div class="toolmenu">
                <i v-if="datas.playType === 0" title="循环播放" @click="datas.checkType">
                    <el-button type="success" >循环</el-button>
                </i>
                <i v-if="datas.playType === 1" title="单曲播放" @click="datas.checkType">
                    <el-button type="success" >单曲</el-button>
                </i>
                <i v-if="datas.playType === 2" title="随机播放" @click="datas.checkType">
                    <el-button type="success" >随机</el-button>
                </i>
                <i @click="datas.next(-1)">
                    <el-button type="primary" >上一曲</el-button>
                </i>
                <i v-if="!datas.playing" @click="datas.play">
                    <el-button type="success" >
                        播放<!-- <img src="@/assets/imgs/play.svg"> -->
                    </el-button>
                </i>
                <i v-else @click="datas.pause">
                    <el-button type="danger" >
                        暂停<!-- <img src="@/assets/imgs/pause.svg"> -->
                    </el-button>
                </i>
                <i @click="datas.next(1)">
                    <el-button type="primary" >下一曲</el-button>
                </i>
                <i v-if="datas.music.ilike" class="ilike" @click="datas.dislike(datas.music)">
                    <el-button type="danger" >取消收藏</el-button>
                </i>
                <i v-else @click="datas.like(datas.music)">
                    <el-button type="success" >加入收藏</el-button>
                </i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { menu } from "@/api/menu.js";
import URLList from "@/assets/config/bgImgs.json";
import { formatLrcObj } from "@/api/lyrics.js";
import lyricsStyle1 from "@/components//lyricsStyle1.vue";

const audio = ref(null);
const datas = reactive({
    load: true,
    backgroundDiv: {//背景图
        backgroundImage: 'url(' + URLList[0] + ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
    },
    musicList: [...menu], // 当前总列表
    iLikeList: localStorage.myLikeMusic ? JSON.parse(localStorage.myLikeMusic) : [],//喜爱歌单
    isLikeList: false,//是否为喜爱歌单
    music: {},//当前播放歌曲
    playing: false,//是否正在播放
    nameKey: '',//搜索歌名
    playingIndex: 0,//当前播放歌曲目录索引
    playType: 0,//播放类型
    lrc: {},//歌词
    audioStream: null,//当前音频流
    play() {//歌曲播放时调用
        audio.value.play()
        document.title = datas.music.name
        datas.playing = true
        let timer = setTimeout(() => {
            document.querySelector('.playing').scrollIntoView()
            clearTimeout(timer)
        }, 100)
    },
    pause() {//歌曲暂停时调用
        audio.value.pause()
        datas.playing = false
    },
    check(index) {//点击选择要播放的歌曲时调用
        datas.playing = false
        datas.music = datas.musicList[index]
        datas.playingIndex = index
        datas.checkBgURL(index)
        datas.play()
    },
    resetList() {//搜索时调用
        let list = datas.isLikeList ? datas.iLikeList : menu
        datas.musicList = list.filter(item => item.name.includes(datas.nameKey))
    },
    next(step, auto) {//切换上下一曲时调用
        let index
        if (datas.playType === 0) {
            index = (datas.musicList.length + datas.playingIndex + step) % datas.musicList.length
        }
        if (datas.playType === 1) {
            index = auto ? datas.playingIndex : (datas.musicList.length + datas.playingIndex + step) % datas.musicList.length
        }
        if (datas.playType === 2) {
            index = Math.floor(datas.musicList.length * Math.random())
        }
        datas.check(index)
        datas.checkBgURL(index)
    },
    checkType() {//切换播放类型时调用
        datas.playType = (datas.playType + 1) % 3
    },
    like(item) {//选择收藏时调用
        if (!datas.iLikeList.some(i => i.url === item.url)) {
            item['ilike'] = true
            datas.iLikeList.push(item)
            localStorage.myLikeMusic = JSON.stringify(datas.iLikeList)
        }
    },
    dislike(item) {//取消收藏时调用
        item['ilike'] = false
        datas.iLikeList = datas.iLikeList.filter(i => i.url !== item.url)
        localStorage.myLikeMusic = JSON.stringify(datas.iLikeList)
    },
    assignList(list) {//整理我喜欢的歌单
        let iLikeURLs = datas.iLikeList.map(i => i.url)
        list.forEach(i => {
            if (iLikeURLs.includes(i.url)) {
                i['ilike'] = true
            }
        })
    },
    checkList() {//切换我喜欢的/全部列表时调用
        let list = menu?.filter(item => item.name.includes(datas.nameKey))
        datas.assignList(list)
        datas.isLikeList = !datas.isLikeList
        datas.musicList = datas.isLikeList ? datas.iLikeList : list
    },
    checkBgURL(index) {//切换背景图片
        index = index % URLList.length
        datas.backgroundDiv = {
            backgroundImage: 'url(' + URLList[index] + ')',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top' // 背景图片位置
        }
    },
    onTimeupdate(res) {//用来更新音频流的,如：当前播放时间
        datas.audioStream = res
    },
    // 语音元数据主要是语音的长度之类的数据
    async onLoadedmetadata(res) {
        datas.lrc = {}
        datas.lrc = await formatLrcObj(datas.music.lrc)
        // console.log(datas.lrc);
        audio.value.waiting = false
        console.log('歌曲时长：', parseInt(res.target.duration), 's');
    },
    onWaiting(res) {//音频开始等待时调用
        console.log('当音频开始等待', res)
    }
})

onMounted(async () => {
    datas.load = true
    datas.music = datas.musicList[0]
    datas.assignList(datas.musicList)
    datas.load = false
})

</script>

<style scoped>
html,
body {
    margin: 0;
    padding: 0;
}

#app {
    width: 100%;
    height: 100vh;
}

/* 滚动条 */
body *::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}

.lyricsbar {
    position: absolute;
    /* bottom: 40px; */
    right: 1vw;
    width: 56vw;
    min-width: 600px;
    height: 60vh;
    min-height: 100px;
    background: rgba(22, 22, 22, .2);
    border-radius: 20px;
    box-shadow: 5px 5px 5px rgba(44, 44, 44, .4);
}


.toolbar {
    position: absolute;
    bottom: 40px;
    right: 1vw;
    width: 56vw;
    min-width: 600px;
    height: 25vh;
    min-height: 100px;
    background: rgba(22, 22, 22, .2);
    border-radius: 20px;
    box-shadow: 5px 5px 5px rgba(44, 44, 44, .4);
}

.toolbar:hover,
.lyricsbar:hover,
.music-list:hover {
    transform: scale(1.005);
    box-shadow: 10px 10px 10px rgba(88, 88, 88, .5);
}

.toolbar audio {
    width: 80%;
    margin: 10px 10%;
}

.music-name {
    font-size: 22px;
    text-align: center;
}

.toolmenu {
    text-align: center;
}

.ilike {
    color: red !important;
    cursor: pointer;
}

.toolmenu i {
    font-size: 40px;
    color: #1890ff;
    cursor: pointer;
    display: inline-block;
    margin: 10px 25px;
}

.toolmenu i:active {
    transform: scale(0.9);
}

.music-list {
    float: left;
    margin: 0 0 0 10px;
    height: calc(100% - 94px);
    width: 42vw;
    min-width: 330px;
    overflow: hidden auto;
    border-radius: 20px;
    box-shadow: 5px 5px 5px rgba(44, 44, 44, .4);
}

.el-button {
    border-radius: 50%;
    padding: 8px;
}

.music-item {
    font-size: 18px;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 5px 0;
}

.music-item:hover {
    color: #1890ff;
}

.music-item-name {
    cursor: pointer;
    margin-left: 20px;
    margin-right: 20px;
}

.music-item:nth-child(odd) {
    background-color: rgba(11, 11, 11, .1)
}

.playing {
    color: #e6e;
}

.search {
    padding: 10px 0 12px 12px;
    z-index: 10;
}

.search-button {
    font-size: 22px;
    color: #fff;
    cursor: pointer;
    padding: 8px;
    top: 4px;
    position: relative;
}

.list-length {
    font-size: 12px;
    color: #fff;
    position: relative;
}

.lrc {
    height: 220px;
    width: 240px;
    margin: 0 auto;
    overflow-y: scroll;
}

.lrc span {
    color: #e65e5e
}

.lrc ul li {
    list-style: none;
    max-width: 220px;
    padding: 0 4px;
    line-height: 20px;
}
</style>
