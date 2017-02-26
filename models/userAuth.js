module.exports = function(sequelize, DataTypes) {
  var Auth = sequelize.define("Auth", {
    username: DataTypes.STRING,
    password: DataTypes.STRING

  });

  return Auth;
  };
