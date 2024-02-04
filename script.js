// Adjust speed to the desired value
let speedObj = {
    now: 2,
    old: 2,
    ratio: 1,
    updated: false,
    init: function(speed) {
        this.now = speed;
        this.old = speed;
        this.setRatio()
    },
    setRatio: function() {
        this.ratio = this.now / this.old;
    },
    update: function(speed) {
        this.old = this.now;
        this.now = speed;
        this.updated = true;
        this.setRatio();
        },
}

const ballRatio = 50

function updateSpeed() {
    speedObj.update(parseFloat(document.getElementById("speedInput").value));
}

let audioObj = {
    files: ["skylines.mp3", "imperial.mp3"],
    len: 0,
    audios: [],
    obj: null, 
    init: function() {
        this.len = this.files.length;
        for (let i = 0; i < this.len; i++) {
            var audio = new Audio(this.files[i]);
            this.audios.push(audio)
            let thisOuter = this;
            audio.addEventListener("ended", function() {
                this.currentTime = 0;
                let index = (i + 1) % thisOuter.len;
                thisOuter.obj = thisOuter.audios[index];
                thisOuter.obj.play();
            });
        }
        this.obj = this.audios[0];
    },
    play: function() {
        if (this.obj != null) {
            this.obj.play();
        }
    },
    pause: function() {
        if (this.obj != null) {
            this.obj.pause();
        }
    },
}
audioObj.init();

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
            audioObj.obj.play();
            const rect = canvas.getBoundingClientRect();
            console.debug(rect)
            targetX = event.clientX - rect.left;
            targetY = event.clientY - rect.top;
            moveBall();            
        } else {
            audioObj.obj.pause();
            isMoving = false;
            sphereColor = (sphereColor + 1) % 5;
            initSphere();
        }
    });

    // Handling right click mouse inside the canvas
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

        let vx = (dx / distance) * speedObj.now;
        let vy = (dy / distance) * speedObj.now;    

        function update() {

            if (speedObj.updated) {
                // vx = (vx * speedObj.now) / speedObj.old;
                vx = vx * speedObj.ratio;
                // vy = (vy * speedObj.now) / speedObj.old;
                vy = vy * speedObj.ratio;
                speedObj.updated = false;
            }

            if (isMoving) {
                const rect = canvas.getBoundingClientRect();

                // if (((ballY + ballRatio) >= rect.height) || ((ballY - ballRatio) <= 0)) {
                //     vy *= -1;
                // }
                // if (((ballX + ballRatio) >= rect.width) || ((ballX - ballRatio) <= 0)) {
                //     vx *= -1;
                // }
                if (((ballY + sphereSize - sphereMargin) >= rect.height) || ((ballY + sphereMargin) <= 0)) {
                    vy *= -1;
                }
                if (((ballX + sphereSize - sphereMargin) >= rect.width) || ((ballX + sphereMargin) <= 0)) {
                    vx *= -1;
                }
                ballY += vy;
                ballX += vx;

                requestAnimationFrame(update);
            }
            draw();
        }

        update();
    }

    var Point = {
        x: 0,
        y: 0,
        init: function(x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
    }

    let counter = 0;
    let index = 0;

    const sphere = new Image();
    sphere.onload = function() {
        ctx.drawImage(sphere, spherePoints[index].x, spherePoints[index].y, sphereSize, sphereSize, ballX, ballY, sphereSize, sphereSize);
    }
    sphere.src = "spheres.png";
    const sphereSize = 105;
    const sphereOrigin = 40;
    const sphereMargin = 15;
    let sphereColor = 0;
    let spherePoints = [];

    function initSphere() {
        spherePoints = [
            Object.create(Point).init(sphereOrigin, sphereOrigin + sphereSize*sphereColor), 
            Object.create(Point).init(sphereOrigin + sphereSize, sphereOrigin + sphereSize*sphereColor),
            Object.create(Point).init(sphereOrigin + sphereSize*2, sphereOrigin + sphereSize*sphereColor),
            Object.create(Point).init(sphereOrigin + sphereSize*3, sphereOrigin + sphereSize*sphereColor),
            Object.create(Point).init(sphereOrigin + sphereSize*4, sphereOrigin + sphereSize*sphereColor)
        ];
    }
    initSphere();

    function drawSphere() {
        // var size = 105;
        // var start = 40 + size*4;
        // var ximages = 1;
        // var yimages = 1;
        // ctx.drawImage(sphere, start, start, size*ximages, size+yimages, 0, 0, size*ximages, size*yimages);
        if (isMoving) {
            counter++;
            if (counter > (100 / speedObj.now)) {
                counter = 0;
                index = (index + 1) % 5;
            }
        }
        // ctx.fillRect(ballX, ballY, sphereSize, sphereSize);
        ctx.drawImage(sphere, spherePoints[index].x, spherePoints[index].y, sphereSize, sphereSize, ballX, ballY, sphereSize, sphereSize);
    }

    // Main draw function
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // drawBall();
        drawSphere();
    }

    // Initial draw
    draw();
})