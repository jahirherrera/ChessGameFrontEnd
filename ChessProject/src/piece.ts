
export type name = "pawn" | "rook" | "bishop" | "queen" | "king" | "knight";

export type Move = { x: number, y: number };

export type Board = (Piece | null)[][];

export abstract class Piece {
    x: number;
    y: number;
    color: "white" | "black";
    typePiece: name;

    constructor(x: number, y: number, color: "white" | "black", typePiece: "pawn" | "rook" | "bishop" | "queen" | "king" | "knight") {
        this.x = x;
        this.y = y;
        this.color = color;
        this.typePiece = typePiece;
    }

    abstract getValidMoves(board: Board): Move[];


}

export class Pawn extends Piece {

    moved: boolean = false;

    getValidMoves(board: Board): Move[] {

        const moves: Move[] = [];

        const direction: number = this.color == "white" ? -1 : 1;


        if (isIn(this.x + direction, this.y) && board[this.x + direction][this.y] == null) {
            moves.push({ x: this.x + direction, y: this.y });
        }


        if (!this.moved && board[this.x + direction][this.y] == null && board[this.x + (direction * 2)][this.y] == null) {
            moves.push({ x: this.x + (direction * 2), y: this.y });
        }


        if (isIn(this.x + direction, this.y + 1) && board[this.x + direction][this.y + 1]?.color && board[this.x + direction][this.y + 1]?.color !== this.color) {
            moves.push({ x: this.x + direction, y: this.y + 1 });
        }


        if (isIn(this.x + direction, this.y - 1) && board[this.x + direction][this.y - 1]?.color && board[this.x + direction][this.y - 1]?.color !== this.color) {
            moves.push({ x: this.x + direction, y: this.y - 1 });
        }


        return moves;
    }




}

export class Queen extends Piece {
    getValidMoves(board: Board): Move[] {
        const validMoves: Move[] = [];


        validMoves.push(...this.movements(this.x, this.y, 1, 0, board));
        validMoves.push(...this.movements(this.x, this.y, -1, 0, board));
        validMoves.push(...this.movements(this.x, this.y, 0, 1, board));
        validMoves.push(...this.movements(this.x, this.y, 0, -1, board));
        validMoves.push(...this.movements(this.x, this.y, 1, 1, board));
        validMoves.push(...this.movements(this.x, this.y, -1, 1, board));
        validMoves.push(...this.movements(this.x, this.y, -1, -1, board));
        validMoves.push(...this.movements(this.x, this.y, 1, -1, board));


        return validMoves;
    }

    movements(x: number, y: number, xx: number, yy: number, board: Board): Move[] {

        const moves: Move[] = [];
        x = x + xx;
        y = y + yy;

        while (isIn(x, y)) {
            if (board[x][y] == null) {
                moves.push({ x, y });
            } else {
                if (board[x][y]?.color !== this.color) {
                    moves.push({ x, y });
                }
                break;
            }

            x = x + xx;
            y = y + yy;
        }
        return moves;

    }



}

export class King extends Piece {

    moved: boolean = false;

    getValidMoves(board: Board): Move[] {

        const validMoves: Move[] = [];

        const moves = [[this.x - 1, this.y]//
            , [this.x-1, this.y + 1]//
            , [this.x, this.y + 1]//
            , [this.x + 1, this.y+1]//
            , [this.x + 1, this.y]//
            , [this.x + 1, this.y - 1]//
            , [this.x, this.y - 1]//
            , [this.x - 1, this.y - 1]];

        for (const [x, y] of moves) {
            if (isIn(x, y)) {
                if (board[x][y]?.color !== this.color || board[x][y]?.color == null) {
                    validMoves.push({ x, y });
                }
            }
        }


        // king goes 74 to 76 and the rook goes from 77 to 75
        // if(!this.isMoved){
        //     console.log("Here it goes the speacial movements with the rook")
        // }

        return validMoves;
    }

    isInCheck(board: Board): boolean {

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (board[x][y]?.color !== this.color && board[x][y]?.color !== null) {
                    if (board[x][y]?.getValidMoves(board).some(m => m.x == this.x && m.y == this.y)) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

}

export class Rook extends Piece {
    getValidMoves(board: Board): Move[] {

        const validMoves: Move[] = [];

        validMoves.push(...this.straightMovement(this.x, this.y, 1, 0, board));
        validMoves.push(...this.straightMovement(this.x, this.y, -1, 0, board));
        validMoves.push(...this.straightMovement(this.x, this.y, 0, 1, board));
        validMoves.push(...this.straightMovement(this.x, this.y, 0, -1, board));

        return validMoves;
    }

    straightMovement(x: number, y: number, xx: number, yy: number, board: Board): Move[] {

        const moves: Move[] = [];

        x = x + xx;
        y = y + yy;

        while (isIn(x, y)) {
            if (board[x][y] == null) {
                moves.push({ x, y });
            } else {
                if (board[x][y]?.color !== this.color) {
                    moves.push({ x, y });
                }
                break;
            }

            x = x + xx;
            y = y + yy;
        }


        return moves;
    }


}

export class Bishop extends Piece {
    getValidMoves(board: Board): Move[] {

        const validMoves: Move[] = [];

        let x = this.x;
        let y = this.y;

        validMoves.push(...this.zigZag(x, y, 1, 1, board));
        validMoves.push(...this.zigZag(x, y, -1, -1, board));
        validMoves.push(...this.zigZag(x, y, 1, -1, board));
        validMoves.push(...this.zigZag(x, y, -1, 1, board));


        return validMoves;
    }

    zigZag(x: number, y: number, xx: number, yy: number, board: Board): Move[] {
        const moves: Move[] = [];

        x = x + (xx);
        y = y + (yy);

        while (isIn(x, y)) {
            if (board[x][y] == null) {
                moves.push({ x, y });
            } else {
                if (board[x][y]?.color !== this.color) {
                    moves.push({ x, y });
                }
                break;
            }

            x = x + (xx);
            y = y + (yy);
        }

        return moves;
    }



}

export class Knight extends Piece {
    getValidMoves(board: Board): Move[] {
        const validMoves: Move[] = [];

        const moves = [[this.x - 2, this.y + 1], [this.x - 2, this.y - 1], [this.x + 2, this.y + 1], [this.x + 2, this.y - 1],
        [this.x - 1, this.y + 2], [this.x + 1, this.y + 2], [this.x - 1, this.y - 2], [this.x + 1, this.y - 2]];

        for (const [x, y] of moves) {
            if (isIn(x, y)) {
                if (board[x][y]?.color !== this.color || board[x][y]?.color == null) {
                    validMoves.push({ x, y });
                }
            }
        }

        return validMoves;
    }
}

function isIn(x: number, y: number): boolean {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}



