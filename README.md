## 安装
```
npm install pdf2ppt
```

## 示例
```
const input = path.join(pdfdir, it)
const outputDir = path.resolve('ppt')
const ppt = await pdf2ppt(input, outputDir, {
    cacheDir,
    progressCallback: (progress, complete) => {
        console.info("转换中", `progress: ${progress}`, complete)
    }
});
console.info("转换成功", `${ppt.convertTime}ms`, ppt)
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
    "path":"../ppt/test.ppt",
    "createdTime": 1608469607448
}
```