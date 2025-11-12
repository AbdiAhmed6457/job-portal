// models/AuditLog.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const AuditLog = sequelize.define("AuditLog", {
  action: { type: DataTypes.STRING, allowNull: false },
  entity: { type: DataTypes.STRING, allowNull: false },
  entityId: { type: DataTypes.INTEGER, allowNull: false },
  performedBy: { type: DataTypes.INTEGER, allowNull: false },
  performedAt: { type: DataTypes.DATE, allowNull: false },
  details: { type: DataTypes.TEXT, allowNull: true },
});

export default AuditLog;
