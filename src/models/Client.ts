import { DataTypes, Model, Sequelize } from 'sequelize';

export class Client extends Model {
    declare id: number;
    declare name: string;
    declare surname: string;
    declare email: string;
    declare password: string;
    declare isAdmin: boolean;
    declare cep: string;
    declare address: string;
    declare number?: string;
    declare complement?: string;
    declare neighborhood: string;
    declare city: string;
    declare state: string;
    declare status: boolean;

    static initModel(sequelize: Sequelize) {
        Client.init(
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

                surname: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },

                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                isAdmin: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                },

                cep: DataTypes.STRING,
                address: DataTypes.STRING,
                number: DataTypes.STRING,
                complement: DataTypes.STRING,
                neighborhood: DataTypes.STRING,
                city: DataTypes.STRING,
                state: DataTypes.STRING,

                status: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                tableName: 'clients',
                timestamps: true,
                underscored: true,
            }
        );
    }
}
