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

            addPiece: function (target, top, left) {
                let item = document.createElement("div");
                if(this.curColor)
                    item.classList.add("chess-pieces-black");
                else
                    item.classList.add("chess-pieces-white");

                item.style.top = top + "px";
                item.style.left = left + "px";
                target.appendChild(item);
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

            myWins: [],

            computerWins: [],

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
                        this.addPiece(target, -15, -15);

                        chessX = Math.floor(curIndex/15);
                        chessY = curIndex%15;

                        // top right
                    }else if(x>=25 && y<=10) {
                        this.addPiece(target, -15, 20);

                        chessX = Math.floor(curIndex/15);
                        chessY = curIndex%15+1;

                        // bottom left
                    }else if(x<=10 && y>=25) {
                        this.addPiece(target, 20, -15);

                        chessX = Math.floor(curIndex/15)+1;
                        chessY = curIndex%15;

                        // bottom right
                    }else if(x>=25 && y>=25) {
                        this.addPiece(target, 20, 20);

                        chessX = Math.floor(curIndex/15)+1;
                        chessY = curIndex%15+1;
                    }

                    // not in click range
                    if(!chessX && !chessY) return false;

                    // count wins
                    for(let k=0; k<this.winKindsCount; k++) {
                        if(this.wins[chessX][chessY][k]) {
                            // users
                            if(this.curColor) {
                                this.myWins[k] = (this.myWins[k] === undefined) ? 1 : this.myWins[k]+1;

                                if(this.myWins[k] >= 5) {
                                    alert("you win!");
                                }

                            // computer
                            }else {
                                this.computerWins[k] = (this.computerWins[k] === undefined) ? 1 : this.computerWins[k]+1;

                                if(this.computerWins[k] >= 5) {
                                    alert("computer win!");
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