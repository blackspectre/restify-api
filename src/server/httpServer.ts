import { RequestHandler } from 'restify';

export interface HttpServer {
  get(url: string, requestHandler: RequestHandler): any;
  post(url: string, requestHandler: RequestHandler): any;
  put(url: string, requestHandler: RequestHandler): any;
  del(url: string, requestHandler: RequestHandler): any;
}
