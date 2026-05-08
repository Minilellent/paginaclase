document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DE LA BIBLIOTECA (main.html) ---
  const btnCargar = document.getElementById("btn-cargar");
  const contenedor = document.getElementById("tarjetas-contenedor");
  const filtroCategoria = document.getElementById("filtro-categoria");
  const buscador = document.getElementById("buscador");

  let todosLosJuegos = [];

  // COMPROBACIÓN: ¿Estamos en la página de la biblioteca?
  if (btnCargar && contenedor && filtroCategoria && buscador) {
    // Definimos la función de carga
    async function cargarBiblioteca() {
      try {
        const respuesta = await fetch("../datos.xml");
        if (!respuesta.ok) throw new Error("No se encontró el XML");

        const textoXML = await respuesta.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(textoXML, "text/xml");

        const nodosJuego = xml.getElementsByTagName("juego");
        todosLosJuegos = [];

        for (let i = 0; i < nodosJuego.length; i++) {
          const juego = nodosJuego[i];
          todosLosJuegos.push({
            titulo: juego.getElementsByTagName("titulo")[0].textContent.trim(),
            imagen: juego.getElementsByTagName("imagen")[0]
              ? juego.getElementsByTagName("imagen")[0].textContent.trim()
              : "../imagenes/default.jpg",
            desarrollador: juego
              .getElementsByTagName("desarrollador")[0]
              .textContent.trim(),
            lanzamiento: juego
              .getElementsByTagName("lanzamiento")[0]
              .textContent.trim(),
            horas: juego
              .getElementsByTagName("horas_jugadas")[0]
              .textContent.trim(),
            categoria: juego.getAttribute("categoria"),
          });
        }
        filtrar();
      } catch (error) {
        console.error("Error:", error);
        contenedor.innerHTML = "<p>Error al cargar la biblioteca.</p>";
      }
    }

    // Definimos la función de filtrado
    function filtrar() {
      const catSeleccionada = filtroCategoria.value.toLowerCase();
      const textoBusqueda = buscador.value.toLowerCase();

      const juegosFiltrados = todosLosJuegos.filter((juego) => {
        const coincideCat =
          catSeleccionada === "todos" ||
          juego.categoria.toLowerCase().includes(catSeleccionada);
        const coincideTitulo = juego.titulo
          .toLowerCase()
          .includes(textoBusqueda);
        return coincideCat && coincideTitulo;
      });
      renderizarJuegos(juegosFiltrados);
    }

    function renderizarJuegos(listaJuegos) {
      contenedor.innerHTML = "";
      listaJuegos.forEach((juego) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-juego";
        tarjeta.innerHTML = `
                    <div class="foto-juego">
                        <img src="${juego.imagen}" alt="${juego.titulo}" style="width:100%; height:150px; object-fit:cover; border-radius:4px;">
                    </div> 
                    <h3>${juego.titulo}</h3>
                    <p><strong>${juego.categoria}</strong></p>
                    <p>${juego.horas}</p>
                `;
        tarjeta.addEventListener("click", () => {
          alert(
            `DETALLES: ${juego.titulo}\nDev: ${juego.desarrollador}\nHoras: ${juego.horas}`,
          );
        });
        contenedor.appendChild(tarjeta);
      });
    }

    // --- ASIGNAMOS EVENTOS SOLO SI EXISTEN LOS ELEMENTOS ---
    btnCargar.addEventListener("click", async () => {
      await cargarBiblioteca();
      filtrar();
    });

    filtroCategoria.addEventListener("change", filtrar);
    buscador.addEventListener("input", filtrar);

    // Carga inicial
    cargarBiblioteca();
  }

  // --- LÓGICA DEL ARKANOID (despedida.html) ---
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 5;
var brickColumnCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;

var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}
function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#00087c";
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#00087c";
    ctx.fill();
    ctx.closePath();
}
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#006711";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#39474f";
    ctx.fillText("Score: "+score, 8, 20);
}
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#39474f";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();
});
