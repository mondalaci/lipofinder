#!/usr/bin/env node
import axios from 'axios';
import * as cheerio from 'cheerio';

const batteries = [];

const url = 'https://www.pdbattery.com/li-polymer-battery-cells-list.html';
const res = await axios.get(url);
const $ = cheerio.load(res.data);
$('table').each((i, el) => {
    $(el).find('tr:gt(0)').each((i, el2) => {
        const cells = $(el2).find('td');
        const [itemId, series, partNo, voltage, capacity, x, y, z] = cells.map((i, el) => $(el).text().trim());
        batteries.push({
            url,
            capacity: +capacity,
            dimensions: [+x, +y, +z].sort((a,b) => a-b),
        });
    });
});

console.log(batteries);
