module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define("Gallery", {
    author: DataTypes.STRING,
    link: DataTypes.TEXT,
    description: DataTypes.STRING

  });

  return Gallery;
  };
