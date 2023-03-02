import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.esm.browser.js';
import {batteries} from './batteries.mjs';

new Vue({
    el: '#app',
    data: {
        batteries: batteries,
    },
    async created() {
    },
    methods: {
        async func() {
        },
    },
});
