import { body, validationResult } from 'express-validator';

const validateUserUpdate = [
  body('name').optional().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').optional().isEmail().withMessage('Must be a valid email'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateMatchCreation = [
  body('player1').isMongoId().withMessage('Invalid player1 ID'),
  body('player2').isMongoId().withMessage('Invalid player2 ID'),
  body('problemId').notEmpty().withMessage('Problem ID is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export {
  validateUserUpdate,
  validateMatchCreation,
};