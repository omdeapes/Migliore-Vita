'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Enable the uuid-ossp extension
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    // Run the entire complex migration as a single raw SQL transaction
    await queryInterface.sequelize.query(`
      BEGIN;

      -- 1. Add temporary UUID column to trips
      ALTER TABLE trips ADD COLUMN IF NOT EXISTS uuid UUID;
      UPDATE trips SET uuid = uuid_generate_v4() WHERE uuid IS NULL;
      ALTER TABLE trips ALTER COLUMN uuid SET NOT NULL;

      -- 2. Add temporary UUID columns to dependent tables
      ALTER TABLE invoices ADD COLUMN IF NOT EXISTS trip_uuid UUID;
      ALTER TABLE media ADD COLUMN IF NOT EXISTS "tripUuid" UUID;

      -- 3. Populate dependent tables with the new UUIDs
      UPDATE invoices i SET trip_uuid = t.uuid FROM trips t WHERE i.trip_id = t.id;
      UPDATE media m SET "tripUuid" = t.uuid FROM trips t WHERE m."tripId" = t.id;

      -- 4. Drop foreign key constraints
      ALTER TABLE invoices DROP CONSTRAINT IF EXISTS invoices_trip_id_fkey;
      ALTER TABLE media DROP CONSTRAINT IF EXISTS "media_tripId_fkey";

      -- 5. Drop old integer columns (CASCADE will handle the PK constraint on trips)
      ALTER TABLE invoices DROP COLUMN trip_id;
      ALTER TABLE media DROP COLUMN "tripId";
      ALTER TABLE trips DROP COLUMN id CASCADE;

      -- 6. Rename new UUID columns
      ALTER TABLE trips RENAME COLUMN uuid TO id;
      ALTER TABLE invoices RENAME COLUMN trip_uuid TO trip_id;
      ALTER TABLE media RENAME COLUMN "tripUuid" TO "tripId";

      -- 7. Add Primary Key constraint
      ALTER TABLE trips ADD PRIMARY KEY (id);

      -- 8. Re-add Foreign Key constraints
      ALTER TABLE invoices ADD CONSTRAINT invoices_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE;
      ALTER TABLE media ADD CONSTRAINT "media_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES trips(id) ON DELETE CASCADE;

      COMMIT;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Reverting this is complex and often unnecessary in development,
    // but leaving empty or throwing an error is standard for one-way migrations.
    throw new Error('This migration cannot be undone cleanly.');
  },
};
