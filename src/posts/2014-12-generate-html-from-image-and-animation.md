---
date: 2014-12-19
title: 图片转HTML（支持动画）
tags: [Python, CSS]
category: Tech
---

也许是受到很久以前看到的这玩意儿的原因：[The Shapes of CSS](http://css-tricks.com/examples/ShapesOfCSS/?=derp)

现在开脑洞写了个自动转换，顺便支持了动画……嗯，纯 CSS _(:з」∠)_

主要步骤就是用 Python 读图片，然后把像素全转写成 CSS 的 `box-shadow` ，最后构建一个完整的 HTML 文件输出。

然后用浏览器打开生成的 HTML 文件，就直接看到图片了，如果输入是一个文件夹的话，就以文件夹里面的图片为帧生成一个带动画的 HTML。

之后再更新就丢这儿了: [img2html](https://github.com/frantic1048/img2html)

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

## @package img2html
#  Usage        : img2html.py file1|dir1 [file2|dir2 ...]
#  Description  : generate html uses box-shadow to show picture
#                 or a html to show your image sequence in a folder as css animation
#  Dependencies : Python Image Library, Python 3
#  Note         : Take care of the Super-High-Energy output ( >﹏<。)
#  Date         : 2014-12-19
#  Author       : frantic1048


import sys
import os
from PIL import Image
from string import Template

class UnknownColorMode(Exception): pass

## @var tHTML template for constructing entire html document
tHTML = Template('''
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>~ ${name} ~</title>
</head>
<body>
  <style type="text/css">${css}</style>
  <div id="image_kun"></div>
</body>
</html>''')

## @var tCSSStatic template for constructing static image's css code
tCSSStatic = Template('''
@charset "utf-8";
body{
  display:flex;
  justify-content:center;
  align-items:center;
}
#image_kun{
  height: ${height}px;
  width: ${width}px;
  position:relative;
}
#image_kun::after{
  position:absolute;
  height:1px;
  width:1px;
  background:${firstPixel};
  margin:0;
  padding:0;
  content:"\\200B";/*ZWS*/
  box-shadow:
  ${boxshadow};
}
''')

## @var tCSSAnimation template for constructing image sequence's css animation code
tCSSAnimation = Template('''
@charset "utf-8";
body{
  display:flex;
  justify-content:center;
  align-items:center;
}
#image_kun{
  height: ${height}px;
  width: ${width}px;
  position:relative;
}
#image_kun::after{
  position:absolute;
  height:1px;
  width:1px;
  background:transparent;
  margin:0;
  padding:0;
  content:"\\200B";/*ZWS*/
  animation:ayaya ${animationLength} step-end infinite alternate;
}
${animationKeyFrames}
  ''')

## @var tCSSKeyframes template entire CSS keyframes rule
tCSSKeyframes = Template('@keyframes ayaya {${keyframes}}')

## @var tCSSKeyframe template for a single CSS keyframe
tCSSKeyframe = Template('${percentage}% {${keyframeRule}}\n')

## @var tCSSKeyframeRule template for a single CSS keyframe inner rule
tCSSKeyframeRule = Template('background:${firstPixel};box-shadow:${boxshadow};')

## ensure no trailiing slash in directory name
def toRegularDirName(dirName):
    if (os.path.split(dirName)[-1] == ''):
      return os.path.split(dirName)[0]
    else:
      return dirName

## write str to a file,named as <exportFileName>.html
def toFile (str,exportFileName):
  with open (exportFileName,'w') as html:
    html.write(str)

## construct HEX Color value for a pixel
#  @param pixel a RGB mode pixel object to be converted
#  @return CSS hex format color value
def toHexColor (pixel):
  return '#{0:02x}{1:02x}{2:02x}'.format(*pixel[:])

## construct RGBA Color value for a pixel
#  @param pixel a RGBA mode pixle object to be comverted
#  @return CSS rgba format color value
def toRGBAColor (pixel):
  return 'rgba({0},{1},{2},{3})'.format(*pixel[:])

def toCSSColor (pixel, mode):
  if (mode == 'RGB'):
    return toHexColor(pixel)
  elif (mode == 'RGBA'):
    return toRGBAColor(pixel)
  else:
    raise UnknownColorMode

## construct single box-shadow param
#  @param color valid CSS color
def toBoxShadowParam (x, y, color):
  return format('%spx %spx 0 %s'%(x, y, color))

## process single image file to html
#  @param fileName input file's name
#  @param export output callback(doc, exportFileName):
#    doc : generated html string
#    exportFileName : output filename
def mipaStatic(fileName,export=''):
  with Image.open(fileName) as im:
    ## what called magic
    boxshadow = ''

    ## file name as sysname
    exportFileName = fileName+'.html'
    title = os.path.split(fileName)[-1]

    ## image size
    width, height = im.size[0], im.size[1]

    #ensure RGB(A) mode
    if (im.mode != 'RGBA' or im.mode != 'RGB'):
      im.convert('RGB')

    firstPixel = toCSSColor(im.getpixel((0,0)), im.mode)
    for y in range(0, height):
      for x in range(0, width):
        color = toCSSColor(im.getpixel((x, y)), im.mode)
        #link magic
        boxshadow += toBoxShadowParam(x, y, color)

        #add a spliter if not the end
        if (not (y == height-1 and x == width-1)):
          #keep a '\n' for text editor ˊ_>ˋ
          boxshadow += ',' + '\n'

    doc = tHTML.substitute(name = title, css = tCSSStatic.substitute(width = width, height = height, boxshadow = boxshadow, firstPixel=firstPixel))
    if (export==''):
      print(doc)
    else:
      export(doc, exportFileName)


## process a image folder
#  files in folder will processed to an animated html
#  process order is filename asend
#  @param dirName input file's name
#  @param export output callback, call with generated html as a string argument
def mipaAnimation(dirName,export=''):
  dirName = toRegularDirName(dirName)
  title = os.path.basename(dirName)
  exportFileName = title + '.html'

  files = os.listdir(dirName)
  files.sort()

  FPS = 24
  mode = ''
  width, height = 0, 0
  frameCount = 0
  keyframeRules = []
  keyframe = ''

  for f in files:
    try:
      with Image.open(os.path.join(dirName, f)) as im:

        if (export!=''):print('processing file --> ' + f)

        frameCount+=1

        #ensure RGB(A) mode
        if (im.mode != 'RGBA' or im.mode != 'RGB'):
          im.convert('RGB');

        #collect animation info
        if (width == 0) : width, height = im.size[0], im.size[1]
        if (mode == '') : mode = im.mode

        firstPixel = toCSSColor(im.getpixel((0,0)), mode)
        boxshadow = ''
        for y in range(0, height):
          for x in range(0, width):
            color = toCSSColor(im.getpixel((x, y)), mode)
            #link magic
            boxshadow += toBoxShadowParam(x, y, color)

            #add a spliter if not the end
            if (not (y == height-1 and x == width-1)):
              #keep a '\n' for text editor ˊ_>ˋ
              boxshadow += ',' + '\n'
        keyframeRules.append(tCSSKeyframeRule.substitute(firstPixel=firstPixel,boxshadow=boxshadow))
    except:
      pass

  percentUnit= 100/frameCount
  for i in range(0,frameCount):
    if (i == frameCount - 1):
      pc = '100'
    elif (i == 0):
      pc = '0'
    else:
      pc = str(percentUnit * i)
    keyframe += tCSSKeyframe.substitute(percentage = pc, keyframeRule = keyframeRules[i])

  if (export!=''):print('generating document...')
  doc = tHTML.substitute(name = title, css = tCSSAnimation.substitute(animationLength = str((1000 / FPS) * frameCount) + 'ms',
                                                                          animationKeyFrames = tCSSKeyframes.substitute(keyframes = keyframe),
                                                                          height = height,
                                                                          width = width))
  #output
  if (export==''):
    print(doc)
  else:
    print('Start exporting...')
    export(doc, exportFileName)
    print('Finished exporting !\nenjoy with your magical ' + exportFileName + ' _(:з」∠)_')


for path in sys.argv[1:]:
  if os.path.isfile(path):
    ##export to stdout
    #mipaStatic(path)

    ##export to autonamed file
    mipaStatic(path,toFile)
  elif os.path.isdir(path):
    #mipaAnimation(path)
    mipaAnimation(path,toFile)
```
