import { getProblemById } from '../services/problemService.js';

const getProblem = async (req, res) => {
  try {
    const problem = await getProblemById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json({ problem });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export { getProblem };
