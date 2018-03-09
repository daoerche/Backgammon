window.onload = function () {
    (function () {
        const backgammon = {
            cell: `<div class="box"></div>`,

            /**
             * true --> black
             * false --> white
             */
            curColor: true,

            blackPiece: `<div class="chess-pieces-black"></div>`,

            whitePiece: `<div class="chess-pieces-white"></div>`,

            chess: document.getElementById("chessboard"),

            over: false,

            addPiece: function (x, y) {
                let item = document.createElement("div");
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

            curChess: (function () {
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

            myScore: (function () {
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

            computerScore: (function () {
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

            init: function () {
                let allCell = "";
                for(let i=0; i<15*15; i++) {
                    allCell += this.cell;
                }
                this.chess.innerHTML = allCell;

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
                    console.log(chessX, chessY);
                    this.addPiece(chessX, chessY);

                    // log this point
                    this.curChess[chessX][chessY] = true;

                    // count wins
                    for(let k=0; k<this.winKindsCount; k++) {
                        if(this.wins[chessX][chessY][k]) {
                            // users
                            if(this.curColor) {
                                this.myWins[k] = (this.myWins[k] === undefined) ? 1 : this.myWins[k]+1;

                                if(this.myWins[k] >= 5) {
                                    alert("you win!");
                                    this.over = true;
                                    return false;
                                }

                            // computer
                            }else {
                                this.computerWins[k] = (this.computerWins[k] === undefined) ? 1 : this.computerWins[k]+1;

                                if(this.computerWins[k] >= 5) {
                                    alert("computer win!");
                                    this.over = true;
                                    return false;
                                }
                            }
                        }
                    }

                    // change chess pieces color
                    this.changeColor();

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

                    console.log(u, v, max);
                    this.addPiece(u, v);

                    // log this point
                    this.curChess[u][v] = true;

                    // count wins
                    for(let k=0; k<this.winKindsCount; k++) {
                        if(this.wins[u][v][k]) {
                            // users
                            if(this.curColor) {
                                this.myWins[k] = (this.myWins[k] === undefined) ? 1 : this.myWins[k]+1;

                                if(this.myWins[k] >= 5) {
                                    alert("you win!");
                                    this.over = true;
                                    return false;
                                }

                                // computer
                            }else {
                                this.computerWins[k] = (this.computerWins[k] === undefined) ? 1 : this.computerWins[k]+1;

                                if(this.computerWins[k] >= 5) {
                                    alert("computer win!");
                                    this.over = true;
                                    return false;
                                }
                            }
                        }
                    }

                    // change chess pieces color
                    this.changeColor();

                }, false);

                return this;
            },
        };

        backgammon.init();

    })();
};