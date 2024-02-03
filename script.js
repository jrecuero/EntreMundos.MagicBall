// Adjust speed to the desired value
let speed = 2;
let oldSpeed = speed;
let speedUpdated = false;

const ballRatio = 50

function updateSpeed() {
    oldSpeed = speed;
    speed = parseFloat(document.getElementById("speedInput").value);
    speedUpdated = true;
}

let audioObj = {
    files: ["skylines.mp3", "imperial.mp3"],
    len: this.files.length,
    audios: [],
    obj: null, 
    init: function() {
        for (let i = 0; i < this.len; i++) {
            var audio = new Audio(this.files[i]);
            this.audios.push(audio)
            audio.addEventListener("ended", function() {
                audio.currentTime = 0;
                index = (i + 1) % this.len;
                this.obj = this.audios[index];
                this.obj.play();
            });
        }
    }
}

let audioOne = new Audio("skylines.mp3");
let audioTwo = new Audio("imperial.mp3");
var audio = audioOne;

audioOne.addEventListener("ended", function() {
    audioOne.currentTime = 0;
    audio = audioTwo;
    audioTwo.play()
});

audioTwo.addEventListener("ended", function() {
    audioTwo.currentTime = 0;
    audio = audioOne;
    audioOne.play()
});

// Handling right click mouse
// window.addEventListener('contextmenu', (ev) => {
//     ev.preventDefault();
//     console.log('right clicked')
// });

document.addEventListener("DOMContentLoaded", function() {
    
    // Get canvas element
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // // Function to resize canvas
    // function resizeCanvas() {
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight - 200;
    // }

    // // Set initial canvas size
    // resizeCanvas();

    // window.addEventListener("resize", resizeCanvas);

    // Set initial ball position
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;

    // Set target position for smooth movement
    let targetX = ballX;
    let targetY = ballY;

    // Flag to indicate if the ball is currently moving
    let isMoving = false;

    // Draw the ball
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRatio, 0, Math.PI * 2);
        ctx.fillStyle = "#FF0000";
        ctx.fill();
        ctx.closePath();
    }

    // Update ball position when mouse clicked
    canvas.addEventListener("click", function(event) {
        if (!isMoving) {
            audio.play();
            const rect = canvas.getBoundingClientRect();
            console.debug(rect)
            targetX = event.clientX - rect.left;
            targetY = event.clientY - rect.top;
            moveBall();            
        } else {
            audio.pause();
            isMoving = false;
        }
    });

    canvas.addEventListener('contextmenu', (ev) => {
        ev.preventDefault();
        console.log('canvas right clicked')
    });

    //Move the ball towards the target position
    function moveBall() {
        isMoving = true;
        const dx = targetX - ballX;
        const dy = targetY - ballY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let vx = (dx / distance) * speed;
        let vy = (dy / distance) * speed;    

        function update() {

            if (speedUpdated) {
                vx = (vx * speed) / oldSpeed;
                vy = (vy * speed) / oldSpeed;
                speedUpdated = false;
            }

            // if (distance > speed) {
            if (isMoving) {
                const rect = canvas.getBoundingClientRect();

                if (((ballY + ballRatio) >= rect.height) || ((ballY - ballRatio) <= 0)) {
                    vy *= -1;
                    // isMoving = false;
                }
                if (((ballX + ballRatio) >= rect.width) || ((ballX - ballRatio) <= 0)) {
                    vx *= -1;
                    // isMoving = false;
                }
                ballY += vy;
                ballX += vx;

                requestAnimationFrame(update);
            // } else {
            //     ballX = targetX;
            //     ballY = targetY;
            //     isMoving = false;                
            }
            // }
            draw();
        }

        update();
    }

    // Main draw function
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
    }

    // Initial draw
    draw();
})