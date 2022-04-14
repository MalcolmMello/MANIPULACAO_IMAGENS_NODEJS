import { Router } from "express";
import multer from "multer";
import * as ApiController from '../controllers/apiController';

const upload = multer({
    dest: './tmp',
    fileFilter: (req, file, cb) => {
            const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png']
            cb(null, allowed.includes( file.mimetype ))
    },  // tipo de arquivo
    limits: { fieldSize: 2000000 } // tamanho do arquivo
})

const router = Router();

router.post('/frases', ApiController.createPhrase);
router.get('/frases', ApiController.listPhrases);
router.get('/frase/aleatoria', ApiController.randomPhrase);
router.get('/frase/:id', ApiController.getPhrase);
router.put('/frase/:id', ApiController.updatePhrase);
router.delete('/frase/:id', ApiController.deletePhrase);

router.post('/upload', upload.single('avatar'), ApiController.uploadFile)

export default router;