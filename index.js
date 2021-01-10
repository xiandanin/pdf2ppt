const URI = require('urijs')
const gm = require('gm')
const {getPDFInfo, saveFrame} = require('./gm-sync')

const crypto = require('crypto');
const officegen = require('officegen')

const fs = require("fs")
const path = require("path")

/**
 *
 * @param input 输入文件路径
 * @param outputDir 输出文件夹路径
 * @param cacheDir 缓存路径 可选
 * @param progressCallback 进度回调 可选
 * @param isReadInfo 是否读取信息 默认false
 * @returns {Promise<any>}
 */
async function pdf2ppt (input, outputDir, {cacheDir, progressCallback}) {
    let startTime = new Date().getTime()

    const output = path.join(outputDir, new URI(input).suffix(".pptx").filename())

    if (!cacheDir) {
        cacheDir = path.resolve(outputDir, 'cache')
    }

    const md5 = crypto.createHash('md5').update(fs.readFileSync(input)).digest('hex').toUpperCase();
    //const filenameNoEx = URI(input).suffix("").filename()

    if (progressCallback) {
        progressCallback(0.1, false)
    }

    const instance = gm(input)
    const features = await getPDFInfo(instance, '{"format":"%m","width":%W,"height":%H,"frameCount":%n}')
    const info = JSON.parse(/{.*?}/.exec(features)[0])
    info.md5 = md5

    const parseProgress = 0.4
    if (progressCallback) {
        progressCallback(parseProgress, false)
    }
    const frames = []
    if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, {recursive: true})
    }
    const frameCount = info.frameCount
    for (let i = 0; i < frameCount; i++) {
        const framePath = path.join(cacheDir, `${i}.png`)
        if (fs.existsSync(framePath) && fs.statSync(framePath).size > 0) {
            //console.debug(`缓存已存在，跳过 ${framePath}`)
        } else {
            //console.debug(`生成缓存帧 ${framePath}`)
            await saveFrame(instance, i, framePath);
        }
        frames.push(framePath)

        if (progressCallback) {
            const frameProgress = i / frameCount * 0.4 + parseProgress
            progressCallback(frameProgress, false)
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

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true})
    }

    if (progressCallback) {
        progressCallback(0.9, false)
    }
    const pptxGenerate = new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(output)
        pptx.on('error', function (err) {
            reject(err)
        })
        writeStream.on('error', function (err) {
            reject(err)
        })
        writeStream.on('close', function () {
            resolve()
        })
        pptx.generate(writeStream)
    })

    await pptxGenerate

    info.createdTime = new Date().getTime()
    info.output = output
    info.size = fs.statSync(output).size
    info.convertTime = info.createdTime - startTime

    if (progressCallback) {
        progressCallback(1, true)
    }
    return info
}

module.exports = pdf2ppt
