window.onload = function () {
    (function () {
        const backgammon = {
            cell: `<div class="box"></div>`,

            /**
             * true --> black
             * false --> white
             */
            curColor: true,

            blackPiece: `<span class="chess-pieces-black"></span>`,

            whitePiece: `<span class="chess-pieces-white"></span>`,

            chess: document.getElementById("chessboard"),

            type: document.getElementById("type"),

            info: document.getElementById("info"),

            ucBtn: document.getElementById("c"),

            uuBtn: document.getElementById("u"),

            reBtn: document.getElementById("r"),

            /**
             * judge game is computer vs user or user vs user
             * false --> user vs user
             * true --> user vs computer
             */
            isComputer: false,

            over: false,

            addPiece: function (x, y) {
                let item = document.createElement("span");
                if(this.curColor)
                    item.classList.add("chess-pieces-black");
                else
                    item.classList.add("chess-pieces-white");

                item.style.left = (-15 + (y*35)) + "px";
                item.style.top = (-15 + (x*35)) + "px";
                this.chess.appendChild(item);
            },

            winKindsCount: 672,

            wins: (function () {
                let count = 0,
                    wins = [];

                for(let i=0; i<16; i++) {
                    wins[i] = [];
                    for(let j=0; j<16; j++) {
                        wins[i][j] = [];
                    }
                }

                for(let i=0; i<16; i++) {
                    for(let j=0; j<12; j++) {
                        for(let k=0; k<5; k++) {
                            wins[i][j+k][count] = true;
                        }
                        count++;
                    }
                }

                for(let i=0; i<16; i++) {
                    for(let j=0; j<12; j++) {
                        for(let k=0; k<5; k++) {
                            wins[j+k][i][count] = true;
                        }
                        count++;
                    }
                }

                for(let i=0; i<12; i++) {
                    for(let j=0; j<12; j++) {
                        for(let k=0; k<5; k++) {
                            wins[i+k][j+k][count] = true;
                        }
                        count++;
                    }
                }

                for(let i=4; i<16; i++) {
                    for(let j=0; j<12; j++) {
                        for(let k=0; k<5; k++) {
                            wins[i-k][j+k][count] = true;
                        }
                        count++;
                    }
                }

                // 672 kinds
                //console.log(count);

                return wins;
            })(),

            curChess: (() => {
                let arr = [];
                for(let i=0; i<16; i++) {
                    arr[i] = [];
                    for(let j=0; j<16; j++) {
                        arr[i][j] = false;
                    }
                }

                return arr;
            })(),

            myWins: [],

            myScore: (() => {
                let arr = [];
                for(let i=0; i<16; i++) {
                    arr[i] = [];
                    for(let j=0; j<16; j++) {
                        arr[i][j] = 0;
                    }
                }

                return arr;
            })(),

            computerWins: [],

            computerScore: (() => {
                let arr = [];
                for(let i=0; i<16; i++) {
                    arr[i] = [];
                    for(let j=0; j<16; j++) {
                        arr[i][j] = 0;
                    }
                }

                return arr;
            })(),

            changeColor: function () {
                this.curColor = !this.curColor;
            },

            checkIsWin: function (x, y) {
                let flag = false;
                for(let k=0; k<this.winKindsCount; k++) {
                    if(this.wins[x][y][k]) {
                        // black chess piece
                        if(this.curColor) {
                            this.myWins[k] = (this.myWins[k] === undefined) ? 1 : this.myWins[k]+1;

                            if(this.myWins[k] >= 5) {
                                this.over = true;
                                flag = true;
                                break;
                            }

                        // white chess piece
                        }else {
                            this.computerWins[k] = (this.computerWins[k] === undefined) ? 1 : this.computerWins[k]+1;

                            if(this.computerWins[k] >= 5) {
                                this.over = true;
                                flag = true;
                                break;
                            }
                        }
                    }
                }
                return flag;
            },

            showGameType: function () {
                if(this.isComputer) {
                    this.type.innerText = "User VS Computer";
                }else {
                    this.type.innerText = "User VS User";
                }
            },

            gameOver: function () {
                if(this.curColor) {
                    info.innerText = "游戏结束，黑棋取得胜利..."
                }else {
                    info.innerText = "游戏结束，白棋取得胜利..."
                }
            },

            removeChessPiece: function () {
                let elems = this.chess.children;

                for(let i=0, len=elems.length; i<len; i++) {
                    if(elems[i] && elems[i].nodeName === "SPAN") {
                        elems[i].parentNode.removeChild(elems[i]);
                        i--;
                        len--;
                    }
                }
            },

            resetGame: function () {
                this.removeChessPiece();
                this.info.innerText = "";
                this.showGameType();
                this.over = false;
                this.curColor = true;
                this.curChess = (() => {
                    let arr = [];
                    for(let i=0; i<16; i++) {
                        arr[i] = [];
                        for(let j=0; j<16; j++) {
                            arr[i][j] = false;
                        }
                    }

                    return arr;
                })();

                this.myWins = [];
                this.computerWins = [];
                this.myScore = (() => {
                    let arr = [];
                    for(let i=0; i<16; i++) {
                        arr[i] = [];
                        for(let j=0; j<16; j++) {
                            arr[i][j] = 0;
                        }
                    }

                    return arr;
                })();

                this.computerScore = (() => {
                    let arr = [];
                    for(let i=0; i<16; i++) {
                        arr[i] = [];
                        for(let j=0; j<16; j++) {
                            arr[i][j] = 0;
                        }
                    }

                    return arr;
                })();
            },

            /**
             * return computer next should drop point.
             * @returns {{x: number, y: number}}
             */
            computerAI: function () {
                // computer AI
                for(let i=0; i<16; i++) {
                    for(let j=0; j<16; j++) {
                        // this point not drop
                        if(!this.curChess[i][j]) {
                            for(let k=0; k<this.winKindsCount; k++) {
                                if(this.wins[i][j][k]) {
                                    // check users
                                    if(this.myWins[k] === 1) {
                                        this.myScore[i][j] += 2;
                                    }else if(this.myWins[k] === 2) {
                                        this.myScore[i][j] += 4;
                                    }else if(this.myWins[k] === 3) {
                                        this.myScore[i][j] += 50;
                                    }else if(this.myWins[k] === 4) {
                                        this.myScore[i][j] += 200;
                                    }else if(this.myWins[k] >= 5) {
                                        this.myScore[i][j] += 500;
                                    }

                                    // check computer
                                    if(this.computerWins[k] === 1) {
                                        this.computerScore[i][j] += 3;
                                    }else if(this.computerWins[k] === 2) {
                                        this.computerScore[i][j] += 5;
                                    }else if(this.computerWins[k] === 3) {
                                        this.computerScore[i][j] += 10;
                                    }else if(this.computerWins[k] === 4) {
                                        this.computerScore[i][j] += 300;
                                    }else if(this.computerWins[k] >= 5) {
                                        this.computerScore[i][j] += 1000;
                                    }
                                }
                            }
                        }
                    }
                }

                // get next computer x, y
                let max = this.myScore[0][0],
                    u = 0,
                    v = 0;
                for(let i=0; i<16; i++) {
                    for(let j=0; j<16; j++) {
                        // if this point not drop, try count this weight.
                        if(!this.curChess[i][j]) {
                            if(max < this.myScore[i][j]) {
                                max = this.myScore[i][j];
                                u = i;
                                v = j;
                            }

                            if(max < this.computerScore[i][j]) {
                                max = this.computerScore[i][j];
                                u = i;
                                v = j;
                            }
                        }
                    }
                }

                return {
                    x: u,
                    y: v
                }
            },

            init: function () {
                // draw chess
                let allCell = "";
                for(let i=0; i<15*15; i++) {
                    allCell += this.cell;
                }
                this.chess.innerHTML = allCell;

                // show game type
                this.showGameType();

                this.ucBtn.addEventListener("click", (event) => {
                    if(this.isComputer === true) {
                        return false;
                    }else {
                        this.isComputer = true;
                        this.resetGame();
                    }
                }, false);

                this.uuBtn.addEventListener("click", (event) => {
                    if(this.isComputer === false) {
                        return false;
                    }else {
                        this.isComputer = false;
                        this.resetGame();
                    }
                }, false);

                this.reBtn.addEventListener("click", (event) => {
                    this.resetGame();
                }, false);

                this.chess.addEventListener("click", (event) => {
                    if(this.over) return false;

                    let target = event.target,
                        x = event.offsetX,
                        y = event.offsetY,
                        children = target.parentNode.children,
                        curIndex = undefined,
                        chessX = undefined,
                        chessY = undefined;

                    if(target.className !== "box") return false;

                    //console.log(x, y);

                    for(let i=0, len=children.length; i<len; i++) {
                        if(children[i] === target)
                            curIndex = i;
                    }

                    //console.log(curIndex);

                    // top left
                    if(x<=10 && y<=10) {
                        chessX = Math.floor(curIndex/15);
                        chessY = curIndex%15;

                        // top right
                    }else if(x>=25 && y<=10) {
                        chessX = Math.floor(curIndex/15);
                        chessY = curIndex%15+1;

                        // bottom left
                    }else if(x<=10 && y>=25) {
                        chessX = Math.floor(curIndex/15)+1;
                        chessY = curIndex%15;

                        // bottom right
                    }else if(x>=25 && y>=25) {
                        chessX = Math.floor(curIndex/15)+1;
                        chessY = curIndex%15+1;
                    }

                    // not in click range
                    if(typeof chessX === "undefined" && typeof chessY === "undefined") return false;

                    // drop this point
                    //console.log(chessX, chessY);
                    this.addPiece(chessX, chessY);

                    // log this point
                    this.curChess[chessX][chessY] = true;

                    // check is win
                    let isWin = this.checkIsWin(chessX, chessY);

                    // if win, then game over.
                    if(isWin) {
                        this.gameOver();
                        return false;
                    }

                    // change chess pieces color
                    this.changeColor();

                    // judge this is user vs computer?
                    if(this.isComputer) {
                        let nextPoint = this.computerAI();

                        // console.log(nextPoint);
                        this.addPiece(nextPoint.x, nextPoint.y);

                        // log this point
                        this.curChess[nextPoint.x][nextPoint.y] = true;

                        // check is win
                        let isWin = this.checkIsWin(chessX, chessY);

                        // if win, then game over.
                        if(isWin) {
                            this.gameOver();
                            return false;
                        }

                        // change chess pieces color
                        this.changeColor();
                    }

                }, false);

                return this;
            },
        };

        backgammon.init();

    })();
};