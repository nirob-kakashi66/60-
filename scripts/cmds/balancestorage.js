const fs = require('fs');
const path = __dirname + '/../data/balance.json';

function read() {
    if (!fs.existsSync(path)) fs.writeFileSync(path, '{}');
    return JSON.parse(fs.readFileSync(path));
}

function write(data) {
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

function get(uid) {
    const data = read();
    return data[uid] || 0;
}

function set(uid, amount) {
    const data = read();
    data[uid] = amount;
    write(data);
}

function add(uid, amount) {
    const data = read();
    data[uid] = (data[uid] || 0) + amount;
    write(data);
}

function subtract(uid, amount) {
    const data = read();
    data[uid] = Math.max((data[uid] || 0) - amount, 0);
    write(data);
}

module.exports = { get, set, add, subtract };
