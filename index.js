'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const inquirer = require('inquirer');

const baseUrl = "http://m.21cineplex.com/gui.list_theater.php?p=th";
const theaterUrl = "http://m.21cineplex.com/gui.list_theater.php?city_id=";

var kota = [];

axios.get(baseUrl).then(x =>{
    var $ = cheerio.load(x.data);
    $('#city_id').children().each(function(x, y){
        kota.push({name: y.children[0].data, id: y.children[0].parent.attribs.value});
    });
    return kota
})
.then(kota => {
    return inquirer.prompt([{
        type    : "list",
        name    : "kota",
        message : "Pilih Kota: ",
        choices : kota
    }])
}).then(jawaban => {
    var id_kota = kota.filter(x => {
        return x.name === jawaban.kota;
    }).map(x=>{
        return x.id;
    }).toString();

    return axios.get(theaterUrl+id_kota).then(res => {
        var $ = cheerio.load(res.data);
        console.log($('#box_content').text());
    });
});
