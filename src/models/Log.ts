import { DataTypes, Model, Sequelize } from 'sequelize';

export class Log extends Model {
    declare id: number;
    declare type: string;
    declare module: string;
    declare id_client: number;

    static initModel(sequelize: Sequelize) {
        Log.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },

                type: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                module: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                id_client: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: 'logs',
                timestamps: true,
                underscored: true,
                updatedAt: false,
            }
        );
    }

}
