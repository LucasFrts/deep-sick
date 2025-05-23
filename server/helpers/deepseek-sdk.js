import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

const apiKey = process.env.DEEPSEEK_API_KEY;
const apiUrl = process.env.DEEPSEEK_API_URL;


const deepseek = new OpenAI({
    baseURL: apiUrl,
    apiKey: apiKey
});

const deepSick = async (prompt) => {
    const response = await deepseek.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "Gere uma resposta em que o personagem está claramente doente (ex: gripe, febre, magia maligna). Use formatação irregular para imitar a digitação trêmula de alguém debilitado: palavras cortadas (ex: 'tô... mal...'), repetição de letras para ênfase (ex: 'friooooo'), pausas longas com '...', erros de digitação leves (ex: 'cabeeça' em vez de 'cabeça'), frases curtas e interrompidas. Inclua descrições físicas (tosse, voz rouca, respiração ofegante) e elementos visuais de quadrinhos, como asteriscos para ações (tossindo, espirro) ou onomatopeias (cof cof). Use emojis como 🤒🤧 para reforçar o contexto."
            },
            {
                role: "user",
                content: prompt
            }
        ]
    });
    return response.choices[0].message.content;
};

export { deepseek, deepSick};