module.exports = (sequelize, Sequelize) => {
    return sequelize.define("audit", {
        id: { 
            type: Sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        user_id: { 
            type: Sequelize.INTEGER, 
            allowNull: false 
        },
        user_event: { 
            type: Sequelize.STRING(50) 
        },
        user_access: { 
            type: Sequelize.INTEGER, 
            allowNull: false 
        },
        time_start: { 
            type: Sequelize.DATEONLY 
        },
        time_end: { 
            type: Sequelize.DATEONLY, 
            allowNull: false 
        }
    }, {
        schema: 'MedTrack',
        tableName: 'audit',
        timestamps: false
    });
};