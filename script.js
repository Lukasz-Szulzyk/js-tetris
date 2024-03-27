import Block from "./Block.js";
import Board from "./Board.js";
import Renderer from "./Renderer.js";

window.onload = function() {
    game.init();
}

class Game {
    constructor() {
    }

    init = async () => {
        this.renderer = Renderer.getInstance();

        this.board = new Board({
            width: this.renderer.getWidth(),
            height: this.renderer.getHeight(),
            squareSize: 20
    });

        this.block = new Block(this.board);
        await this.block.init();

        this.block.nextBlock();
        this.initControls();
        this.startGame();
    }

    initControls = () => {
        document.querySelectorAll("button")
        .forEach(button => button.addEventListener("click", 
        () => this.keyDown({keyCode: parseInt(button.dataset.key)})
        ));
        document.addEventListener("keydown", (e) => {
            if (e.key == "ArrowLeft") {
                if (!this.block.checkCollision(-1, 0)) {
                    this.block.moveLeft();
                }
            } else if (e.key == "ArrowUp") {
                this.block.rotateRight();
                if (this.block.checkCollision(0,0)) {
                    this.block.rotateLeft();
                }
            } else if (e.key == "ArrowRight") {
                if (!this.block.checkCollision(1, 0)) {
                    this.block.moveRight();
                }
            } else if (e.key == "ArrowDown") {
                this.moveDown();
            }
        });
    }

    keyDown = (e) => {
        switch(e.keyCode) {
            case 37: // left
                if (!this.block.checkCollision(-1, 0)) {
                    this.block.moveLeft();
                }
                break;
            case 38: // up
            this.block.rotateRight();
                if (this.block.checkCollision(0,0)) {
                    this.block.rotateLeft();
                }
                break;  
            case 39: // right
                if (!this.block.checkCollision(1, 0)) {
                    this.block.moveRight();
                }
                break;   
            case 40: // down
                this.moveDown();
                break;   
        }
    }


    moveDown = () => {
        if (!this.block.checkCollision(0, 1)) {
            this.block.moveDown();
        } else {
            // collision
            this.block.lockOnBoard();
            this.board.removeFullRows();
            this.block.nextBlock();
        }
    }

    startGame = () => {
        this.lastDropTime = Date.now();

        const fps = 30;

        setInterval( this.updateGame, 1000 / fps);
        this.updateGame();
    }
    updateGame = () => {
        // if 1 second from last brick drop
        if ((Date.now() - this.lastDropTime) > 1000 ) {
            this.lastDropTime = Date.now();

            this.moveDown();
        }
        this.render();
    }

    render = () => {
        this.board.draw();
        this.block.drawOnBoard(this.board);
    }
}

const game = new Game();