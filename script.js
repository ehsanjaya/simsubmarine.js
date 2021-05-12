var container = document.getElementById("container");
var life = document.getElementById("life");
var playerLife = 3;
var score = document.getElementById("score");
var playerScore = 0;
var playerSpeed = document.getElementById("speed");
var player = document.getElementById("player");
var playerLeft = player.offsetLeft;
var playerWidth = player.offsetWidth;
var playerTop = player.offsetTop;
var zIndex = 10000;
var speed = 4;
var pause = false;

document.addEventListener("keydown", function(event){
    if(event.keyCode == 13)
    {
        if(pause == false)
        {
            pause = true;
        }
        else
        {
            pause = false;
        }
    }

    if(event.keyCode == 32)
    {
        createTorpedo();
    }
    else if(event.keyCode == 38)
    {
        if(speed < 14)
        {
            speed++;
        }
    }
    else if(event.keyCode == 40)
    {
        if(speed > 4)
        {
            speed--;
        }
    }
    else if(event.keyCode == 37)
    {
        shiftStones("left");
    }
    else if(event.keyCode == 39)
    {
        shiftStones("right");
    }

    
    playerSpeed.innerHTML = speed + " knot/h";
});

function createTorpedo() {
    var torpedo = document.createElement("div");
    container.append(torpedo);
    torpedo.className = "torpedo"; 
    var width = playerWidth / 2;
    torpedo.style.left = playerLeft + width - 80 + "px";
    torpedo.style.top = playerTop + "px";
}

function shiftStones(direction) {
    var stones = document.getElementsByClassName("stone");
    var shift = 0;
    if (direction == "left") {
        shift = 27;
    }
    else if (direction == "right") {
        shift = -27
    }
    
    for (var i = 0; i < stones.length; i++)
    {
        var stone = stones[i];
        var stoneLeft = stone.offsetLeft;
        stoneLeft += shift;
        stone.style.left = stoneLeft + "px";
    }
}

var createStoneInterval = setInterval(function(){
    if(!pause)
    {
        var stones1 = document.getElementsByClassName("stone");
        if(stones1.length < 7)
        {
            var width = document.body.offsetWidth;
            var height = document.body.offsetHeight;
            var stone = document.createElement("div");
            container.append(stone);
            stone.className = "stone";
            var left = Math.floor(Math.random()*width);
            var top = Math.floor(Math.random()*((height/3)-(height/4)+1)+(height/4));
            stone.style.left = left + "px";
            stone.style.top = top + "px";
            
            var random = Math.floor(Math.random()*(100-10+1)+10);
            stone.style.width = random + "px";
            stone.style.height = random + "px";
            stone.style.zIndex = zIndex--;
            
            var size = Math.floor(Math.random()*(400-100+1)+100);
            stone.setAttribute("size", size);
        }
    }
},700);

var moveStoneInterval = setInterval(function(){
    if(!pause)
    {   
        var stones = document.getElementsByClassName("stone");
        for(var i = 0;i < stones.length;i++)
        {
            var stone = stones[i];
            var stoneTop = stone.offsetTop;
            var stoneHeight = stone.offsetHeight;
            var height = document.body.offsetHeight;

            stoneTop+=speed;
            stone.style.top = stoneTop + "px";
            var size = stone.getAttribute("size");
            stone.style.width = size + "px";
            stone.style.height = size + "px";
            if((stoneTop + stoneHeight) >= (4/5*height))
            {
                stone.remove();
            }

            if(playerLife == 0)
            {
                setInterval(function(){
                    player.classList.add("boom");
                },7);
                stop();
            }

            if(!stone.classList.contains("boom"))
            {
                if(touching(player, stone))
                {
                    playerLife--;
                    life.innerHTML = "life:" + playerLife;
                    player.classList.add("boom");
                    stone.classList.add("boom");
                    setTimeout(function(){
                        player.classList.remove("boom");
                        stone.classList.remove("boom");
                        stone.remove();
                    },400);
                }
            }
        }
    }
},80);

var moveTorpedoInterval = setInterval(function(){
    if(!pause)
    {
        var torpedoes = document.getElementsByClassName("torpedo");
        for(var i = 0;i < torpedoes.length;i++)
        {
            var torpedo = torpedoes[i];
            var torpedoTop = torpedo.offsetTop;
            torpedoTop-=7;
            torpedo.style.top = torpedoTop + "px";

            var torpedoLeft = torpedo.offsetLeft;
            torpedoLeft+=1;
            torpedo.style.left = torpedoLeft + "px";

            torpedo.style.width = "1px";
            torpedo.style.height = "1px";

            if(torpedoTop < 0)
            {
                torpedo.remove();
            }

            var stones = document.getElementsByClassName("stone");
            for(var j = 0; j < stones.length; j++)
            {
                var stone = stones[j];

                if(touching(torpedo, stone))
                {
                    playerScore++;
                    score.innerHTML = "score:" + playerScore;
                    torpedo.remove();
                    stone.classList.add("boom");
                    setTimeout(function(){
                        stone.classList.remove("boom");
                        stone.remove();
                    },1);
                }
            }
        }
    }
},20);

function stop()
{
    clearInterval(createStoneInterval);
    clearInterval(moveStoneInterval);
    clearInterval(moveTorpedoInterval);
}

function touching(element1, element2)
{
    var rect1 = element1.getBoundingClientRect();
    var rect2 = element2.getBoundingClientRect();

    var overlap = !(rect1.right < rect2.left || rect2.right < rect1.left || rect1.bottom < rect2.top || rect2.bottom < rect1.top);
    return overlap;
}