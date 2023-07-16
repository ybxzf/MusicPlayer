<template>
    <div ref="scrollContainer" @mouseleave="handleMouseLeave" @mouseover="handleMouseOver" id="xx"
        style="border: 1px solid;height: 20vh; overflow-y: auto;">
        <div v-for="(item, index) in datas.list" :key="index"
            style="border: 1px solid;display:flex; justify-content: center;align-items: center;">
            {{ item }}
        </div>
    </div>
</template>
<script setup>
import { onMounted, reactive, ref, computed } from "vue";
import { formatLrcObj } from "@/api/lyrics.js";
// import { lyrics, oLRC } from "@/api/lyrics.js";


const scrollContainer = ref(null)
const datas = reactive({
    list: [
        '这里是需要滚动的内容0',
        '这里是需要滚动的内容1',
        '这里是需要滚动的内容2',
        '这里是需要滚动的内容3',
        '这里是需要滚动的内容4',
        '这里是需要滚动的内容5',
        '这里是需要滚动的内容6',
        '这里是需要滚动的内容7',
        '这里是需要滚动的内容8',
        '这里是需要滚动的内容9',
        '这里是需要滚动的内容10',
        '这里是需要滚动的内容11',
        '这里是需要滚动的内容12',
        '这里是需要滚动的内容13',
        '这里是需要滚动的内容14',
        '这里是需要滚动的内容15',
    ],
})
const handleMouseOver = () => {
    console.log('放上去了');
}
const handleMouseLeave = () => {
    console.log('离开了');
}

// datas.centerIndex = computed(() => {
//     return Math.floor(datas.list.length / 2)
// })

onMounted(async () => {
    const s = await formatLrcObj('周杰伦 - 爱在西元前.lrc')
    console.log(s);

    // let all = document.querySelector('#xx')
    // let height = all.clientHeight
    // console.log(all);
    // console.log(all.clientHeight);
    // all.scrollTop = (7*23)-(height/2)-12;
    // console.log('获取dom元素', scrollContainer.value.scrollTop = 20)


    setInterval(() => {
        // 每次滚动的距离为100px
        // scrollContainer.value.scrollTop += 10;
    }, 500);
})

</script>
<style></style>