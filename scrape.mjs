#!/usr/bin/env node
import {promises as fs} from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import serialize from 'serialize-javascript';

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

const lipolBatteryComCapacities = [
    '10mAh+',
    '100mAh+', '200mAh+', '300mAh+', '400mAh+', '500mAh+', '600mAh+', '700mAh+', '800mAh+', '900mAh+',
    '1000mAh+', '2000mAh+', '3000mAh+', '4000mAh+', '5000mAh+', '6000mAh+', '7000mAh+', '8000mAh+', '9000mAh+',
];

for (const capacity of lipolBatteryComCapacities) {
    url = `https://www.lipolbattery.com/LiPo-Battery-${capacity}.html`;
    res = await axios.get(url);
    $ = cheerio.load(res.data);
    $('table.t_list tr:gt(0)').each((i, el) => {
        const cells = $(el).find('td');
        const [partNo, capacity, dimensions, voltage] = cells.map((i, el) => $(el).text().trim());
        batteries.push({
            url,
            partNo,
            capacity: +capacity.replace(' mAh', ''),
            dimensions: dimensions.replace(' mm', '').split(' * ').map(x => +x).sort((a,b) => a-b),
        });
    });
}

batteries.sort((a, b) => {
    if (a.capacity !== b.capacity) {
        return a.capacity - b.capacity;
    }
    for (let i = 0; i < 3; i++) {
        if (a.dimensions[i] !== b.dimensions[i]) {
            return a.dimensions[i] - b.dimensions[i];
        }
    }
});

const batteriesJs = serialize(batteries, {space: 2});
const batteriesMjs = `export const batteries = ${batteriesJs};`;
await fs.writeFile('batteries.mjs', batteriesMjs, 'utf8');
