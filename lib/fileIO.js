const fs = require('fs')

const writeFilePromise = (file, data) => {
  
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data, error => {
            if (error) reject(error);
            resolve("file created successfully with handcrafted Promise!");
        })
    })
}

const readFilePromise = (file) => {
    
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf-8', (error, data) => {
            if (error) reject(error)
            resolve(data)
        })
    })
}

module.exports.readFile = readFilePromise
module.exports.writeFile = writeFilePromise