const Sequelize = require('sequelize');
const {STRING, UUID, UUIDV4} = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/pet_db');

const License = conn.define('license', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING,
    unique: true
  }
});

const User = conn.define('user', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING,
    allowNull: false,
    unique: true
  }
});

const Pet = conn.define('pet', {
  id: {
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4
  },
  name: {
    type: STRING,
    allowNull: false,
    unique: true
  }
});

License.belongsTo(User);
User.hasMany(License);

License.belongsTo(Pet);
Pet.hasMany(License);

const syncAndSeed = async () => {
  await conn.sync({force: true});

  const users = [
    {name: 'Bill'},
    {name: 'Cody'},
    {name: 'Will'}
  ];
  const [bill, cody, will] = await Promise.all(users.map(user => User.create(user)));

  const pets = [
    {name: 'Spot'},
    {name: 'Rose'},
    {name: 'Max'},
    {name: 'Bella'},
    {name: 'Barly'}
  ];
  const [spot, rose, max, bella, barly] = await Promise.all(pets.map(pet => Pet.create(pet)))

  const licenses = [
    {name: 'Dog License', userId: cody.id, petId: spot.id},
    {name: 'Cat License', userId: will.id, petId: bella.id},
    {name: 'lizard License', userId: bill.id, petId: max.id},
    {name: 'Bird License', userId: bill.id, petId: barly.id},
    {name: 'Fish License', userId: cody.id, petId: rose.id},
  ];
  const [dog, cat, lizard, bird, fish] = await Promise.all(licenses.map(license => License.create(license)));

}

syncAndSeed();

module.exports={
  syncAndSeed,
  module: {
    User,
    Pet,
    License
  }
}
