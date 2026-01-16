import { DataTypes, Model, Sequelize } from 'sequelize';
import { Scheduling } from './Scheduling';

export class Room extends Model {
    declare id: number;
    declare name: string;
    declare start_time: string;
    declare end_time: string;
    declare room_duration: number;
    declare status?: boolean;
    declare schedulings?: Scheduling[];

    static initModel(sequelize: Sequelize) {
        Room.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                start_time: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                end_time: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                room_duration: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                tableName: 'rooms',
                timestamps: true,
                underscored: true,
            }
        );
    }
}
