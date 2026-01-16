'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('123456', 12);

    await queryInterface.bulkInsert('clients', [
      {
        name: 'Admin',
        surname: 'Sistema',
        email: 'admin@sistema.com',
        password: passwordHash,
        is_admin: true,
        cep: '00000-000',
        address: 'Endereço Admin',
        number: 1462,
        complement: 'apto',
        neighborhood: 'Centro',
        city: 'Sistema',
        state: 'BR',
        status: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('clients', {
      email: 'admin@sistema.com',
    });
  },
};
