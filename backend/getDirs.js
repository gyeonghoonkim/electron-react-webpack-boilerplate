const fs = require('fs');
const path = require('path');
const request = require("request")
//const { parse } = require("csv-parse");
const { parse } = require("../utils/csv-parse")
const { divideArray } = require("../utils/divide-array")
const { indexArray } = require("../utils/index-array")

exports.getDirs = (patientId) => {

    console.log("getDirs called")

    // var dirs = []

    // fs.createReadStream(`//172.23.123.138/e/DermaView/ID/${patientId}/dirs.csv`, { encoding: "utf-8" })
    //     .pipe(csv())
    //     .on('data', function (row) {
    //         console.log(row["directory"])
    //         dirs.push(row["directory"])
    //     })
    //     .on('end', function () {
    //         console.log('Data loaded')
    //         console.log(dirs)
    //     })

    // //위보다 아래 줄이 먼저 실행되버림... 이걸 해결하려면 promise 를 사용해야하고 복잡해진다. 
    // 그냥 파일도 작으니까 통째로 불러오자. 
    // console.log("test-lastline in getDirs")
    // dirs.push("lastdir_test")
    // console.log(dirs)

    const csv = fs.readFileSync(`//172.23.123.138/e/DermaView/ID/${patientId}/dirs.csv`) //꼭 sync로 불러와야함
    // console.log(csv)
    // const dirs = csv.toString().split("\r\n")
    const results = parse(csv)
    const dates = results.map(x => x[2])
    const dirs0 = results.map(x => x.slice(3).toString())
    const dirs = dirs0.map(x => (x[0] === '"') ? x.slice(1, -1) : x) //경로 중간에 콤마가 있으면 앞뒤로 ""가 추가로 찍혀있더라... 파이썬 코드의 문제인듯함. 암튼 이걸 해결.
    // console.log(dirs[1])


    const datesIndexArray = indexArray(dates)

    const reversed_dates = [].concat(...divideArray(datesIndexArray[0], dates).reverse())
    const reversed_dirs = [].concat(...divideArray(datesIndexArray[0], dirs).reverse())

    const name = results[0][1]

    // console.log(reversed_dirs)
    return [reversed_dates, reversed_dirs, patientId, name]
}