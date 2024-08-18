

export const textToAudioUseCase = async (prompt: string, voice: string) => {

    try {

        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/text-to-audio`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, voice })
        });

        if (!resp.ok) throw new Error('No se pudo realizar la generación del audio');

        //blob - Fichero de datos planos inmutables
        const audioFile = await resp.blob();
        //Un objeto File o Blob para el que se creará la URL
        const audioUrl = URL.createObjectURL(audioFile);

        return {
            ok: true,
            message: prompt,
            audioUrl: audioUrl
        }

    } catch (error) {
        return {
            ok: false,
            message: 'No se pudo generar el audio'
        }
    }

}