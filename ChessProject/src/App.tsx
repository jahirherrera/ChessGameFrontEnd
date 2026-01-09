import './App.css'
import { Piece, Pawn, Bishop, type Board, type Move, Rook, Knight, Queen, King } from './piece'
import { useEffect, useState } from 'react';
import Square from './square';
//@ts-ignore
import SockJS from 'sockjs-client/dist/sockjs'
import { Client } from '@stomp/stompjs';

type movesFromServer = {
  from: Move,
  to: Move,
  color : string
}



function App() {

  const [turn, setTurn] = useState<"white" | "black">("white");

  const [board, setBoard] = useState<Board>(fillBoard);
  const [checkMessage, setCheckMessage] = useState<string>("");

  const [pieceSelected, setPieceSelected] = useState<Move | null>();
  const [pieceMoveTo, setPieceMoveTo] = useState<Move | null>();

  const [pieceBlackKilled, setPieceBlackKilled] = useState<Piece[]>([]);
  const [pieceWhiteKilled, setPieceWhiteKilled] = useState<Piece[]>([]);

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [MoveFromServer, setMoveFromServer] = useState<movesFromServer[] | null>(null); // array of moves received from server
  const [newMove,setNewMove] = useState<movesFromServer | null>(null); // the new move to send to server

  

  useEffect(() => {

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe('/topic/server', move => {
          const receivedMove = JSON.parse(move.body);
          setMoveFromServer(prev =>[...(prev || []), receivedMove] );
        });
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };


  }, []);


  // Things to do
  // 1. add the king special move with the rook (castling) 
  // 2. Improve the UI 
  // 3.  add Timer
  // 4. add multiplayer (online) srprig boot JAVA backend with websockets
  // optional -> add AI opponent

  function fillBoard(): Board {

    const board: Board = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => null)
    );

    board[0][0] = new Rook(0, 0, "black", "rook");
    board[0][1] = new Knight(0, 1, "black", "knight");
    board[0][2] = new Bishop(0, 2, "black", "bishop");
    board[0][3] = new Queen(0, 3, "black", "queen");
    board[0][4] = new King(0, 4, "black", "king");
    board[0][5] = new Bishop(0, 5, "black", "bishop");
    board[0][6] = new Knight(0, 6, "black", "knight");
    board[0][7] = new Rook(0, 7, "black", "rook");
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
    board[7][2] = new Bishop(7, 2, "white", "bishop");
    board[7][3] = new Queen(7, 3, "white", "queen");
    board[7][4] = new King(7, 4, "white", "king");
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

  function deepCopyBoard(board: Board): Board { // to create a new board instance, we need to do this so that we dont modify the original board or the original pieces
    return board.map(row =>
      row.map(piece => {
        if (piece === null) return null;
        if (piece instanceof King) return new King(piece.x, piece.y, piece.color, piece.typePiece);
        if (piece instanceof Queen) return new Queen(piece.x, piece.y, piece.color, piece.typePiece);
        if (piece instanceof Rook) return new Rook(piece.x, piece.y, piece.color, piece.typePiece);
        if (piece instanceof Bishop) return new Bishop(piece.x, piece.y, piece.color, piece.typePiece);
        if (piece instanceof Knight) return new Knight(piece.x, piece.y, piece.color, piece.typePiece);
        if (piece instanceof Pawn) return new Pawn(piece.x, piece.y, piece.color, piece.typePiece);
        return null;
      })
    );
  }


  function checkingKingOwnColor(from: Move, To: Move): boolean {

    let newBoard: Board = createANewBoardExample(from, To);  // we get real board -> If i do this then both of them are the same thing let newBoard: Board = board;




    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = newBoard[x][y];
        if (piece instanceof King && piece.color == turn) { //we compare if the king of the same color is on check
          if (piece.isInCheck(newBoard)) return true;  // we retrun true if the king of the same color  in on check
        }
      }
    }
    return false; // king is not in check so the move is saved
  }

  function createANewBoardExample(from: Move, to: Move): Board {
    const newBoard = deepCopyBoard(board); // we create a new board instance from the original board without modifying the original board

    const piece = newBoard[from.x][from.y];
    piece!.x = to.x;
    piece!.y = to.y;

    newBoard[to.x][to.y] = piece;
    newBoard[from.x][from.y] = null;

    return newBoard;

  }

  function moving(from: Move, to: Move) {
    const newBoard: Board = board.map(row => [...row]);

    const piece = board[from.x][from.y];
    if (piece == null) return;

    if (piece?.getValidMoves(newBoard).some(m => m.x == to.x && m.y == to.y)) {

      piece.x = to.x;
      piece.y = to.y;

      if (newBoard[to.x][to.y] != null) { // we check if there is a piece to capture
        const capturedPiece = newBoard[to.x][to.y];
        if (capturedPiece!.color === "white") {
          setPieceWhiteKilled([...pieceWhiteKilled, capturedPiece!]);
        } else {
          setPieceBlackKilled([...pieceBlackKilled, capturedPiece!]);
        }
      }


      newBoard[to.x][to.y] = piece;
      newBoard[from.x][from.y] = null;
      if (piece instanceof Pawn || piece instanceof King) {
        piece.moved = true;
      }
      setBoard(newBoard);
      setTurn(turn == "white" ? "black" : "white"); // we change turn
    }
  }

  function movingProcess(from: Move, to: Move) {

    if (checkingKingOwnColor(from, to)) return; // if the own king is on check then the move cannot be done

    //if the king is not in check then me make move

    moving(from, to); // we make the move

    // once the turn is changed we check in a useEffect if the opponent king is in check

  }


  function checkmate(): boolean {
    const newBoard: Board = deepCopyBoard(board);

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = newBoard[x][y];
        if (piece instanceof King && piece.color == turn) { //we see if it's the king of the current turn
          const validMoves = piece.getValidMoves(newBoard); // we get all the valid moves for the king of the current turn
          for (const move of validMoves) { // we go through all the valid moves for the king
            if (!checkingKingOwnColor({ x, y }, move)) { // we simulate the move, with the x and y of the original piece and the move of the valid moves
              return false; // there is at least one move that can save the king from checkmate
            }
          }
        }
      }

      // we see if the king can be saved from other pieces
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const piece = newBoard[x][y];
          if (piece?.color == turn && !(piece instanceof King)) { // we see if it's a piece of the current turn and not the king
            const validMoves = piece.getValidMoves(newBoard); // we get all the valid moves for the piece
            for (const move of validMoves) { // we go through all the valid moves for the piece
              if (!checkingKingOwnColor({ x, y }, move)) { // we simulate the move, with the x and y of the original piece and the move of the valid moves
                return false; // there is at least one move that can save the king from checkmate
              }
            }
          }
        }
      }
    }

    return true; // no moves can save the king from checkmate
  }




  function checkInTheUseEffect(turn: "white" | "black") {
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        const piece = board[x][y];
        if (piece instanceof King && piece.color == turn) { //we compare if the king of the same color is on check
          if (piece.isInCheck(board)) { // if the king is in check then we need to see if it is checkmate
            setCheckMessage("Check!");

            // we need to see if it is checkmate
            if (checkmate()) {
              setCheckMessage("Checkmate! " + (turn == "white" ? "black" : "white") + " wins!");
            }

          } else { // king is not in check
            setCheckMessage("");

          }
        }
      }
    }
  }




  const clicking = (x: number, y: number) => {

    if (pieceSelected?.x == x && pieceSelected?.y == y) {
      setPieceSelected(null);
      return
    }

    if (pieceSelected) {
      setPieceMoveTo({ x, y });
    } else {
      if (board[x][y] == null || board[x][y]?.color !== turn) return;
      setPieceSelected({ x, y });
    }

  }

  function reset() {
    setPieceMoveTo(null);
    setPieceSelected(null);
  }


  useEffect(() => {
    if (pieceSelected && pieceMoveTo){
      const data : movesFromServer = {
        from: pieceSelected,
        to: pieceMoveTo,
        color : turn
      };
      if (stompClient) {
        console.log("it sneds the move to the server: ", data);
            stompClient.publish({
                destination: `/app/server`,
                body: JSON.stringify(data),
            });

        }
    };
    reset();
  }, [pieceMoveTo])

  useEffect(()=>{
    if(MoveFromServer && MoveFromServer.length >0){
      console.log("Move received from server: ", MoveFromServer);
      const latestMove = MoveFromServer[MoveFromServer.length -1];
      movingProcess(latestMove.from,latestMove.to);
    }
  },[MoveFromServer])




  useEffect(() => {
    checkInTheUseEffect(turn);
    console.log(turn)
  }, [turn])

  const color = (): string => {
    return turn === "white" ? "white" : "black";
  }

  return (
    <>
      <div className='flex flex-col justify-around items-center  h-dvh w-dvw bg-[#5E7D7E]'>
        <h1 className='text-5xl '>Chess Game!</h1>
        <h1 className='text-5xl flex justify-center items-center '>Turn: <p className={`ml-2 mt-2 h-10 w-10 rounded-full`} style={{ backgroundColor: color() }}></p></h1>
        <div className='flex justify-center items-center bg-[#A3C4C4] p-4 rounded-lg shadow-lg gap-4'>
          <div className='flex flex-col min-w-15 justify-center items-center'>
            Black
            {pieceBlackKilled.map((piece, index) => (
              <Square key={index} x={-1} y={-1} piece={piece} clicking={() => { }} />
            ))}
          </div>
          <div className='grid grid-cols-8 gap-0 w-max'>
            {board.map((row, x) => (
              row.map(((col, y) => (
                <Square key={x + y} x={x} y={y} piece={col} clicking={() => clicking(x, y)} />
              )))
            ))}
          </div>
          <div className='flex flex-col min-w-15 justify-center items-center'>
            White
            {pieceWhiteKilled.map((piece, index) => (
              <Square key={index} x={-1} y={-1} piece={piece} clicking={() => { }} />
            ))}
          </div>
        </div>

        <h1 className='text-5xl min-h-12'>{checkMessage}</h1>

      </div>


    </>
  )
}

export default App
