module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        role: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
                isIn: {
                    args: [[
                        "администратор",
                        "медсестра",
                        "медбрат",
                        "бухгалтер",
                        "главврач",
                        "заведующий отделением"
                    ]],
                    msg: "Недопустимое значение роли"
                }
            }
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING(255),
            allowNull: false
        }
    }, {
        schema: "MedTrack",
        timestamps: false
    });

    return User;
};