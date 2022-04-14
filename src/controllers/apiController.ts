import { Request, Response } from 'express';
import { unlink } from 'fs/promises';
import { Sequelize } from 'sequelize';
import sharp from 'sharp';
import { Phrase } from '../models/Phrase';



export const createPhrase = async (req: Request, res: Response) => {
    let { author, txt } = req.body;
    let newPhrase = await Phrase.create({ author, txt });

    res.status(201);
    res.json({ id: newPhrase.id, author, txt })
};

export const listPhrases = async (req: Request, res: Response) => {
    let list = await Phrase.findAll();
    res.json({ list });
};

export const getPhrase = async (req: Request, res: Response) => {
    let { id } = req.params;
    let phrase = await Phrase.findByPk(id);
    if(phrase) res.json({ phrase });
    else res.json({ error: 'Frase não encontrada' });
};

export const updatePhrase = async (req: Request, res: Response) => {
    let { id } = req.params;
    let { author, txt } = req.body;

    let phrase = await Phrase.findByPk(id);

    if(phrase) {
        phrase.author = author;
        phrase.txt = txt;
        await phrase.save();

        res.json({ phrase });
    } else {
        res.json({ error: 'Frase não encontrada' });
    };
};

export const deletePhrase = async (req: Request, res: Response) => {
    let { id } = req.params;
    await Phrase.destroy({ where: { id }});
    res.json({});
};

export const randomPhrase = async (req: Request, res: Response) => {
    let phrase = await Phrase.findOne({
        order: [
            Sequelize.fn('RANDOM')
        ]
    });

    if(phrase) res.json({ phrase });
    else res.json({ error: 'Não há frases cadastradas' });
};

export const uploadFile = async (req: Request, res: Response) => {
    if(req.file) {
        const filename = `${req.file.filename}.jpg`
        await sharp(req.file.path)
		    .resize(500, 500, {/* tipos de redimensionamento */
					fit: sharp.fit.fill, // proporcional a img
					position: 'bottom'
				})
		    .toFormat('jpeg')
	        .toFile(`./public/media/${req.file.filename}.jpg`);
        
		await unlink(req.file.path);

        res.json({ image: `${filename}` });
    } else {
        res.status(400);
        res.json({ error: 'Envie um arquivo válido' })
    }
};