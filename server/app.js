import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import path from 'path';
import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import messagesRouter from './routes/messages.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()

console.log('⚙️  Registrando express.json() e urlencoded()')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// Agora __dirname está definido corretamente
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/messages', messagesRouter)

export default app
