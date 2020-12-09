export {}
const { Router } = require('express');
const userController = require('../controllers/userController');

function userRouter(User) {
  const router = Router();
  const user = userController(User);

  router.route('/')
    .get(user.getMethod)
    .post(user.postMethod);

  router.route('/favorite')
    .put(user.putFavoriteRecipe)
    .delete(user.deleteFavoriteRecipe);

  router.route('/list')
    .put(user.putListItem)

  return router;
}

module.exports = userRouter;