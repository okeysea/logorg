/** @jsx jsx */
import { jsx, css } from "@emotion/react"
import React, { useState, useCallback, useRef, useEffect } from "react"

const cssCanvas = css({
  border: "2px solid #2b90d9",
  marginTop: "10",
});

const cssContainer = css({
  display: "flex",
  flexDirection: "column",
  width: "auto",

});

const cssButtonContainer = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",

  "& > span": {
    padding: "8px",
    animation: "editing 1s ease-in-out infinite alternate",

    "@keyframes editing": {
      "0%": {
        color: "#f7ffff",
      },
      "100%":{
        color: "#2b90d9",
      },
    }
  },
});

const cssCanvasContainer = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});

const cssInformContainer = css({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",

  "& > div": {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "8px",

    "& > span":{
      backgroundColor: "#2b90d9",
      borderRadius: "3px",
      padding: "4px",
      color: "#f9f9fa",
    },
    "& > var":{
      padding: "4px",
    },
  },
});

type Coordinates = {
  x: number;
  y: number;
}


type Props = {
  imgUri: string
  onChange: (uri: string) => void
  onCancel: ()=>void
  width: number
  height: number
}

const AvatarClop: React.FC<Props> = props =>{

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [image, setImage] = useState(new Image());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageCoordinates, setImageCoordinates] = useState<Coordinates>({x:0, y:0});
  const [scale, setScale] = useState(1.0);
  const [scaleStep, setScaleStep] = useState(0.01);
  const [doRendering, setDoRendering] = useState(false);
  const [clopped, setClopped] = useState(false);

  const clopCanvasRef = useRef<HTMLCanvasElement>(null);
  const [clopContext, setClopContext] = useState<CanvasRenderingContext2D | null>(null);

  const updateScale = (direction: 1 | -1) => {

    const newScale = Math.floor( Math.min(Math.max(.125,scale + (scaleStep * direction)), 4 ) * 1000) / 1000;

    // ## 画像座標の補正(クロップ中央拡大)
    // INFO: 変数の消去とかしてけばシンプルになりそう
    // 現在スケールでの画面中央の座標
    const viewPortX = Math.abs(imageCoordinates.x) + canvasRef.current.width / 2;
    const viewPortY = Math.abs(imageCoordinates.y) + canvasRef.current.height/ 2;
    // スケール 1(無拡大縮小)での画面中央の座標
    const srcViewPortX = (viewPortX) / scale;
    const srcViewPortY = (viewPortY) / scale;
    // スケール変更後の画面中央の座標
    const distViewPortX = srcViewPortX * newScale;
    const distViewPortY = srcViewPortY * newScale;
    // 差を算出
    const diffW = Math.round(Math.max(viewPortX, distViewPortX) - Math.min(viewPortX, distViewPortX));
    const diffH = Math.round(Math.max(viewPortY, distViewPortY) - Math.min(viewPortY, distViewPortY));

    setImageCoordinates({x: imageCoordinates.x - diffW * direction, y: imageCoordinates.y - diffH * direction});
    setScale( newScale );
  }

  useEffect(()=>{
    image.src = props.imgUri;
    image.onload = () => {
      setImageLoaded( true );
    }
  },[props.imgUri]);

  useEffect(()=>{
    function renderLoop() {
      if(context && canvasRef.current) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // クリップ領域を描画
        context.save();
        context.beginPath();
        context.fillStyle = "rgba(0,0,0,1)";
        context.arc( canvasRef.current.width / 2, canvasRef.current.height / 2,
                    canvasRef.current.width / 2, 0, Math.PI * 2, true);
        context.fill();

        context.globalCompositeOperation = "xor";

        context.fillStyle = "rgba(0,0,0,1)";
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height );

        context.globalCompositeOperation = "destination-in";

        context.fillStyle = "rgba(255,255,255,0.5)";
        context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height );

        context.globalCompositeOperation = "source-over";
        context.restore();

        context.globalCompositeOperation = "destination-over";

        // 画像を描画
        if( imageLoaded ){
          context.drawImage(image,
                            0,0,
                            image.naturalWidth,
                            image.naturalHeight,
                            imageCoordinates.x, imageCoordinates.y,
                            image.naturalWidth * scale,
                            image.naturalHeight * scale
                           );
        }

        context.globalCompositeOperation = "source-over";
      }
      if( doRendering ) requestAnimationFrame(renderLoop);
    }

    if( doRendering ) requestAnimationFrame(renderLoop);
  },[doRendering, scale, clopped]);

  useEffect(() => {
    let mouseDown: boolean = false;
    let start: Coordinates = { x: 0, y: 0 };
    let end: Coordinates = { x: 0, y: 0 };
    let canvasOffsetLeft: number = 0;
    let canvasOffsetTop: number = 0;

    function handleMouseDown(evt: MouseEvent){
      mouseDown = true;

      start = {
        x: evt.clientX - canvasOffsetLeft,
        y: evt.clientY - canvasOffsetTop,
      };

      end = {
        x: evt.clientX - canvasOffsetLeft,
        y: evt.clientY - canvasOffsetTop,
      };
    }

    function handleMouseUp(evt: MouseEvent){
      mouseDown = false;
    }

    function handleMouseLeave(evt: MouseEvent){
      mouseDown = false;
    }

    function handleWheel(evt: WheelEvent){
      evt.preventDefault();

      const delta = -(evt.deltaY);

      if( delta < 0 ){
        updateScale(1);
      }else{
        updateScale(-1);
      }
    }

    function handleMouseMove(evt: MouseEvent){
      if( mouseDown && context ){
        start = {
          x: end.x,
          y: end.y,
        };

        end = {
          x: evt.clientX - canvasOffsetLeft,
          y: evt.clientY - canvasOffsetTop,
        };

        // clear

        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        imageCoordinates.x += end.x - start.x;
        imageCoordinates.y += end.y - start.y;

        const imageWidth = image.naturalWidth;
        const imageHeight = image.naturalHeight;
        const scaledWidth = imageWidth * scale;
        const scaledHeight = imageHeight * scale;
        const overWidth =  scaledWidth - canvasRef.current.width;
        const overHeight = scaledHeight - canvasRef.current.height;
        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;

        // top left
        if( imageCoordinates.x < Math.min(0,-(overWidth)) ){
          imageCoordinates.x = Math.min(0,-(overWidth));
        }
        if( imageCoordinates.y < Math.min(0, -(overHeight)) ){
          imageCoordinates.y = Math.min(0, -(overHeight));
        }

        // right bottom
        if( imageCoordinates.x > Math.max(canvasWidth + overWidth - scaledWidth, canvasWidth - scaledWidth) ){
          imageCoordinates.x = Math.max(canvasWidth + overWidth - scaledWidth, canvasWidth - scaledWidth);
        }
        if( imageCoordinates.y > Math.max(canvasHeight + overHeight - scaledHeight, canvasHeight - scaledHeight) ){
          imageCoordinates.y = Math.max(canvasHeight + overHeight - scaledHeight, canvasHeight - scaledHeight);
        }
        setImageCoordinates( {x: Math.floor(imageCoordinates.x), y: Math.floor(imageCoordinates.y)} );
      }
    }

    if( canvasRef.current ){
      const renderCtx = canvasRef.current.getContext("2d");

      if( renderCtx ){
        canvasRef.current.addEventListener("mousedown", handleMouseDown);
        canvasRef.current.addEventListener("mouseleave", handleMouseLeave);
        canvasRef.current.addEventListener("mouseup", handleMouseUp);
        canvasRef.current.addEventListener("mousemove", handleMouseMove);
        canvasRef.current.addEventListener("wheel", handleWheel);

        canvasOffsetLeft = canvasRef.current.offsetLeft;
        canvasOffsetTop = canvasRef.current.offsetTop;

        setContext(renderCtx);

      }

      if(context){
        if(imageLoaded) {
          setDoRendering( true );
        }
      }

      return function cleanup() {
        if (canvasRef.current){
          canvasRef.current.removeEventListener("mousedown", handleMouseDown);
          canvasRef.current.removeEventListener("mouseleave", handleMouseLeave);
          canvasRef.current.removeEventListener("mouseup", handleMouseUp);
          canvasRef.current.removeEventListener("mousemove", handleMouseMove);
          canvasRef.current.removeEventListener("wheel", handleWheel);
        }
      }
    }
  },[context, imageLoaded, scale]);

  useEffect(()=>{
    if( clopCanvasRef.current ) {
      const renderCtx = clopCanvasRef.current.getContext("2d");
      setClopContext( renderCtx );
    }
  },[ clopContext ]);

  function makeClop():string{
    if( clopContext ){
      const context = clopContext;
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // クリップ領域を描画
      context.save();
      context.beginPath();
      context.fillStyle = "rgba(0,0,0,1)";
      context.arc( canvasRef.current.width / 2, canvasRef.current.height / 2,
                    canvasRef.current.width / 2, 0, Math.PI * 2, true);
      context.fill();

      context.globalCompositeOperation = "source-in";

      // 画像を描画
      if( imageLoaded ){
        context.drawImage(image,
                          0,0,
                          image.naturalWidth,
                          image.naturalHeight,
                          imageCoordinates.x, imageCoordinates.y,
                          image.naturalWidth * scale,
                          image.naturalHeight * scale
                         );
      }
      context.restore();

    }
    return clopCanvasRef.current.toDataURL();
  }

  return (
    <div css={cssContainer}>
      <div css={cssButtonContainer}>
        <button onClick={()=>{ props.onCancel() }}>キャンセル</button>
        <span>編集中</span>
        <button onClick={()=>{ props.onChange( makeClop() ) }}>クロップ!</button>
      </div>
      <div css={cssCanvasContainer}>
        <canvas
          id="clop"
          ref={clopCanvasRef}
          width={props.width}
          height={props.height}
          hidden>
        </canvas>
        <canvas
          id="canvas"
          ref={canvasRef}
          width={props.width}
          height={props.height}
          css={cssCanvas}
        >
        </canvas>
        <div css={cssInformContainer}>
          <div>
            <span>画像(x,y)</span>
            <var>({Math.floor(imageCoordinates.x)},{Math.floor(imageCoordinates.y)})</var>
          </div>
          <div>
            <span>マウスドラッグで移動</span>
          </div>
          <div>
            <span>スケール</span>
            <var>{scale}</var>
          </div>
          <div>
            <span>マウスホイールで拡大縮小</span>
          </div>
          <div>
            <span>スケールステップ</span>
            <var>{scaleStep}</var>
          </div>
        </div>
      </div>
    </div>
  );

}

export default AvatarClop;
