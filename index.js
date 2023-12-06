const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");

const gameContainer = document.querySelector(".game-container");
const resultados = document.getElementById("result");
const controles = document.querySelector(".controls-container");

let cartas;
let interval;
let primeraCarta = false;
let segundaCarta = false;

// Items del array

const items = [
    {
        name : "abeja",
        imagen: "img/bee.png"
    },
    {
        name : "cocodrilo",
        imagen: "img/crocodile.png"
    },
    {
        name : "anaconda",
        imagen: "img/anaconda.png"
    },
    {
        name : "chameleon",
        imagen: "img/chameleon.png"
    },
    {
        name : "cacatúa",
        imagen: "img/cockatoo.png"
    },
    {
        name : "gorila",
        imagen: "img/gorilla.png"
    },
    {
        name : "guacamayo",
        imagen: "img/macaw.png"
    },
    {
        name : "mono",
        imagen: "img/monkey.png"
    },
    {
        name : "piraña",
        imagen: "img/piranha.png"
    },
    {
        name : "perezoso",
        imagen: "img/sloth.png"
    },
    {
        name : "tigre",
        imagen: "img/tiger.png"
    },
    {
        name : "tucan",
        imagen: "img/toucan.png"
    }
]

//tiempo inicial
let segundos = 0,
    minutos = 0;

//movminetos del ganador y tiempo
let movesCount = 0,
    winCount = 0;

// por tiempo
const timeGenerator = () => {
    segundos+=1;
    //minutos de logica
    if(segundos >= 60) {
        minutos += 1;
        segundos = 0;
    }
    // formateado de hora antes de que se muestre

    let segundoValor = segundos < 10 ? `0${segundos}` : segundos;
    let minValor = minutos < 10 ? `0${minutos}` : minutos;

    timeValue.innerHTML = `<span>Tiempo: </span> ${minValor} : ${segundoValor}`;
};

// para calcular los movmientos

const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Movimientos: </span> ${movesCount}`;
};

// agarrar ojetos random desde el array

const generateRandom = (size = 4) => {
    // array temporal
    let tempArray = [...items];

    //inicializar cardValue del array
    let cardValue = [];
    
    //tamaño  deberian ser dobles (4*4 matrix) / 2 ya que existen los objetos
    size = (size * size) / 2;

    // objetos random
    for (let i = 0; i < size; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length);
        cardValue.push(tempArray[randomIndex]);

        //una vez seleccionado borramos el obj temporal del array
        tempArray.splice(randomIndex, 1);
    }
    return cardValue;
};

const matrixGenerator = (cardValue, size = 4) => {
    gameContainer.innerHTML = "";
    cardValue = [...cardValue, ...cardValue];

    // barajar simple  - shuffle (barajar)
    cardValue.sort(() => Math.random() - 0.5); // sort para ordenar el array, me habia olvidado.
    for(let i=0; i < size * size; i++){
        /* 
            creacion de cartas
            antes => lado de frente (tienen signo???)
            despues => lado de atras (imagen actual)
            data-cart-values es un atributo con cual diferencial las cartas y los nombres despues
        */

    gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValue[i].name}">
            <div class="card-before">?</div>
            <div class="card-after">
            <img src="${cardValue[i].imagen}" class="imagen"/></div>
        </div>
    `;
    }

    // el grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`;

    // cartas
    cartas = document.querySelectorAll(".card-container");
    cartas.forEach((carta) => {
        carta.addEventListener("click", () => {
            /* 
            si la tarjeta seleccionada aún no se ha emparejado, sólo se ejecutará (i.e , se ignorará la tarjeta ya emparejada cuando se haga clic en ella).
             */
            if(!carta.classList.contains("matched")){
                // se gira la tarjeta
                carta.classList.add("flipped");
                
                // si es primeraCarta (!primeraCarta desde primeraCarta arranca en falso arriba de todo)
                if(!primeraCarta){
                    //la tarjeta actual se conviente en primeraCarta
                    primeraCarta = carta;

                    //el varor de las cartas pasa a ser
                    primeraCartaValor = carta.getAttribute("data-card-value");
                } else {
                    // incremento de movimientos desde que el usuario seleccionó la segunda carta
                    movesCounter();
    
                    //segunda carta y valor
                    segundaCarta = carta;
                    let segundaCartaValor = carta.getAttribute("data-card-value");
                    if(primeraCartaValor == segundaCartaValor){
                        // si ambas cartas coinciden, seran ignoradas para la proxima
                        primeraCarta.classList.add("matched");
                        segundaCarta.classList.add("matched");
    
                        // establecer primeraCarta a false ya que la siguiente tarjeta sería la primera ahora
                        primeraCarta = false;
    
                        //winCount se incrementa a medida que el usuario encuentra una coincidencia correcta
                        winCount+=1;
    
                        //chekeo si winCount ==mitad de cardValue
                        if (winCount == Math.floor(cardValue.length / 2)){
                            resultados.innerHTML = `<h2> Ganaste </h2> <h4>con ${movesCount} movimientos 💪</h4>`;
                            stopGame();
                        }
                    } else {
                        // si las cartas no son iguales
                        // se vuelve la carta a normal
                        let [tempPrimero, tempSegundo] = [primeraCarta, segundaCarta];
                        primeraCarta = false;
                        segundaCarta = false;
                        let demora = setTimeout(() => {
                            tempPrimero.classList.remove("flipped");
                            tempSegundo.classList.remove("flipped");
                        }, 900);
                    }
                }
            } 
        });
    });
};

startBtn.addEventListener("click", () => {
    movesCount = 0;
    segundos = 0;
    minutos = 0;
    // controles y botones visibles
    controles.classList.add("hide");
    stopBtn.classList.remove("hide");
    startBtn.classList.add("hide");

    // comienzo del tiempo
    interval = setInterval(timeGenerator, 1000);
    // inicio de movimientos
    moves.innerHTML = `<span>Movimientos: </span> ${movesCount}`;

    inicializador();
});

// stop game
stopBtn.addEventListener("click", (stopGame = () => {
        controles.classList.remove("hide");
        stopBtn.classList.add("hide");
        startBtn.classList.remove("hide");
        clearInterval(interval);
    })
);

// inicializar valores y llamada de funciones

const inicializador = () => {
    resultados.innerText = "";
    winCount = 0;

    let cardValue = generateRandom();
    matrixGenerator(cardValue);

};


