import { useState } from 'react';
import { GptMessage } from '../../components/chat-bubbles/GptMessage';
import { MyMessage } from '../../components/chat-bubbles/MyMessage';
import { TextMessageBox } from '../../components/chat-input-boxes/TextMessageBox';
import { TypingLoader } from '../../components/loaders/TypingLoader';
import { imageGenerationUseCase } from '../../../core/use-cases/image-generation.use-case';
import { GptMessageImage } from '../../components/chat-bubbles/GptMessageImage';
import { imageVariationUseCase } from '../../../core/use-cases/image-variation.use-case';
import { GptMessageSelectableImage } from '../../components/chat-bubbles/GptMessageSelectableImage';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

type Messages = Array<Message>;

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Messages>([
    {
      isGpt: true,
      text: 'base image',
      info: {
        alt: 'base image',
        imageUrl:
          'http://localhost:3000/gpt/image-generation/7dcd6b17-ede1-4ab1-9876-a749e61d443d.png',
      },
    },
  ]);
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async () => {
    setIsLoading(true);
    const response = await imageVariationUseCase(
      originalImageAndMask.original!
    );
    setIsLoading(false);
    if (!response) return;

    setMessages((prev) => [
      ...prev,
      {
        text: 'Variate',
        isGpt: true,
        info: {
          imageUrl: response.url,
          alt: response.alt,
        },
      },
    ]);
  };

  const handlePostMessage = async (text: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { text, isGpt: false }]);
    const { original, mask } = originalImageAndMask;
    const imageInfo = await imageGenerationUseCase(text, original, mask);
    setIsLoading(false);
    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        {
          text: 'No se pudo generar la imagen',
          isGpt: true,
        },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text: text,
        isGpt: true,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt,
        },
      },
    ]);
  };

  // const handleOriginalImage = (url: string) => {
  //   setOriginalImageAndMask({
  //     original: url,
  //     mask: undefined,
  //   });
  // };

  return (
    <div className='relative h-full'>
      {originalImageAndMask.original && (
        <div className='absolute flex flex-col items-center top-10 right-10 z-10 fade-in'>
          <span>Editando</span>
          <img
            src={
              originalImageAndMask.mask
                ? originalImageAndMask.mask
                : originalImageAndMask.original
            }
            alt='Original image'
            className='border rounded-xl w-36 h-36 object-contain'
          />
          <button className='btn-primary mt-2' onClick={handleVariation}>
            Generar Variación
          </button>
        </div>
      )}
      <div className='chat-container'>
        <div className='chat-messages'>
          <div className='grid grid-cols-12 gap-y-2'>
            <GptMessage text='¿Qué imagen deseas generar hoy?' />
            {messages.map((message, index) =>
              message.isGpt ? (
                message.info ? (
                  <GptMessageSelectableImage
                    key={index}
                    text={message.text}
                    imageUrl={message.info.imageUrl}
                    alt={message.info.imageUrl}
                    onImageSelected={(maskUrl) =>
                      setOriginalImageAndMask({
                        original: message.info?.imageUrl,
                        mask: maskUrl,
                      })
                    }
                  />
                ) : (
                  // <GptMessageImage
                  //   key={index}
                  //   text={message.text}
                  //   imageUrl={message.info.imageUrl}
                  //   alt={message.info.imageUrl}
                  //   onImageSelected={(newImageUrl) =>
                  //     handleOriginalImage(newImageUrl)
                  //   }
                  // />
                  <GptMessage key={index} text={message.text} />
                )
              ) : (
                <MyMessage key={index} text={message.text} />
              )
            )}
            {isLoading && (
              <div className='col-start-1 col-end-12 fade-in'>
                <TypingLoader />
              </div>
            )}
          </div>
        </div>
        <TextMessageBox
          onSendMessage={handlePostMessage}
          placeholder='Escribe aquí un mensaje para GPT-4o'
          disableCorrections={true}
        />
      </div>
    </div>
  );
};
