const gm = require('gm')
const {getPDFInfo, saveFrame} = require('./gm-sync')

const crypto = require('crypto');
const officegen = require('officegen')

const fs = require("fs")
const path = require("path")

async function pdf2ppt (input, output, cacheDir) {
    const startTime = new Date().getTime()

    const md5 = crypto.createHash('md5').update(fs.readFileSync(input)).digest('hex').toUpperCase();
    //const filenameNoEx = URI(input).suffix("").filename()

    const instance = gm(input)
    const features = await getPDFInfo(instance, '{"format":"%m","width":%W,"height":%H,"frameCount":%n}')
    const info = JSON.parse(/{.*?}/.exec(features)[0])
    info.md5 = md5

    const frames = []
    if (info.frameCount > 1) {
        const tempDir = path.resolve(cacheDir || path.resolve(output, '..'), md5)
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, {recursive: true})
        }
        for (let i = 0; i < info.frameCount; i++) {
            const framePath = path.join(tempDir, `${i}.png`)
            if (fs.existsSync(framePath) && fs.statSync(framePath).size > 0) {
                //console.debug(`缓存已存在，跳过 ${framePath}`)
            } else {
                //console.debug(`生成缓存帧 ${framePath}`)
                await saveFrame(instance, i, framePath)
            }
            frames.push(framePath)
        }
    }
    info.frames = frames

    const pptx = officegen('pptx')
    frames.forEach(function (it) {
        const slide = pptx.makeNewSlide()
        slide.addImage(it, {
            y: 0,
            x: 0,
            cy: '100%',
            cx: '100%'
        })
    })

    pptx.setSlideSize(info.width, info.height, 'custom')

    const outputDir = path.resolve(output, '..')
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true})
    }

    const writeStream = fs.createWriteStream(output)
    pptx.generate(writeStream, {})
    info.output = output

    info.createdTime = new Date().getTime()
    info.output = output
    info.convertTime = info.createdTime - startTime
    return info
}

module.exports = pdf2ppt
