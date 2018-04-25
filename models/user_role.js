/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User_Role', {
    roleCode: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Role',
        key: 'roleCode'
      }
    },
    userCode: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'userCode'
      }
    }
  }, {
    tableName: 'User_Role'
  });
};
