import * as restify from 'restify';
import { RequestHandler, Server } from 'restify';
import { HttpServer } from './httpServer';
import { CONTROLLERS } from '../controllers';

import * as rjwt from 'restify-jwt-community';
import { config } from '../../config';

export class ApiServer implements HttpServer {
  private restify: Server;

  public get(url: string, requestHandler: RequestHandler): any {
    this.addRoute('get', url, requestHandler);
  }
  public post(url: string, requestHandler: RequestHandler): any {
    this.addRoute('post', url, requestHandler);
  }
  public put(url: string, requestHandler: RequestHandler): any {
    this.addRoute('put', url, requestHandler);
  }
  public del(url: string, requestHandler: RequestHandler): any {
    this.addRoute('del', url, requestHandler);
  }

  private addRoute(method: 'get' | 'post' | 'put' | 'del', url: string, requestHandler: RequestHandler) {
    this.restify[method](url, async (req, res, next) => {
      try {
        await requestHandler(req, res, next);
      } catch (e) {
        console.error(e);
        res.send(500, e);
      }
    });

    console.log(`Added route ${method.toUpperCase()}: ${url}`);
  }

  public start(port: number): any {
    this.restify = restify.createServer();
    this.restify.use(restify.plugins.bodyParser());
    this.restify.use(restify.plugins.queryParser());

    this.restify.use(
      rjwt({
        secret: config.jwt.secret,
        credentialsRequired: true,
        getToken: function fromHeaderOrQuerystring(req: restify.Request) {
          if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
          } else if (req.query && req.query.token) {
            return req.query.token;
          }
          return null;
        },
      }).unless({
        path: ['/authenticate'],
      }),
    );

    CONTROLLERS.forEach((controller) => controller.initialize(this));

    this.restify.listen(port, () => console.log(`Server is up and running on port ${port}`));
  }
}
