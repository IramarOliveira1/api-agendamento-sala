import { DataTypes, Model, Sequelize } from 'sequelize';

export class Scheduling extends Model {
  declare id: number;
  declare date_scheduling: Date;
  declare status: string;
  declare id_client: number;
  declare id_room: number;

  static initModel(sequelize: Sequelize) {
    Scheduling.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        date_scheduling: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'PENDING',
        },
        id_client: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        id_room: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'schedulings',
        timestamps: true,
        underscored: true,
      }
    );
  }
}