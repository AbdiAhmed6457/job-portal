// src/models/Company.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Company = sequelize.define("Company", {
  name: { type: DataTypes.STRING, allowNull: false },
  logoUrl: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  recruiterUserId: { type: DataTypes.INTEGER, allowNull: false },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected", "revoked"),
    defaultValue: "pending",
  },
});

Company.belongsTo(User, { foreignKey: "recruiterUserId" });
User.hasOne(Company, { foreignKey: "recruiterUserId" });

export default Company;
