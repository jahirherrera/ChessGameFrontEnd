import { Piece } from './piece'
import sprite from './sprite.svg';


interface squareProps {
    x: number,
    y: number,
    piece: Piece | null;
    clicking: (x: number, y: number) => void;
}

export default function Square({ x, y, piece, clicking }: squareProps) {

    function color():string{
        if((x+y) % 2 === 0) return "#DECFB1";
        return "#705548"
    }

    return (
        <> {/* 705548  DECFB1 */}
            <div className={`w-20 h-20 border border-black text-xl text-black flex justify-center items-center ${color}`} onClick={() => { clicking(x, y) }}
                style={{ backgroundColor: color() }}>
                <svg width="55" height="55" className={`hover:cursor-pointer m-1`}
                style={{color : piece?.color}}>
                    <use href={`${sprite}#${piece?.typePiece}`} />
                </svg>
                {x}{y}
            </div>
        </>
    )
}