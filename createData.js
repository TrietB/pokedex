const fs = require('fs')
const csv = require('csvtojson')
// const imageFolder = require('./images')

// fs.readFileSync(imageFolder).forEach(file => {
//     console.log(file)
// })

let arr = []

const images = fs.readdirSync('./images')
images.forEach(file=> arr.push(file))

console.log(arr)



const createData = async () => {
    let newData = await csv().fromFile('pokemon.csv')
    newData = new Set(newData.map((e)=> e))
    newData = Array.from(newData)
    newData = newData.map((e, index)=> {
        if(arr.indexOf(`${e.Name}.png`)> -1){
            return{
                id: index + 1,
                name: e.Name,
                types: [
                    e.Type1, e.Type2
                ],
                url: `http://localhost:5000/images/${e.Name}.png`
            }
        }else{
            newData.pop()
        }
        })
    let data = JSON.parse(fs.readFileSync('db.json'))
    data.data = newData.filter(e => e)
    fs.writeFileSync('db.json', JSON.stringify(data))
    // console.log(data)

}

createData()