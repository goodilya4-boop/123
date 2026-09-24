module.exports = (sequelize, Sequelize) => {
    return sequelize.define("access", {
        id: { 
            type: Sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },
        user_id: { 
            type: Sequelize.INTEGER, 
            allowNull: false 
        },
        access: { 
            type: Sequelize.STRING(50) 
        }
    }, {
        schema: 'MedTrack',
        tableName: 'access',
        timestamps: false
    });
};