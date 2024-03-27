import Renderer from "./Renderer.js";

export default class Board {
    board = null;
    NUM_ROWS = null;
    NUM_COLS = null;
    DEFAULT = "white";
    score = 0;
    constructor({
        width, height,  squareSize
    }) {
        this.renderer = Renderer.getInstance();
        this.NUM_ROWS = Math.floor(height / squareSize);
        this.NUM_COLS = Math.floor(width / squareSize);

        this.width = width;
        this.height = height;
        this.squareSize = squareSize;

        this.board = [];

        for (let i = 0; i < this.NUM_ROWS; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.NUM_COLS; j++) {
                this.board[i][j] = this.DEFAULT;
            }
        }
    }

    draw =  () => {
        this.board.forEach( (row, rowIndex) => {
            row.forEach( (col, colIndex) => {
                this.drawBoardSquare(
                    rowIndex,
                    colIndex,
                    this.board[rowIndex][colIndex]
                );
            });
        });

        this.renderer.drawText("Points: " + this.score, 5, 15, "black", "14px Verdana");
    }

    drawBoardSquare = (rowIndex, colIndex, color) => {
        this.renderer.drawSquare(
            colIndex * this.squareSize,
            rowIndex * this.squareSize,
            this.squareSize,
            this.squareSize,
            color
        );
    }

    lockBoardSquare = (rowIndex, colIndex, color) => {
        if (rowIndex >= this.board.length || rowIndex < 0) return;
        if (colIndex >= this.board[rowIndex].length || colIndex < 0) return;

        this.board[rowIndex][colIndex] = color;
    }

    checkSquareCollision = (x, y) => {
        if (x < 0 // does the block go beyond the left wall
            || x >= this.NUM_COLS // beyond the right wall
            || y >= this.NUM_ROWS // beyond bottom wall
            ) {
                return true; // there is a collision
        }

        if ( y < 0) return false;

        //  y is a row, x - a column
        if (this.board[y][x] == this.DEFAULT) {
            return false; // no collision, empty white field
        } else {
            return true; // collision
        }
    }

    removeFullRows = () => {
        let newScore = 0;
        let numFullRows = 0;

        for (let r = 0; r < this.NUM_ROWS; r++) {
            let isFullRow = true;

            const columns = this.board[r];
            for (let c = 0; c < this.NUM_COLS; c++) {
                if (this.board[r][c] == this.DEFAULT) {
                    // there is a white (empty) block in this row
                    isFullRow = false;
                }
            }

            if (isFullRow) {
                numFullRows++;
                // full row, we remove it

                //copying the row above the full row
                for (let y = r; y > 1; y--) {
                    for (let x = 0; x < this.NUM_COLS; x++) {
                        this.board[y][x] = this.board[y-1][x]
                    }
                }

                for (let x = 0; x < this.NUM_COLS;  x++) {
                    this.board[0][x] = this.DEFAULT;
                }

                newScore += 1;
            }
        }

        this.score += newScore * numFullRows;

    }
}