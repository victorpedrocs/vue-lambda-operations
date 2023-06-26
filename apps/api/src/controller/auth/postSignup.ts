import { RequestHandler } from 'express';
import { getHash, getUserToken, mapUserResponse } from '../../helpers/utils';
import { createUser } from '../../repository/user';

export const signup: RequestHandler = async (req, res) => {
  const { username, password } = req.body;
  req.log.info({ username }, '/signup handler');

  try {
    const newUser = await createUser({
      username,
      password: await getHash(password),
    });

    res.status(200).send({
      token: getUserToken(newUser),
      ...mapUserResponse(newUser),
    });
  } catch (err) {
    if (err.message.includes('violates unique constraint')) {
      req.log.info('User already exists');
      return res.status(409).send({ message: 'User already exists' });
    }

    req.log.error({ err }, 'Failed to signup user');
    return res.status(500).send({ message: 'Failed to create user' });
  }
};
