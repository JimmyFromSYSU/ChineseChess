# 中国象棋UI（Javascript离线版）

"观棋不语" 是一款让理查德.狄克.强输得心服口服，无话可说而开发的中国象棋AI。中国象棋UI则是帮助调试"观棋不语"而先行开发的一款基于Javascript和Crafty.js游戏引擎的象棋前端UI。

## Demo
由于使用htmlpreview进行的展示，可能加载会比较缓慢。

* 人人对战：[人人对战](http://htmlpreview.github.io/?https://raw.githubusercontent.com/JimmyFromSYSU/ChineseChessUI_Javascript/master/UIUI.html)  
* 人机对战：[人机对战](http://htmlpreview.github.io/?https://raw.githubusercontent.com/JimmyFromSYSU/ChineseChessUI_Javascript/master/UIAI.html)  
* 机机对战：[观棋不语](http://htmlpreview.github.io/?https://raw.githubusercontent.com/JimmyFromSYSU/ChineseChessUI_Javascript/master/AIAI.html)
* 残局对战：[一虎下山](http://htmlpreview.github.io/?https://raw.githubusercontent.com/JimmyFromSYSU/ChineseChessUI_Javascript/master/end.html)  

在残局对战中，由AI先手解残局。该残局需要9~10步的棋力才能解开，目前前台AI的棋力只有4步。


## 已完成功能
* 基本棋局显示。
* 游戏流程和胜负判别。
* 基本UI玩家。
* 初始布局设置，可设置为任意残局。
* 走子生成器：自动走子和AI算法基础。
* 玩家认输，这样迪克就可以提前认输。(need test)
* 离线AI玩家：一个简单的AI实现（极大极小搜索+$\alpha \beta$剪枝+人工评估函数打表）。

## 待加入功能
* 网络玩家：需要后台服务器提供联机，棋局记录以及AI等服务。
* 至此可以正式开始较强中国象棋AI的开发。
* 本地走子历史栈：悔棋功能，允许迪克悔棋。
* 本地计时器：定时不走子的一方强制走子，防止迪克耍赖。
* - 同以页面显示多个静态棋局。
