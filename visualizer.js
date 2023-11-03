const microphone = new Microphone();

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Ball {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.color = '#F8B195'; 
        this.jumpForce = 0;
        this.fallForce = 0.1;
        this.isFalling = true;
    }

    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 4);
        ctx.fill();
    }

    fall(){
        this.jumpForce = 0;
        this.y += this.fallForce;
        this.fallForce += 0.05;


    }

    jump(){
        this.fallForce = 0;
        this.y -= this.jumpForce;
        this.jumpForce -= 0.05;
    }

    colorChange(){
        const colors = ['#F8B19588', '#F6728088', '#C06C8488', '#6C5B7B88', '#355C7D88']
        const colorId = Math.floor(Math.random() * colors.length)
        this.color = colors[colorId]
    }

}

let balls = [];

const generateBalls = () => {
    const distance = 30;
    const amountOfBalls = (canvas.width/distance) - 2;
    for (let i = 0; i < amountOfBalls; i++) {
        balls.push(new Ball(distance + (i * distance), 50))
        
    }
}

generateBalls()

function animate(){
    if (microphone.initialized){
        ctx.clearRect(0,0, canvas.width, canvas.height);
        const samples = microphone.getSamples();

        balls.forEach((ball, index) => {
            if (ball.isFalling && ball.y < canvas.height/2){
                ball.fall();
            } else if (ball.y >= canvas.height/2){
                ball.isFalling = false;
                ball.jumpForce = Math.abs(samples[index])*20;
                ball.radius = ball.jumpForce * 15;

                if (Math.abs(samples[index]) >= 0.1) {
                    ball.colorChange()
                } else if(Math.abs(samples[index]) <= 0.1){
                    ball.color = '#F8B195';
                }

                //balls jump force
            }
            if(ball.isFalling == false){
                ball.jump();
                if(ball.jumpForce <= 0){
                    ball.isFalling = true;
                    ball.radius = 10;
                }
            }

            ball.draw();     
        })
    }
    requestAnimationFrame(animate);
}
animate();

// window.addEventListener('resize', () => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     balls = []
//     generateBalls()
// })
