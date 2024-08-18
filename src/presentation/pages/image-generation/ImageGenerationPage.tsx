import { useState } from 'react';
import { GptMessageImage, GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { imageGenerationUseCase } from '../../../core/use-cases';

interface Message {
    text: string;
    isGpt: boolean;
    info?: {
        imageUrl: string;
        alt: string;
    }
}


export const ImageGenerationPage = () => {

    const [isLoading, setIsLooading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async (text: string) => {
        setIsLooading(true);
        setMessages((prev) => [...prev, { text: text, isGpt: false }]);

        //Todo: Usecase
        const imageInfo = await imageGenerationUseCase(text);
        setIsLooading(false);

        if (!imageInfo) {
            return setMessages((prev) => [...prev, { text: 'No se pudo generar la imagen', isGpt: true }])
        }

        setMessages((prev) => [...prev, { text: text, isGpt: true, info: { imageUrl: imageInfo.url, alt: imageInfo.alt } }])

        //Todo: Añadir el mensaje de isGpt en true

    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className="grid grid-cols-12 gap-y-2">

                    {/* Bienvenida */}
                    <GptMessage text='¿Que imagen deseas generar hoy?' />

                    {
                        messages.map((message, index) => (
                            (message.isGpt)
                                ? (
                                    <GptMessageImage key={index}
                                        text={message.text}
                                        imageUrl={message.info?.imageUrl || ''}
                                        alt={message.info?.alt || ''}
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
    );
};

