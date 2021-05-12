; (function ($) {
    "use strict"
    // banner插件
    // console.log($)
    // 控制DOM元素
    // 1. 向jq的DOM绑定方法
    $.fn.banner = function (ops) {
        // 2. 参数的处理，注意可选参数的默认值
        const { imgs, btn = true, list = true, autoPlay = true, delayTime = 3000, moveTime = 300 } = ops;
        let index = (ops.index > imgs.length - 1 ? ops.index = imgs.length - 1 : ops.index) || 0;
        // console.log(imgs, btn, list, autoPlay, delayTime, moveTime, index);

        // 7. 假设要走的图片的索引
        let prev = imgs.length - 1;

        // 3. 创建轮播图的基本结构
        const oimgBox = $("<div class='imgBox'>");
        imgs.forEach(val => {
            oimgBox.append($(`<a href='#'>`).append($(`<img src="${val.src}" title="${val.title}" alt="${val.alt}">`)))
        });
        oimgBox.appendTo(this).css({
            width: 1000,
            height: 300
        })
            .children("a").css({
                position: "absolute",
                left: 1000,
                top: 0
            }).eq(index).css({
                left: 0
            }).end()
            .children("img").css({
                width: 'auto',
                height: 'auto'
            });

        // 4. 规划：左右按钮，分页器，自动播放，都是根据用户的传参决定是否添加
        if (btn) {
            // 5-1. 创建左右按钮
            // console.log("左右按钮的功能")
            $("<div class='ctrl'>").appendTo(this).css({}).append($("<button class='bt_prv'></button>")).append($("<button class='bt_nxt'></button>")).children("button").eq(0).css({
                left: 0
            }).click(leftRight).end().eq(1).css({
                right: 0
            }).click(rightClick)
        }

        function leftRight() {    // 6-1. 绑定左按钮事件
            // 8-1. 切换索引
            // console.log("左")
            if (index === 0) {
                index = imgs.length - 1;
                prev = 0
            } else {
                index--
                prev = index + 1;
            }
            // 9-1. 准备运动
            btnMove(1)
        }

        function rightClick() {    // 6-2. 绑定右按钮事件
            // 8-2. 切换索引
            // console.log("右")
            if (index === imgs.length - 1) {
                index = 0;
                prev = imgs.length - 1
            } else {
                index++
                prev = index - 1;
            }
            // 9-2. 准备运动
            btnMove(-1)
        }

        function btnMove(d) {
            // 10. 开始运动
            // 先设置要走的图片的初始位置，然后通过动画设置到目标位置
            // 再设置要进来的图片的初始位置，然后通过动画设置到目标位置
            oimgBox.children("a").eq(prev).css({
                left: 0
            }).stop().animate({
                left: 1000 * d
            }, moveTime).end()
                .eq(index).css({
                    left: -1000 * d
                }).stop().animate({
                    left: 0
                }, moveTime)

            // 16. 点击左右按钮后，也需要设置分页器的当前项
            setActive();
        }

        if (list) {
            // 5-2. 创建分页器
            // console.log("分页器功能")
            var listEle = $("<ul class='list'>").appendTo(this).css({
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 30,
                display: "flex",
                background: "rgba(200,200,200,0.6)",
                padding: 0,
                margin: 0
            })

            imgs.forEach((val, idx) => {
                listEle.append($("<li>" + (idx + 1) + "</li>"))
            })

            listEle.children("li").css({
                flex: 1,
                lineHeight: "30px",
                borderLeft: "solid 1px #fff",
                borderRight: "solid 1px #fff",
                listStyle: "none",
                textAlign: "center"
            }).eq(index).css({
                background: "red",
                color: "#fff"
            }).end().click(function () {  // 11. 给所有li绑定事件
                // console.log("要走的：", index)
                // console.log("点击了：", $(this).index())

                // 12. 根据点击的li的索引和当前索引的大小，判断运动的方向
                if ($(this).index() > index) {
                    // console.log("左")
                    listMove(-1, $(this).index())
                }
                if ($(this).index() < index) {
                    // console.log("右")
                    listMove(1, $(this).index())
                }

                // 14. 点击之后，将点击的索引，设置到index，为下次要离开的索引
                index = $(this).index();

                // 15. 设置li的当前项
                setActive();
            })

            function listMove(d, i) {
                // 13. 开始运动
                // 先设置要走的图片的初始位置，然后通过动画设置到目标位置
                // 再设置要进来的图片的初始位置，然后通过动画设置到目标位置
                oimgBox.children("a").eq(index).css({
                    left: 0
                }).stop().animate({
                    left: 1000 * d
                }, moveTime).end()
                    .eq(i).css({
                        left: -1000 * d
                    }).stop().animate({
                        left: 0
                    }, moveTime)
            }
        }

        // 设置li当前项的功能
        function setActive() {
            // 先判断是否需要分页器，如果没有分页器，不需要此功能
            if (!list) return;

            listEle.children("li").css({
                background: "",
                color: ""
            }).eq(index).css({
                background: "red",
                color: "#fff"
            })
        }

        if (autoPlay) {
            // console.log("自动播放")
            // 17. 开启计时器
            let t = setInterval(() => {
                // $("#right").trigger("click")
                rightClick()
            }, delayTime);

            // 18. 鼠标进入停止，鼠标离开继续
            this.hover(function () {
                clearInterval(t)
            }, function () {
                t = setInterval(() => {
                    rightClick()
                }, delayTime);
            })
        }

        //表示执行当前插件方法的对象（其实就是jq的DOM元素）
        // console.log(this);
    }
})(jQuery);

