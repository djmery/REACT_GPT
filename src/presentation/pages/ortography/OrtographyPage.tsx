import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptOrthographyMessage } from '../../components';
import { orthographyUseCase } from '../../../core/use-cases';



interface Message {
    text: string;
    isGpt: boolean;
    info?: {
        userScore: number;
        errors: string[];
        message: string;
    }
}


export const OrtographyPage = () => {

    const [isLoading, setIsLooading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const handlePost = async (text: string) => {
        setIsLooading(true);
        setMessages((prev) => [...prev, { text: text, isGpt: false }]);

        const { ok, userScore, errors, message } = await orthographyUseCase(text);
        if (!ok) {
            setMessages((prev) => [...prev, { text: 'No se pudo realizar la corrección', isGpt: true }]);
        } else {
            setMessages((prev) => [...prev, {
                text: message,
                isGpt: true,
                info: {
                    userScore,
                    errors,
                    message
                }
            }]);

        }

        //Todo: Añadir el mensaje de isGpt en true
        setIsLooading(false);

    }

    return (
        <div className="chat-container">
            <div className="chat-messages">
                <div className="grid grid-cols-12 gap-y-2">

                    {/* Bienvenida */}
                    <GptMessage text='Hola, puedes escribir texto en español y te ayudo con las correciones' />

                    {
                        messages.map((message, index) => (
                            (message.isGpt)
                                ? (
                                    <GptOrthographyMessage
                                        key={index}
                                        {...message.info!}
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
            {/* <TextMessageBoxFile
                onSendMessage={handlePost}
                placeholder='Escribe aquí lo que deseas'

            /> */}
            {/* <TextMessageBoxSelect
                onSendMessage={console.log}
                options={[{ id: '1', text: 'Hola' }, { id: '2', text: 'Mundo' }]}
            /> */}
        </div>
    );
};
