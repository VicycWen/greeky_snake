// 颜色不能设置为空或none，可以设置为rgba(0,0,0,0)

// 关闭操作说明
var closeZone = document.getElementsByClassName('close');
closeZone[0].onclick = function() {
    // this.parentNode.className = this.parentNode.className + ' hide';
    
    this.parentNode.classList.add('hide');
    console.log(this.parentNode.classList)
    // removeGreyBackground();
}

// 打开操作说明
var helpBtn = document.querySelector('.helpBtn button');
helpBtn.onclick = function(){
    let classList = closeZone[0].parentNode.classList;
    if (classList.contains('hide')){
        classList.remove('hide');
    } else {
        classList.add('hide');
    }
}

// 操作模式
function operationMode(){
    this.clickMode = null;
    this.keyboardMode = null;
    this.pauseClick = null;
}

operationMode.clickMode = function mouseClickOperation(event) {
    var e = event;
    // console.log(e);
    const x1 = e.pageX;
    const y1 = e.pageY;

    var snakeHead = document.querySelector('.snakeHead');
    if (snakeHead){

        snakeHeadPos = getElementPagePosition(snakeHead);
        const x0 = snakeHeadPos.x;
        const y0 = snakeHeadPos.y;
        let newDirection = calculateDirection(x0,y0,x1,y1);
        // console.log(newDirection);

        if (newDirection == 'right' && snake.direction != snake.directionNum.left){
            snake.direction = snake.directionNum.right;
        } else if (newDirection == 'down' && snake.direction != snake.directionNum.up){
            snake.direction = snake.directionNum.down;
        } else if (newDirection == 'left' && snake.direction != snake.directionNum.right){
            snake.direction = snake.directionNum.left;
        } else if (newDirection == 'up' && snake.direction != snake.directionNum.down){
            snake.direction = snake.directionNum.up;
        }
    }
    
    return {'x':e.pageX,'y':e.pageY};
}

function calculateDirection(x0,y0,x1,y1){
    if (x0 == x1){
        if (y1 >= y0){
            return 'down';
        } else{
            return 'up';
        }
    } else{
        const dx = x1-x0;
        const dy = y1-y0;
        const k = dy/dx;
        let angle = Math.atan(k) * 180 / Math.PI;
        if (dx > 0 && dy < 0){
            angle += 360;
        } else if((dx < 0 && dy < 0) || (dx < 0 && dy >= 0)){
            angle += 180;
        }
        // console.log(angle);

        if (angle >= 315 || angle < 45){
            return 'right';
        } else if(angle < 315 && angle >= 225){
            return 'up';
        } else if(angle < 225 && angle >= 135){
            return 'left';
        } else{
            return 'down';
        }
    }
}

function getElementPagePosition(element){
    //计算x坐标
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null){
      actualLeft += current.offsetLeft;
      current = current.offsetParent;
    }
    //计算y坐标
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null){
      actualTop += (current.offsetTop+current.clientTop);
      current = current.offsetParent;
    }
    //返回结果
    return {x: actualLeft, y: actualTop}
  }
  
operationMode.keyboardMode = function(ev){
    // alert(ev.code); // 显示键盘字符串
    if (ev.key == 'd' && snake.direction != snake.directionNum.left){
        snake.direction = snake.directionNum.right;
    } else if (ev.key == 's' && snake.direction != snake.directionNum.up){
        snake.direction = snake.directionNum.down;
    } else if (ev.key == 'a' && snake.direction != snake.directionNum.right){
        snake.direction = snake.directionNum.left;
    } else if (ev.key == 'w' && snake.direction != snake.directionNum.down){
            snake.direction = snake.directionNum.up;
    } else if (ev.key == 'q'){
        pauseBtn.onclick();
    }
}

operationMode.pauseClick = function(ev){
    pauseBtn.onclick();
}