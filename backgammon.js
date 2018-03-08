window.onload = function () {
    (function () {
        const backgammon = {
            cell: `<div class="box"></div>`,

            blackPiece: `<div class="chess-pieces-black"></div>`,

            whitePiece: `<div class="chess-pieces-white"></div>`,

            chess: document.getElementById("chessboard"),

            init: function () {
                let allCell = "";
                for(let i=0; i<15*15; i++) {
                    allCell += this.cell;
                }
                this.chess.innerHTML = allCell;

                this.chess.addEventListener("click", (event) => {
                    let target = event.target,
                        x = event.offsetX,
                        y = event.offsetY;

                    console.log(x, y);

                    if(x<=15 && y<=15) {
                        let item = document.createElement("div");
                        item.classList.add("chess-pieces-black");
                        item.style.top = "-15px";
                        item.style.left = "-15px";
                        target.appendChild(item);
                    }
                }, false);

                return this;
            },

        };

        backgammon.init();

    })();
};