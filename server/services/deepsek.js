import dotenv from 'dotenv';
import OpenAI from "openai";

dotenv.config();

const apiKey = process.env.DEEPSEEK_API_KEY;
const apiUrl = process.env.DEEPSEEK_API_URL;


const openai = new OpenAI({
    baseURL: apiUrl,
    apiKey: apiKey
});

export default openai;