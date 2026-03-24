import { Router } from "express";
import { assign, remove as removeAssignment } from '../controllers/assignmentController.js'
import { create as createComment, list as listComments, remove as removeComment } from '../controllers/commentController.js'
import { authMiddleware } from '../middlewares/auth.js'

const router = Router({ mergeParams: true });

router.use(authMiddleware);

router.post('/assignments', assign);
router.delete('/assignments/:id', removeAssignment);

router.post('/comments', createComment);
router.get('/comments', listComments);
router.delete('/comments/:id', removeComment);

export default router;