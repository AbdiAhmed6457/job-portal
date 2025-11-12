// src/models/Job.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Company from "./Company.js";

const Job = sequelize.define("Job", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  requirements: { type: DataTypes.JSON },
  gpaMin: { type: DataTypes.FLOAT },
  location: { type: DataTypes.STRING }, // optional field
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  status: {
    type: DataTypes.ENUM("pending", "approved", "rejected", "expired"),
    defaultValue: "pending",
  },
});

Job.belongsTo(Company, { foreignKey: "companyId" });
Company.hasMany(Job, { foreignKey: "companyId" });

export default Job;
