import { sequelize } from '../config/database';

import { Client } from './Client';
import { Scheduling } from './Scheduling';
import { Log } from './Log';
import { Room } from './Room';

Client.initModel(sequelize);
Scheduling.initModel(sequelize);
Log.initModel(sequelize);
Room.initModel(sequelize);

import './associations';

export {
  sequelize,
  Client,
  Scheduling,
  Log,

};
