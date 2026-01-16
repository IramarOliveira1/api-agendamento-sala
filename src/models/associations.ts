import { Client } from './Client';
import { Scheduling } from './Scheduling';
import { Log } from './Log';
import { Room } from './Room';

Client.hasMany(Scheduling, {
    foreignKey: 'id_client',
    as: 'schedulings',
});

Scheduling.belongsTo(Client, {
    foreignKey: 'id_client',
    as: 'client',
});

Client.hasMany(Log, {
    foreignKey: 'id_client',
    as: 'logs',
});

Log.belongsTo(Client, {
    foreignKey: 'id_client',
    as: 'client',
});

Room.hasMany(Scheduling, {
    foreignKey: 'id_room',
    as: 'schedulings',
});

Scheduling.belongsTo(Room, {
    foreignKey: 'id_room',
    as: 'room',
});