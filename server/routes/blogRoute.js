const router = require('express').Router();
const blogController = require('../controllers/blogController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware, blogController.add);
router.put('/update/:id', authMiddleware, blogController.update);
router.delete('/delete/:id', authMiddleware, blogController.delete);
router.get('/allBlogs', blogController.getBlogs);
router.get('/singleBlog/:id', blogController.getSingleBlog);

module.exports = router;
