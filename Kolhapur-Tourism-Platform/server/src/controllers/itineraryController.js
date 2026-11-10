const aiService = require('../services/aiService');
const db = require('../db/dbService');
const models = require('../models');
const { getIsConnected } = require('../config/db');

exports.generateItinerary = async (req, res) => {
  try {
    const params = req.body || {};
    const result = await aiService.generateItinerary(params);

    // Normalize output format to support both days and itinerary keys
    const daysList = result.days || result.itinerary || [];
    const formattedResult = {
      ...result,
      days: daysList,
      itinerary: daysList,
      daysCount: result.durationDays || params.durationDays || 2,
      durationDays: result.durationDays || params.durationDays || 2,
      travelersCount: params.travelersCount || result.travelersCount || 2,
      startingLocation: params.startingLocation || 'Kolhapur Railway Station / City Center',
      estimatedTotalBudget: result.estimatedTotalBudget || (params.durationDays || 2) * 2500
    };

    // Save to database if requested or for logging
    if (result && result.success) {
      const planRecord = {
        id: `itin_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        userId: req.user ? req.user.id : null,
        planTitle: formattedResult.planTitle,
        durationDays: formattedResult.daysCount,
        pace: formattedResult.pace,
        interests: params.interests || [],
        budgetLevel: formattedResult.budgetLevel,
        estimatedTotalBudget: formattedResult.estimatedTotalBudget,
        days: daysList,
        summary: formattedResult.summary,
        aiGenerated: !!result.aiGenerated,
        createdAt: new Date().toISOString()
      };

      if (getIsConnected()) {
        try {
          await models.Itinerary.create(planRecord);
        } catch (dbErr) {
          console.warn('Failed to save itinerary to MongoDB:', dbErr.message);
        }
      }
      db.insert('itineraries', planRecord);
    }

    res.json({
      success: true,
      data: formattedResult,
      ...formattedResult
    });
  } catch (err) {
    console.error('Error in itinerary generation:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to generate itinerary' });
  }
};

exports.chatAssistant = async (req, res) => {
  try {
    const { messages = [], message = '' } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    const response = await aiService.chatAssistant(messages, message.trim());
    res.json(response);
  } catch (err) {
    console.error('Error in AI assistant chat:', err);
    res.status(500).json({ success: false, message: err.message || 'Failed to get AI assistant response' });
  }
};
