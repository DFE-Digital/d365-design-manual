declare module 'express-force-https' {
    import { RequestHandler } from 'express';
  
    function forceHttps(options?: object): RequestHandler;
  
    export = forceHttps;
}
  