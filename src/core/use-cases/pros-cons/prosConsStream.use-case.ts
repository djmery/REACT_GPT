

export const prosConsStreamUseCase = async (prompt: string) => {
    try {

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
            //todo: abortSignal - para que lo podamos cancelar
        });

        if (!resp.ok) throw new Error('No se pudo realizar la comparación');

        const reader = resp.body?.getReader();
        if (!reader) {
            console.log('No se pudo generar el reader');
            return null;
        }

        return reader;

        //para imprimir mensajes en consola, para ellos vamos a utilizar un decodificador
        // const decoder = new TextDecoder();
        // let text = '';
        // while(true) {
        //     const { value, done } = await reader.read();
        //     if (done) {
        //         break;
        //     }
        //     const decoderChunk = decoder.decode(value, { stream: true });
        //     text += decoderChunk;
        //     console.log(text);
        // }


    } catch (error) {
        console.log(error);
        return null;
    }
}
