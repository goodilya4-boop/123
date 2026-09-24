module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        last_name: {
            type: Sequelize.STRING(50),
            allowNull: true
        },
        role: {
            type: Sequelize.STRING(50),
            allowNull: true,
            validate: {
                isIn: {
                    args: [[
                        'администратор', 
                        'медсестра', 
                        'медбрат', 
                        'бухгалтер', 
                        'главврач', 
                        'заведующий отделением'
                    ]],
                    msg: "Недопустимое значение роли"
                }
            }
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        password: {
            type: Sequelize.STRING(50),
            allowNull: false
        }
    }, {
        schema: 'MedTrack',
        timestamps: false
    });

    return User;
};