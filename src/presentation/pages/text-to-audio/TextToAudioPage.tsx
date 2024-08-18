

import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect, GptMessageAudio } from '../../components';
import { textToAudioUseCase } from '../../../core/use-cases';

const displaimer = `##¿Que audio quieres generar hoy?
* Todo el audio generado es por AI.
`

const voices = [
    { id: "nova", text: "Nova" },
    { id: "alloy", text: "Alloy" },
    { id: "echo", text: "Echo" },
    { id: "fable", text: "Fable" },
    { id: "onyx", text: "Onyx" },
    { id: "shimmer", text: "Shimmer" },
];

interface TextMessage {
    text: string;
    isGpt: boolean;
    type: 'text';
}

interface AudioMessage {
    text: string;
    isGpt: boolean;
    audio: string;
    type: 'audio';
}

type Message = TextMessage | AudioMessage;


export const TextToAudioPage = () => {

    const [isLoading, setIsLooading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async (text: string, selectedVoice: string) => {
        setIsLooading(true);
        setMessages((prev) => [...prev, { text: text, isGpt: false, type: 'text' }]);

        //Todo: Usecase
        const { ok, message, audioUrl } = await textToAudioUseCase(text, selectedVoice);

        setIsLooading(false);

        if (!ok) return;

        setMessages((prev) => [...prev, { text: `${selectedVoice} - ${message}`, isGpt: true, type: 'audio', audio: audioUrl! }]);

    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className="grid grid-cols-12 gap-y-2">

                    {/* Bienvenida */}
                    <GptMessage text={displaimer} />

                    {
                        messages.map((message, index) => (
                            (message.isGpt) ? (
                                message.type === 'audio' ? (
                                    <GptMessageAudio key={index} text={message.text} audio={message.audio} />
                                ) : (
                                    <GptMessage key={index} text={message.text} />
                                )
                            ) : (
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
            <TextMessageBoxSelect
                onSendMessage={handlePost}
                placeholder='Escribe aquí lo que deseas'
                options={voices}
            />
        </div>
    );
};

