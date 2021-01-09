const pdf2ppt = require('./index')
const path = require('path')
const fs = require('fs')

const pdfdir = path.resolve('pdf')
const cacheDir = path.resolve('img')
const pptdir = path.resolve('ppt')

async function sample () {
    const listFiles = fs.readdirSync(pdfdir)
    for (let i = 0; i < listFiles.length; i++) {
        const it = listFiles[i]
        if (it.endsWith('.pdf')) {
            try {
                const input = path.join(pdfdir, it)
                const output = path.join(pptdir, it.replace('.pdf', '.ppt'))
                if (!fs.existsSync(output)) {
                    const ppt = await pdf2ppt(input, output, {
                        cacheDir,
                        progressCallback: (progress, complete) => {
                            console.info("转换中", `progress: ${progress}`, complete)
                        }
                    });
                    console.info("转换成功", `${ppt.convertTime}ms`, ppt)
                }
            } catch (e) {
                console.info("转换失败", e)
            }
        }
    }
}

sample()
