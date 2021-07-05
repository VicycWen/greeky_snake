var sw=20, //方块宽
    sh=20,
    tr=30, //行数
    td=30;

var snake = null,
    food = null,
    game = null;

// 创建方块对象
function Square(x,y,className){
    // x,y 表示坐标，className表示方块样式
    this.x = x * sw;
    this.y = y * sh;
    this.class = className;

    this.viewContent = document.createElement('div');
    this.viewContent.className=this.class;
    this.parent = document.getElementById('snakeWrap');
    
}

// 创建方块的样式
Square.prototype.create = function(){
    this.viewContent.style.position = "absolute";
    this.viewContent.style.width = sw + 'px';
    this.viewContent.style.height = sh + 'px';
    this.viewContent.style.left = this.x + 'px';
    this.viewContent.style.top = this.y + 'px';

    this.parent.appendChild(this.viewContent);
}

// 从父级移除方块对象
Square.prototype.remove = function(){
    this.parent.removeChild(this.viewContent);
}

// 蛇对象
function Snake(){
    this.head = null;
    this.tail = null;
    this.pos = []; // 蛇方块位置（二维数组）

    this.directionNum = {
        left:{
            x:-1,
            y:0,
            rotate:180,
        },
        right:{
            x:1,
            y:0,
            rotate:0,
        },
        up:{
            x:0,
            y:-1,
            rotate:-90,
        },
        down:{
            x:0,
            y:1,
            rotate:90,
        }

    }; // 存储蛇走的方向
}

Snake.prototype.init = function(){
    // 初始化蛇
    var snakeHead = new Square(2,0,'snakeHead');
    snakeHead.create();
    this.head = snakeHead; // 存储蛇头信息
    this.pos.push([2, 0]); //

    var snakeBody1 = new Square(1, 0, 'snakeBody');
    snakeBody1.create();
    this.pos.push([1, 0]);

    var snakeBody2 = new Square(0, 0, 'snakeBody');
    snakeBody2.create();
    this.tail = snakeBody2;
    this.pos.push([0, 0]);

    // 形成链表
    snakeHead.last = null;
    snakeHead.next = snakeBody1;

    snakeBody1.last = snakeHead;
    snakeBody1.next = snakeBody2;

    snakeBody2.last = snakeBody1;
    snakeBody2.next = null;
    
    // 蛇默认走的方向
    this.direction = this.directionNum.right;
}

// 按方向获取下一个位置元素，同时根据该元素做不同的事情
Snake.prototype.getNextPos = function(){
    var nextPos = [
        this.head.x / sw + this.direction.x,
        this.head.y / sh + this.direction.y,
    ]
    
    //下个点是自己，代表撞到了自己，游戏结束
    var selfCollied = false;
    this.pos.forEach(function(value){
        if (value[0] == nextPos[0] && value[1] == nextPos[1]){
            selfCollied = true;
        }
    })
    if (selfCollied){
        // console.log("撞到自己了");
        this.strategies.die.call(this);
        return;
    }

    //下个点是围墙，游戏结束
    if (nextPos[0] < 0 || nextPos[1] < 0 || nextPos[0] > td - 1 || nextPos[1] > tr - 1){
        // console.log("撞到墙上了")
        this.strategies.die.call(this);
        return;
    }

    //下个点是食物，吃
    if (nextPos[0] == food.pos[0] && nextPos[1] == food.pos[1]){
        this.strategies.eat.call(this);
    }

    //下个点什么都不是，走
    this.strategies.move.call(this,false); // 使父级调用

}

// 蛇要做的事情
Snake.prototype.strategies = {
    move: function(format){ // 该参数决定要不要保留蛇尾
        // 创建新身体，形成链表，删除头部
        var newBody = new Square(this.head.x/sw, this.head.y/sh, 'snakeBody');
        newBody.last = null;
        newBody.next = this.head.next;
        newBody.next.last = newBody;

        this.head.remove();
        newBody.create();

        // 在下个到达的点创建蛇头
        var newHead = new Square(this.head.x / sw + this.direction.x,
            this.head.y / sh + this.direction.y, 'snakeHead');
        newHead.create();
        newHead.viewContent.style.transform = 'rotate('+this.direction.rotate+'deg)';
        newHead.last = null;
        newHead.next = newBody;
        newBody.last = newHead;

        // 更新蛇的坐标和头部

        this.pos.splice(0,0,[this.head.x / sw + this.direction.x,
            this.head.y / sh + this.direction.y])
        this.head = newHead;

        // 删除蛇尾，更新蛇尾及其坐标
        if (!format){
            this.tail.remove();
            this.tail = this.tail.last;
            this.tail.next = null;
            this.pos.pop(); 
        }          
    },
    eat: function(){
        this.strategies.move.call(this,true);
        game.score++;
        var scoreDom = document.getElementById('score');
        scoreDom.innerHTML = game.score;
        // console.log(game.score);
        createFood();
    },
    die: function(){
        game.end();
    },
}

// 可以将innerHTML置为空并新建Snake对象来代替如下函数
// Snake.prototype.remove = function(){
//     this.pos = [];
//     var curr = this.head;
//     while (curr){
//         curr.remove();
//         curr = curr.next;
//     } 
// }

snake = new Snake();

// 创建食物
function createFood(){
    var x = null,
        y = null;
    
    var include = true; // 表示食物是否在蛇身上
    while (include){
        x = Math.round(Math.random() * (td - 1));
        y = Math.round(Math.random() * (tr - 1));

        snake.pos.forEach(function(value){
            if(x != value[0] || y != value[1]){
                include = false;
            }
        })

    }
        
    var foodDom = document.querySelector('.food');
    if (foodDom){
        foodDom.style.left = x * sw + 'px';
        foodDom.style.top = y * sh + 'px';
    } else{
        food = new Square(x, y, 'food');
        food.create();
    }
    food.pos = [x, y];
}


// 控制游戏
function Game(){
    this.timer = null;
    this.score = 0;
}

Game.prototype.init = function(){
    snake.init();
    createFood();    

    // document.onkeydown = function(ev){
    //     if (ev.key == 48){
    //       console.log('left');  
    //     }
    // }
    document.addEventListener("keydown", operationMode.keyboardMode);
    document.addEventListener("dblclick", operationMode.pauseClick);

    this.start();
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


Game.prototype.start = function(){
    document.addEventListener('click',operationMode.clickMode);
    try {
        content.removeChild(mask);
    } catch (e){
        
    }

    this.timer = setInterval(function(){
        snake.getNextPos();
    },200)
}
Game.prototype.pause = function(){
    clearInterval(this.timer);
    document.removeEventListener('click', operationMode.clickMode);    

    content.appendChild(mask);
}

Game.prototype.end = function(){
    clearInterval(this.timer);
    // snake.remove();
    // food.remove();
    let snakeWrap = document.querySelector('#snakeWrap');
    snakeWrap.innerHTML = '';
    snake = new Snake();
    game = new Game();

    alert("你的得分：" + this.score);

    var scoreDom = document.getElementById('score');
    scoreDom.innerHTML = '0';

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    let closeZone = document.getElementsByClassName('close');
    closeZone[0].parentNode.parentNode.style.display = 'block';
    closeZone[0].parentNode.style.display = 'block';

    document.removeEventListener("dblclick", operationMode.pauseClick);
    document.removeEventListener("keydown", operationMode.keyboardMode);
    document.removeEventListener('click', operationMode.clickMode);   
}

// 开始游戏
game = new Game();
var startBtn = document.querySelector('.startBtn button');
var pauseBtn = document.querySelector('.pauseBtn button');
var helpBtn = document.querySelector('.helpBtn button');
startBtn.onclick = function(){
    let closeZone = document.getElementsByClassName('close');
    closeZone[0].parentNode.parentNode.style.display = 'none';
    this.disabled = true;
    pauseBtn.disabled = false;
    helpBtn.parentNode.style.display = 'none';
    game.init();
}

// 暂停游戏
// var snakeWrap = document.getElementById('snakeWrap');


pauseBtn.onclick = function(){
    if (pauseBtn.innerHTML == "暂停游戏"){
        game.pause();
        pauseBtn.innerHTML = '继续游戏';
    } else{
        game.start();
        pauseBtn.innerHTML = "暂停游戏";
    }
}

function createMask(){
    var myDiv = document.createElement('div');
    var myP = document.createElement('p');
    myDiv.style.width = '100%';
    myDiv.style.height = '100%';
    myDiv.style.backgroundColor = 'rgba(0,0,0,0.25)';
    myDiv.style.position = 'absolute';
    myDiv.style.zIndex = 12;
    myDiv.style.top = 0;
    myDiv.style.textAlign = 'center';


    myP.innerHTML = '游戏暂停中...';
    myP.style.width = '20%';
    myP.style.color = 'white';
    myP.style.margin = '50% auto';
    myP.style.padding = '2%';
    myP.style.transform = 'translate(0, -50%)';
    myP.style.border = '1px solid white';
    myP.style.borderRadius = '50%';
    myDiv.appendChild(myP);
    // content.appendChild(myDiv);
    // document.createElement('p')
    return myDiv;
}

var mask = createMask();
var content = document.querySelector('.content');
// content.appendChild(mask);
// content.removeChild(mask);




