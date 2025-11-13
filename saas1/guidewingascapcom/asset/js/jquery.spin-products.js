/*
 *	Plugin Name: SpinProducts
 * 	Settings:
 *  @imgPath
 *	type: string or array
 * 	Default: 'archive/360slider/images'
 * 	Example: 'archive/360slider/images' or ['path1', 'path2', 'path3']
 *
 *  @fileType
 * 	Type: string
 * 	Default: 'jpeg'
 */
(function ($) {
    function spinProducts(targetClass, settings) {
        const settingsType = typeof settings.imgPath;
        let pathType = undefined;
        
        if (settingsType === 'string') pathType = 'one';
        if (settingsType === 'object') pathType = 'multiple';
        
        targetClass.each((item, index) => {
            spinProducts(index, item, pathType);
        })
        
        function spinProducts(target, targetId, pathType = '') {
            const targetElement = $(target);
            let x = 0;  // 滑鼠拖動某一個點,用該點的位置來改變src
            let speed = 0;
            let lastX = 0;
            let timer = null;  // timer
            let temp = 0;
            
            // get images in folder
            for (let i = 1; i <= 36; i++) {
                const oNewImage = $('<img alt="">');  // Create Element
                const fileNameCount = i < 10 ? '0' + i : i;
                
                if (pathType === 'one') {
                    // One path
                    oNewImage.attr('src', `${settings.imgPath}/${fileNameCount}.${settings.fileType}`);  // path string
                } else if (pathType === 'multiple') {
                    // Multiple path
                    oNewImage.attr('src', `${settings.imgPath[targetId]}/${fileNameCount}.${settings.fileType}`);
                } else {
                    // Path error
                    console.error(`spinProducts imgPath error, filePath: ${settings.imgPath}`);
                }
                
                oNewImage.css({
                    width: '100%',
                    display: 'none',  // Hide 36 images
                });
                targetElement.append(oNewImage);
            }
            
            const originImg = targetElement.children('img')[0];  // First image
            const imgElements = targetElement.children('img');  // image Elements
            let lastImage = originImg;
            
            
            // MouseDown Event (touchstart for mobile)
            targetElement.on('mousedown touchstart', function (ev) {
                clearInterval(timer);
                let oEvent = ev || event;
                if (ev.clientX === undefined) {  // if mobile: event.changedTouches
                    oEvent = ev.changedTouches[0];
                }
                const distX = parseInt(oEvent.clientX) - x;
                
                
                // Mousemove Event (touchmove for mobile)
                targetElement.on('mousemove touchmove', function (ev) {
                    
                    let oEvent = ev || event;
                    if (ev.clientX === undefined) {
                        oEvent = ev.changedTouches[0];  // if mobile: event.changedTouches
                    }
                    
                    x = parseInt(oEvent.clientX) - distX;
                    setMove();  // Change image
                    
                    speed = x - lastX; // 記錄前後兩個速度
                    lastX = x;
                    return false;  // disable drag event
                })
                
                
                // Mouseup Event
                targetElement.on('mouseup', function () {
                    // Remove mouse event
                    targetElement.unbind('mousemove');
                    targetElement.unbind('mouseup');
                    
                    timer = setInterval(function () {
                        x += speed;
                        setMove();
                    }, 30);
                })
                
                // Mouse Move
                function setMove() {
                    if (speed > 0) {
                        speed--;
                    } else if (speed === 0) {
                        clearInterval(timer);
                    } else {
                        speed++;
                    }
                    
                    temp = -x;
                    if (temp > 0) {
                        temp = -x % 36;
                    } else {
                        temp = -x + (-Math.floor(-x / 36) * 36);
                    }
                    
                    $(lastImage).css('display', 'none');  // last images to hide
                    $(imgElements[temp]).css('display', 'block');  // first images to display
                    lastImage = imgElements[temp];
                }
                
                return false;
            })
        }
    }
    
    // Default Settings
    $.fn.extend({
        spinProducts: function (options) {
            const settings = $.extend({
                imgPath: 'archive/360slider/images',
                fileType: 'jpeg',
            }, options);
            spinProducts(this, settings)
        }
    })
})(jQuery)