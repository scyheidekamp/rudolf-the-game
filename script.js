const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
console.log(ctx);
canvas.width = innerWidth;
canvas.height = 720;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;


const backgroundLayer1 = new Image();
backgroundLayer1.src = 'img/sky.png'
const backgroundLayer2 = new Image();
backgroundLayer2.src = 'img/mountains.png'
const backgroundLayer3 = new Image();
backgroundLayer3.src = 'img/forest.png'
const backgroundLayer4 = new Image();
backgroundLayer4.src = 'img/trees.png'
const backgroundLayer5 = new Image();
backgroundLayer5.src = 'img/foreground.png'
const backgroundLayer6 = new Image();
backgroundLayer6.src = 'img/rudolf.png'

window.addEventListener('load', function(){

    const gravity = 0.2
    let gameSpeed = 0
    let scrollOffset = 0


    class Player{
        constructor(image){
            this.position = {
                x:500,
                y:350
            }
            this.velocity ={
                x:0,
                y:0
            }
            this.width = 77
            this.height = 150
            this.image = image;
        } 
        draw(){
            ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
        update(){
            this.draw()
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
            if (this.position.y + this.height + this.velocity.y < canvas.height - 12)
                this.velocity.y += gravity
            else this.velocity.y = 0
        }
    }

    class Platform{
        constructor({x, y, width}){
            this.position = {
                x,
                y
            }
            this.width = width
            this.height = 20
        }
        draw (){
            ctx.fillStyle = 'rgb(255,0,255,0)'
            ctx.fillRect(this.position.x, this.position.y, this.width, this.height)
        }

    }
    
    class Layer{
        constructor(image, speedModifier){
            this.x = 0;
            this.y = 0;
            this.width = 2709;
            this.height = 719;
            this.image = image;
            this.speedModifier = speedModifier;
            this.speed = gameSpeed * this.speedModifier;
        }
        update(){
            this.speed = gameSpeed * this.speedModifier;
            if (this.x <= -this.width){
                this.x = 0;
            }
            this.x = Math.floor(this.x - this.speed);
        }
        draw(){
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
            ctx.drawImage(this.image, this.x - this.width, this.y, this.width, this.height);
        }
    }
    
    const layer5 = new Layer(backgroundLayer5, 2);
    const layer4 = new Layer(backgroundLayer4, 1.5);
    const layer3 = new Layer(backgroundLayer3, 1);
    const layer2 = new Layer(backgroundLayer2, 0.5);
    const layer1 = new Layer(backgroundLayer1, 0);
    
    const gameObjects = [layer1, layer2, layer3, layer4, layer5];
    
    const player = new Player(backgroundLayer6);
    const platforms = [new Platform({x: 830, y:600, width:200}),
        new Platform({x: 1030, y:530, width:300}),new Platform({x: 1350, y:580, width:30}),
        new Platform({x: 1400, y:600, width:100}),new Platform({x: 1540, y:590, width:30}),
        new Platform({x: 1600, y:550, width:30}),new Platform({x: 2570, y:600, width:100})]
    const keys = {
        right:{
            pressed: false
        },
        left:{
            pressed: false
        }
    }

    const refreshButton = document.querySelector('.refresh-button');
    const refreshPage = () => {
        location.reload();
    }

    refreshButton.addEventListener('click', refreshPage)
    

    function animate(){
        ctx.clearRect(0,0, CANVAS_WIDTH, CANVAS_HEIGHT);
        gameObjects.forEach(object => {
            object.update();
            object.draw();
        });
        platforms.forEach(platform => {
            platform.draw();
        });
        requestAnimationFrame(animate);
        player.draw()
        player.update()
        
        if (keys.right.pressed && player.position.x <600){
            player.velocity.x = 5
        } else if (keys.left.pressed && player.position.x > 200){
            player.velocity.x = -5
        } else {
            player.velocity.x = 0
            if (keys.right.pressed){
                scrollOffset += 5
                gameSpeed = 2.5
                platforms.forEach(platform => {
                    platform.position.x -= 5
                });
            } else if (keys.left.pressed){
                scrollOffset -= 5
                gameSpeed = -2.5
                platforms.forEach(platform => {
                    platform.position.x += 5
                    
                });
            } else (gameSpeed = 0)
        }
        console.log(scrollOffset)

        //platform collision detection
        platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && 
            player.position.y + player.height + player.velocity.y >= platform.position.y 
            && player.position.x + player.width >= platform.position.x 
            && player.position.x <= platform.position.x + platform.width){
            player.velocity.y = 0 
            }
        })
        if (scrollOffset > 2709){
            console.log('you win')
            document.getElementById('win').style.visibility = "visible";
        }
    }
    animate();

    window.addEventListener('keydown', ({keyCode}) => {
        switch (keyCode){
            case 37:
                console.log('left')
                keys.left.pressed = true
                break
            case 39:
                console.log('right')
                keys.right.pressed = true
                break
            case 38:
                console.log('up')
                player.velocity.y = -7
                break
        }
        console.log(keys.right.pressed)
    })
    window.addEventListener('keyup', ({keyCode}) => {
        switch (keyCode){
            case 37:
                console.log('left')
                keys.left.pressed = false
                break
            case 39:
                console.log('right')
                keys.right.pressed = false
                break
            case 38:
                console.log('up')
                break
            case 40:
                console.log('down')
                break
        }
    })
});


