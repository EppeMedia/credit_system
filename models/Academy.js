/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Academy', {
    academyCode: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'Academy'
  });
};
