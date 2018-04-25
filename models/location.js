/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Location', {
    locationCode: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    address: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'Location'
  });
};
