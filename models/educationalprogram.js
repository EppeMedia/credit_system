/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('EducationalProgram', {
    eduProgramCode: {
      type: DataTypes.STRING(45),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    academyCode: {
      type: DataTypes.STRING(45),
      allowNull: false,
      references: {
        model: 'Academy',
        key: 'academyCode'
      }
    }
  }, {
    tableName: 'EducationalProgram'
  });
};
