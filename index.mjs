import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.esm.browser.js';
import {batteries} from './batteries.mjs';

new Vue({
    el: '#app',
    data: {
        x: '100',
        y: '100',
        z: '100',
        batteries: [],
    },
    async created() {
        for (const battery of batteries) {
            battery.urlHtml = battery.url.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        }
        this.search();
    },
    methods: {
        isValid() {
            const isNumRegex = /^\d+(\.\d+)?$/;
            return isNumRegex.test(this.x) && isNumRegex.test(this.y) && isNumRegex.test(this.z);
        },
        search() {
            const [x, y, z] = [this.x, this.y, this.z].map(x => +x).sort((a,b) => a-b);
            this.batteries = batteries.filter(battery => {
                const [x1, y1, z1] = battery.dimensions;
                return x >= x1 && y >= y1 && z >= z1;
            });
            this.x = x;
            this.y = y;
            this.z = z;
        },
    },
});
