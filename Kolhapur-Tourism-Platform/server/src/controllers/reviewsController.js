const db = require('../db/dbService');

exports.getByTarget = (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    let reviews = db.findAll('reviews');
    if (targetType) {
      reviews = reviews.filter(r => r.targetType === targetType);
    }
    if (targetId) {
      reviews = reviews.filter(r => r.targetId === targetId);
    }
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = (req, res) => {
  try {
    const { targetType, targetId, rating, title, comment, travelerType, visitDate, userName } = req.body;

    if (!targetType || !targetId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating, target and comments.' });
    }

    const reviewerName = req.user ? req.user.name : (userName || 'Kolhapur Visitor');
    const reviewerEmail = req.user ? req.user.email : 'guest@kolhapur.com';

    const newReview = {
      id: `rev_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      targetType,
      targetId,
      userName: reviewerName,
      userEmail: reviewerEmail,
      rating: Number(rating),
      title: title || 'Travel Experience',
      comment: comment.trim(),
      visitDate: visitDate || 'Recent',
      travelerType: travelerType || 'Solo',
      createdAt: new Date().toISOString()
    };

    db.insert('reviews', newReview);

    // Update target rating in database
    const targetCollection = targetType === 'destination' ? 'destinations' : 'hotels';
    const target = db.findById(targetCollection, targetId);
    if (target) {
      const allTargetReviews = db.findAll('reviews', r => r.targetType === targetType && r.targetId === targetId);
      const totalScore = allTargetReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = Number((totalScore / allTargetReviews.length).toFixed(1));
      db.update(targetCollection, targetId, {
        rating: avgRating,
        reviewCount: allTargetReviews.length
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully! Thank you for sharing your experience.',
      data: newReview
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.delete = (req, res) => {
  try {
    const { id } = req.params;
    const removed = db.delete('reviews', id);
    if (!removed) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }
    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
