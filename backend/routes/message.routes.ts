import { Router } from 'express';
import { messageController } from '../controllers/message.controller';

const router = Router();

router.get('/conversations', messageController.getConversations.bind(messageController));
router.get('/:otherUserId', messageController.getMessages.bind(messageController));
router.post('/', messageController.sendMessage.bind(messageController));
router.patch('/:messageId/status', messageController.updateMessageStatus.bind(messageController));

export default router;
