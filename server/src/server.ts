import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express from 'express';
import { hourToMinString } from './utils/hourToMinString';
import { minsToHourString } from './utils/minsToHourString';



const app = express()
app.use(express.json())
app.use(cors())

const prisma = new PrismaClient({
    log:['query']
})

app.get('/games', async (request, response) => {
    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: {
                    ads: true
                }
            }
        }
    })
    
    return response.json(games)
})

app.post('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;
    const body = request.body;

    const ad = await prisma.ad.create({
        data: {
            gameId,
            name:body.name,
            yearsPlaying:body.yearsPlaying,
            discord:body.discord,
            weekDays:body.weekDays.join(','),
            hourStart:hourToMinString(body.hourStart),
            hourEnd:hourToMinString(body.hourEnd),
            useVoiceChannel:body.useVoiceChannel,
        }
    })
 
    return response.json(ad)
})

app.get('/games/:id/ads', async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true,
        },
        where: {
            gameId,
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    return response.send(ads.map(ad => ({
        ...ad,
        hourStart: minsToHourString(ad.hourStart),
        hourEnd: minsToHourString(ad.hourEnd),
        weekDays: ad.weekDays.split(',')
    })))
});

app.get('/ads/:id/discord', async (request, response) => {
    const adId = request.params.id;

    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: adId,
        }
    })

    return response.send(ad.discord)
});

app.listen(3333)
