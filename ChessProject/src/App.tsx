import './App.css'
import { Piece, Pawn, Bishop, type Board, type Move, Rook, Knight, Queen, King } from './piece'
import { useEffect, useState } from 'react';
import Square from './square';



function App() {

  const [turn,setTurn] = useState<"white"|"black">("white");

  const [board, setBoard] = useState<Board>(fillBoard);

  const [pieceSelected,setPieceSelected] = useState<Move | null>();
  const [pieceMoveTo,setPieceMoveTo] = useState<Move | null>();

  function fillBoard(): Board {

    const board: Board = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => null)
    );

    board[0][0] = new Rook(0, 0, "black", "rook");
    board[0][1] = new Knight(0, 1, "black" ,"knight");
    board[0][2] = new Bishop(0, 2, "black", "bishop");
    board[0][3] = new Queen(0, 3, "black", "queen");
    board[0][4] = new King(0, 4, "black", "king");
    board[0][5] = new Bishop(0, 5, "black", "bishop");
    board[0][6] = new Knight(0, 6, "black", "knight");
    board[0][7] = new Rook(0, 7, "black" , "rook");
    board[1][0] = new Pawn(1, 0, "black", "pawn");
    board[1][1] = new Pawn(1, 1, "black", "pawn");
    board[1][2] = new Pawn(1, 2, "black", "pawn");
    board[1][3] = new Pawn(1, 3, "black", "pawn");
    board[1][4] = new Pawn(1, 4, "black", "pawn");
    board[1][5] = new Pawn(1, 5, "black", "pawn");
    board[1][6] = new Pawn(1, 6, "black", "pawn");
    board[1][7] = new Pawn(1, 7, "black", "pawn");


    board[7][0] = new Rook(7, 0, "white", "rook");
    board[7][1] = new Knight(7, 1, "white", "knight");
    board[7][2] = new Bishop(7, 2, "white","bishop");
    board[7][3] = new Queen(7, 3, "white","queen");
    board[7][4] = new King(7, 4, "white","king");
    board[7][5] = new Bishop(7, 5, "white", "bishop");
    board[7][6] = new Knight(7, 6, "white", "knight");
    board[7][7] = new Rook(7, 7, "white", "rook");
    board[6][0] = new Pawn(6, 0, "white", "pawn");
    board[6][1] = new Pawn(6, 1, "white", "pawn");
    board[6][2] = new Pawn(6, 2, "white", "pawn");
    board[6][3] = new Pawn(6, 3, "white", "pawn");
    board[6][4] = new Pawn(6, 4, "white", "pawn");
    board[6][5] = new Pawn(6, 5, "white", "pawn");
    board[6][6] = new Pawn(6, 6, "white", "pawn");
    board[6][7] = new Pawn(6, 7, "white", "pawn");

    return board;
  }

  useEffect(()=>{
    console.log(board)
  },[])

  function moving(from:Move, to:Move){
    const newBoard : Board = board.map(row=>[...row]); 

    const piece = board[from.x][from.y];

    if(piece?.getValidMoves(newBoard).some(m => m.x == to.x && m.y == to.y)){
      
      piece.x = to.x;
      piece.y = to.y;
      newBoard[to.x][to.y] = piece;
      newBoard[from.x][from.y] = null;
      setTurn(turn=="white" ? "black" : "white");
      if(piece instanceof Pawn || piece instanceof King){
        piece.moved = true;
      }
    }

    setBoard(newBoard);
  }

  const clicking=(x:number,y:number)=>{
    console.log(x,y)

    if(pieceSelected?.x==x && pieceSelected?.y==y){
      setPieceSelected(null);
      return
    }

    if(pieceSelected){
      setPieceMoveTo({x,y});
    }else{
      if(board[x][y]==null || board[x][y]?.color !== turn) return;
      setPieceSelected({x,y});
    }

  }

  function reset(){
    setPieceMoveTo(null);
    setPieceSelected(null);
  }

  useEffect(()=>{
    console.log("selected: "+pieceSelected?.x + pieceSelected?.y)
  },[pieceSelected])

  useEffect(()=>{
    if(pieceSelected && pieceMoveTo) moving(pieceSelected,pieceMoveTo);
    reset();
  },[pieceMoveTo])

  useEffect(()=>{
    console.log(board)
  },[board])

  useEffect(()=>{
    console.log(turn)
  },[turn])

  return (
    <>
      <div className='flex flex-col justify-around items-center  h-dvh w-dvw'>
        <h1 className='text-7xl'>Chess Game!</h1>
        <div className='grid grid-cols-8 gap-0 w-max'>
          {board.map((row, x) => (
            row.map(((col, y) => (
              <Square key={x + y} x={x} y={y} piece={col} clicking={()=>clicking(x,y)}/>
            )))
          ))}
        </div>

      </div>


    </>
  )
}

export default App
