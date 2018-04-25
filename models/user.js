/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('User', {
    userCode: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    secondName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    DOB: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    FTE: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    Location_locationCode: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'Location',
        key: 'locationCode'
      }
    },
    supervisorUserCode: {
      type: DataTypes.STRING(45),
      allowNull: true,
      references: {
        model: 'Users',
        key: 'userCode'
      }
    }
  }, {
    timestamps: false
  }, {
    tableName: 'User'
  });
};
