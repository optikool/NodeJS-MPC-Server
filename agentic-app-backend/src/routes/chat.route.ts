import express from "express";
import { ChatController } from "../controllers/chat.controller.ts";

const router = express.Router();

router.post(
  "/gemini",
  ChatController.generateGeminiResponse
);

router.post(
  '/ollama',
  ChatController.generateOllamaResponse);

export default router;
