import { request, response, Router } from 'express';
import ensureAuthenticated from '../middlewares/ensoreAuthenticated';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

import CreateUserService from '../services/CreateUserService';
import uploadConfig from '../config/upload';
import multer from 'multer';

const usersRouter = Router();
const upload = multer(uploadConfig)

usersRouter.post('/', async (request, response) => {

  try {

    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
      name, 
      email, 
      password
    });

    delete user.password;

    return response.json(user);
  } catch(err) {
    return response.status(400).json({ error : err.message });
  }

});


usersRouter.patch('/avatar', ensureAuthenticated, upload.single('file'), async (request, response) =>{
  try{
    const updateUserAvatarService = new UpdateUserAvatarService();

    const user = await updateUserAvatarService.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename
    })

    delete user.password;

    return response.json(user)

  } catch {

  }
})

export default usersRouter;

