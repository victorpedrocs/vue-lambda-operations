import { RequestHandler } from 'express';
import { getHash, getUserToken } from '../../helpers/utils';
import { getUser } from '../../repository/user';

export const login: RequestHandler = async (req, res) => {
  const { username, password } = req.body;
  req.log.info({ username }, '/login handler');

  const user = await getUser(username, await getHash(password));

  if (!user) {
    return res.status(400).send({ message: 'Invalid user credentials' });
  }

  res.status(200).send({
    token: getUserToken(user),
    ...user,
  });
};
