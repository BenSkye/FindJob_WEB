import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    res.send('User list');
});

router.get('/:id', (req: Request, res: Response) => {
    const userId = req.params.id;
    res.send(`User ID: ${userId}`);
});

export default router;
