import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.esm.browser.js';
import {batteries} from './batteries.mjs';

new Vue({
    el: '#app',
    data: {
        batteries: batteries,
    },
    async created() {
        for (let battery of this.batteries) {
            battery.urlHtml = battery.url.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        }
    },
    methods: {
        async func() {
        },
    },
});
