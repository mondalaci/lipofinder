#!/usr/bin/env node
import axios from 'axios';
import * as cheerio from 'cheerio';

const batteries = [];

let url = 'https://www.pdbattery.com/li-polymer-battery-cells-list.html';
let res = await axios.get(url);
let $ = cheerio.load(res.data);
$('table').each((i, el) => {
    $(el).find('tr:gt(0)').each((i, el2) => {
        const cells = $(el2).find('td');
        const [itemId, series, partNo, voltage, capacity, x, y, z] = cells.map((i, el) => $(el).text().trim());
        batteries.push({
            url,
            partNo,
            capacity: +capacity,
            dimensions: [+x, +y, +z].sort((a,b) => a-b),
        });
    });
});

url = 'https://www.lipolbattery.com/LiPo-Battery-10mAh+.html';
res = await axios.get(url);
$ = cheerio.load(res.data);
$('table.t_list tr').each((i, el) => {
    const cells = $(el).find('td');
    const [partNo, capacity, dimensions, voltage] = cells.map((i, el) => $(el).text().trim());
    batteries.push({
        url,
        partNo,
        capacity: +capacity.replace(' mAh', ''),
        dimensions: dimensions.replace(' mm', '').split(' * ').map(x => +x).sort((a,b) => a-b),
    });
});

console.log(batteries);
