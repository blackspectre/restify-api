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

  console.log(token);

  //Try to validate the token and get data
  try {
    jwtPayload = <any>jwt.verify(token, config.jwt.secret);

    console.log(jwtPayload);
    //res['locals'].jwtPayload = jwtPayload;
  } catch (error) {
    console.log('erro');
    //If token is not valid, respond with 401 (unauthorized)
    res.send(401, 'Not authorized');

    return;
  }
  console.log('here');
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
