import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const Company = sequelize.define("Company", {
  name: { type: DataTypes.STRING, allowNull: false },
  logoUrl: { type: DataTypes.STRING, allowNull: true },
});

// Relation: 1 User (recruiter) → 1 Company
Company.belongsTo(User, { foreignKey: "recruiterUserId", onDelete: "CASCADE" });
User.hasOne(Company, { foreignKey: "recruiterUserId" });

export default Company;
