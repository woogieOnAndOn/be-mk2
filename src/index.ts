import 'reflect-metadata';
import * as bodyParser from 'body-parser';
import { interfaces, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { container } from '../src/config/ioc.container'; 
import cors from 'cors';


// create server
let server = new InversifyExpressServer(container);
server.setConfig((app) => {
  app.use(cors({origin: true}))

  // add body parser
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
});
 
let app = server.build();
app.listen(8099);