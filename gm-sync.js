function getPDFInfo (gm, opts) {
    return new Promise((resolve, reject) => {
        gm.identify(opts, function (err, features) {
            if (err) {
                reject(err)
            } else {
                resolve(features)
            }
        });
    })
}

function saveFrame (gm, index, output) {
    return new Promise((resolve, reject) => {
        gm.selectFrame(index).write(output, function (err, features) {
            if (err) {
                reject(err)
            } else {
                resolve(features)
            }
        });
    })
}


module.exports = {getPDFInfo, saveFrame}
