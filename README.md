## 安装
```
npm install pdf2ppt
```

## 示例
```
const pdf2ppt = require('pdf2ppt')
const path = require('path')

const input = 'input.pdf'
const output = 'output.ppt'
const cacheDir = path.resolve('cache') //缓存目录 可选 默认在输出目录下
const ppt = await pdf2ppt(input, output, cacheDir);
```

`pdf2ppt`将会返回以下信息

```
{
    "format":"PDF",
    "width":1920,
    "height":1080,
    "frameCount":18,
    "frames":[
        "../img/0.png",
        "../img/1.png",
        "../img/2.png",
        "../img/3.png",
        "../img/4.png",
        "../img/5.png",
        "../img/6.png",
        "../img/7.png",
        "../img/8.png",
        "../img/9.png",
        "../img/10.png",
        "../img/11.png",
        "../img/12.png",
        "../img/13.png",
        "../img/14.png",
        "../img/15.png",
        "../img/16.png",
        "../img/17.png"
    ],
    "output":"../ppt/test.ppt",
    "createdTime": 1608469607448
}
```