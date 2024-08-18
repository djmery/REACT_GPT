
import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxFile } from '../../components';
import { audioToTextUseCase } from '../../../core/use-cases/audioToText.use-case';

interface Message {
    text: string;
    isGpt: boolean;

}


export const AudioToTextPage = () => {

    const [isLoading, setIsLooading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async (text: string, audioFile: File) => {
        setIsLooading(true);
        setMessages((prev) => [...prev, { text: text, isGpt: false }]);

        //Todo: Usecase
        const resp = await audioToTextUseCase(audioFile, text);
        setIsLooading(false);

        if (!resp) return; //No hay respuesta

        const gptMessage = `

## Transcripción:

__Duración:__ ${Math.round(resp.duration)} segundos

### El texto es:

${resp.text}

`

        //Todo: Añadir el mensaje de isGpt en true
        setMessages((prev) => [...prev, { text: gptMessage, isGpt: true }]);

        for (const segment of resp.segments) {
            const segmentMessage = `
__ De ${Math.round(segment.start)} a ${Math.round(segment.end)} segundos:__
${segment.text}
            `
            setMessages((prev) => [...prev, { text: segmentMessage, isGpt: true }]);
        }

    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className="grid grid-cols-12 gap-y-2">

                    {/* Bienvenida */}
                    <GptMessage text='Hola, ¿qué audio quieres generar hoy?' />

                    {
                        messages.map((message, index) => (
                            (message.isGpt)
                                ? (
                                    <GptMessage key={index} text={message.text} />
                                )
                                : (
                                    <MyMessage key={index} text={(message.text === '') ? 'Transribe el audio' : message.text} />
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
            <TextMessageBoxFile
                onSendMessage={handlePost}
                placeholder='Escribe aquí lo que deseas'
                disableCorrections
                accept='audio/*'
            />
        </div>
    );
};

