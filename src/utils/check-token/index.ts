import { Request, Response, Next } from 'restify';
import * as jwt from 'jsonwebtoken';
import { config } from '../../../config';

declare module 'restify' {
  interface Response {
    locals: {
      jwtPayload: any;
    };
  }
}

export const checkJwt = (req: Request, res: Response, next: Next): any => {
  //Get the jwt token from the head
  const token = <string>req.headers['auth'];
  let jwtPayload;

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwt.secret);

    //res['locals'].jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.send(401, 'Not authorized');

    return;
  }
  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, config.jwt.secret, {
    expiresIn: '1h',
  });
  res.setHeader('token', newToken);

  //Call the next middleware or controller
  next();
};

export const checkJwtTokenFn = (req: Request, res: Response): boolean => {
  const token = <string>req.headers['auth'];
  let jwtPayload;

  try {
    jwtPayload = <any>jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return false;
  }

  const { userId, username } = jwtPayload;
  const newToken = jwt.sign({ userId, username }, config.jwt.secret, {
    expiresIn: '10s',
  });
  res.setHeader('token', newToken);

  return true;
};
