import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Company from "./Company.js";

const Job = sequelize.define("Job", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  requirements: { type: DataTypes.JSON, allowNull: true },
  gpaMin: { type: DataTypes.FLOAT, defaultValue: 0 },
  status: { type: DataTypes.ENUM("open", "closed"), defaultValue: "open" },
  expiresAt: { type: DataTypes.DATE, allowNull: true },
});

// Relation: 1 Company → many Jobs
Job.belongsTo(Company, { foreignKey: "companyId", onDelete: "CASCADE" });
Company.hasMany(Job, { foreignKey: "companyId" });

export default Job;
