var particles = [];

function createParticles(x, y)
{
    // create particles and assign them to array
    for(var i = 0; i < 3; i++)
    {
        particles.push(new particle(x, y));
    }
}

function particle(x, y)
{
    // sets random variables for position, velocity and color
    this.x = Math.random()*x;
    this.y = y;
    this.vx = Math.random()*10-5;
    this.vy = -Math.random()*7+2;
    this.radius = canvas.width*0.01;

    var rand =  Math.floor(Math.random()*3);
    var red = 0;
    var green = 0;
    var blue = 0;
    switch(rand){
        case 0:
            red = 255;
            break;
        case 1:
            green = 255;
            break;
        case 2:
            blue = 255;
            break;
    }
    this.color = "rgba("+red+", "+green+", "+blue+", 0.5)";
}

function renderParticles(canvasContext)
{
    for(var i = 0; i < particles.length; i++)
    {
        //render each partcle using arc function adn radial gradient
        if(particles[i] != null){
            canvasContext.beginPath();
            var gradient = canvasContext.createRadialGradient(particles[i].x, particles[i].y, 0, particles[i].x, particles[i].y, particles[i].radius);
            gradient.addColorStop(0, particles[i].color);
            var prev = canvasContext.fillStyle;
            canvasContext.fillStyle = gradient;
            canvasContext.arc(particles[i].x, particles[i].y, particles[i].radius, Math.PI*2, false);
            canvasContext.fill();
            canvasContext.fillStyle = prev;
            // apply the velocity vectors to position
            particles[i].x += particles[i].vx;
            particles[i].y += particles[i].vy;
        }
    }
}