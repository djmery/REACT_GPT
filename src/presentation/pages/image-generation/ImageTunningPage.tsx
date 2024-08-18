
import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptMessageSelectableImage } from '../../components';
import { imageGenerationUseCase, imageVariationUseCase } from '../../../core/use-cases';

interface Message {
    text: string;
    isGpt: boolean;
    info?: {
        imageUrl: string;
        alt: string;
    }
}


export const ImageTunningPage = () => {

    const [isLoading, setIsLooading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([{
        text: 'Imagen base',
        isGpt: true,
        info: {
            imageUrl: 'http://localhost:3000/gpt/image-generation/1723114979934.png',
            alt: 'Imagen base'
        }
    }]);

    const [originalImageAndMask, setOriginalImageAndMask] = useState({
        original: undefined as string | undefined,
        mask: undefined as string | undefined
    })

    const handleVariation = async () => {
        setIsLooading(true);
        const resp = await imageVariationUseCase(originalImageAndMask.original!);
        setIsLooading(false);
        if (!resp) return;

        setMessages((prev) => [...prev, { text: 'Variación', isGpt: true, info: { imageUrl: resp.url, alt: resp.alt } }])
    }

    const handlePost = async (text: string) => {
        setIsLooading(true);
        setMessages((prev) => [...prev, { text: text, isGpt: false }]);

        const { original, mask } = originalImageAndMask;

        //Todo: Usecase
        const imageInfo = await imageGenerationUseCase(text, original, mask);
        setIsLooading(false);

        if (!imageInfo) {
            return setMessages((prev) => [...prev, { text: 'No se pudo generar la imagen', isGpt: true }])
        }

        setMessages((prev) => [...prev, { text: text, isGpt: true, info: { imageUrl: imageInfo.url, alt: imageInfo.alt } }])

        //Todo: Añadir el mensaje de isGpt en true

    }

    return (
        <>

            {
                originalImageAndMask.original && (
                    <div className='fixed flex flex-col items-center top-10 right-40 z-10 fade-in'>
                        <span>Editando</span>
                        <img
                            className='boder rounded-xl w-36 h-36 object-contain'
                            src={originalImageAndMask.mask ?? originalImageAndMask.original}
                            alt='Imagen Original'
                        />
                        <button className='btn-primary mt-2' onClick={handleVariation}>Generar Variación</button>
                    </div>
                )
            }

            <div className="chat-container">
                <div className="chat-messages">
                    <div className="grid grid-cols-12 gap-y-2">

                        {/* Bienvenida */}
                        <GptMessage text='¿Que imagen deseas generar hoy?' />

                        {
                            messages.map((message, index) => (
                                (message.isGpt)
                                    ? (
                                        // <GptMessageImage - antes estaba este componente
                                        <GptMessageSelectableImage key={index}
                                            text={message.text}
                                            imageUrl={message.info?.imageUrl || ''}
                                            alt={message.info?.alt || ''}
                                            onImageSelected={(maskImageUrl) => setOriginalImageAndMask({ original: message.info?.imageUrl, mask: maskImageUrl })}
                                        />
                                    )
                                    : (
                                        <MyMessage key={index} text={message.text} />
                                    )
                            ))
                        }

                        {
                            isLoading && (
                                <div className='col-start-1 col-end-12 fade-in'>
                                    <TypingLoader className='fade-in' />
                                </div>
                            )
                        }

                    </div>
                </div>
                <TextMessageBox
                    onSendMessage={handlePost}
                    placeholder='Escribe aquí lo que deseas'
                    disableCorrections
                />
            </div>
        </>
    );
};


