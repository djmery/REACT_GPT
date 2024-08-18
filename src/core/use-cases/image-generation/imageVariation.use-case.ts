
type GeneratedImage = Image | null;

interface Image {
    url: string;
    alt: string;
}

export const imageVariationUseCase = async (originaImage?: string): Promise<GeneratedImage> => {

    try {
        const resp = await fetch(`${import.meta.env.VITE_GPT_API}/image-variation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ baseImage: originaImage })

        });

        const { url, revised_prompt: alt } = await resp.json();
        console.log(url, alt);
        return { url, alt }


    } catch (error) {
        console.log(error);
        return null;
    }
}