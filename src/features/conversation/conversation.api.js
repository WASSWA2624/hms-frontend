/**
 * Conversation API
 * File: conversation.api.js
 */
import { endpoints } from '@config/endpoints';
import { createCrudApi } from '@services/api';

const conversationApi = createCrudApi(endpoints.CONVERSATIONS);

export { conversationApi };
