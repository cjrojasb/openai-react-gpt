import { useRef, useEffect, useState } from 'react';
import { AvatarMessage } from '../ui/AvatarMessage';

interface Props {
  text: string;
  imageUrl: string;
  alt: string;
  onImageSelected?: (newImageUrl: string) => void;
}

export const GptMessageSelectableImage = ({
  imageUrl,
  onImageSelected,
}: Props) => {
  const originalImageRef = useRef<HTMLImageElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageUrl;
    originalImageRef.current = image;
    image.onload = () => {
      ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
  }, []);

  const onMouseDown = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    setIsDrawing(true);

    // Obtener las coordenadas del mouse relativo al canvas
    const startX =
      event.clientX - canvasRef.current!.getBoundingClientRect().left;
    const startY =
      event.clientY - canvasRef.current!.getBoundingClientRect().top;

    // console.log({startX, startY});
    setCoords({ x: startX, y: startY });
  };

  const onMouseUp = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current!;
    const url = canvas.toDataURL('image/png');
    // https://jaredwinick.github.io/base64-image-viewer/
    onImageSelected && onImageSelected(url);
  };
  const onMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!isDrawing) return;

    const currentX =
      event.clientX - canvasRef.current!.getBoundingClientRect().left;
    const currentY =
      event.clientY - canvasRef.current!.getBoundingClientRect().top;

    // Calcular el alto y ancho del rectángulo
    const width = currentX - coords.x;
    const height = currentY - coords.y;

    const canvaWidth = canvasRef.current!.width;
    const canvaHeight = canvasRef.current!.height;

    // Limpiar el canva
    const ctx = canvasRef.current!.getContext('2d')!;

    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.drawImage(originalImageRef.current!, 0, 0, canvaWidth, canvaHeight);

    // Dibujar el rectangulo, pero en este caso, limpiaremos el espacio
    // ctx. fillRect(coords.x, coords.y, width, height);

    ctx.clearRect(coords.x, coords.y, width, height);
  };

  const resetCanvas = () => {
    const ctx = canvasRef.current!.getContext('2d')!;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    ctx.drawImage(
      originalImageRef.current!,
      0,
      0,
      canvasRef.current!.width,
      canvasRef.current!.height
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onImageSelected && onImageSelected(imageUrl);
  };

  return (
    <div className='col-start-1 col-end-8 p-3 rounded-lg'>
      <div className='flex flex-row items-start gap-3'>
        <AvatarMessage label='G' bgColor='bg-green-500' />
        <div className='flex flex-col gap-2 relative text-sm bg-black bg-opacity-25 pt-3 pb-2 px-4 shadow rounded-xl'>
          <canvas
            ref={canvasRef}
            width={1024}
            height={1024}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseDown={onMouseDown}
          />
          <button className='btn-primary mt-2' onClick={resetCanvas}>
            Borrar selección
          </button>
        </div>
      </div>
    </div>
  );
};
