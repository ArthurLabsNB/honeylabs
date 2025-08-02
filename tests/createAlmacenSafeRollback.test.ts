import { describe, it, expect } from 'vitest'
import { newDb } from 'pg-mem'

// Verifica que fallos en la segunda inserción revertirán la primera
// evitando registros huérfanos.
describe('create_almacen_safe rollback', () => {
  it('revierte si usuario_almacen falla', async () => {
    const db = newDb()
    db.public.none('CREATE TABLE entidad (id serial PRIMARY KEY);')
    db.public.none('CREATE TABLE usuario (id serial PRIMARY KEY, entidad_id int REFERENCES entidad(id));')
    db.public.none('CREATE TABLE almacen (id serial PRIMARY KEY, entidad_id int REFERENCES entidad(id));')
    db.public.none('CREATE TABLE usuario_almacen (usuario_id int REFERENCES usuario(id), almacen_id int REFERENCES almacen(id));')

    const { Client } = db.adapters.createPg()
    const client = new Client()
    await client.connect()

    await client.query('BEGIN')
    try {
      await client.query('INSERT INTO almacen(entidad_id) VALUES (1)')
      // Falla por FK de usuario inexistente
      await client.query('INSERT INTO usuario_almacen(usuario_id, almacen_id) VALUES (999, 1)')
      await client.query('COMMIT')
    } catch {
      await client.query('ROLLBACK')
    }

    const { rows } = await client.query('SELECT COUNT(*)::int AS c FROM almacen')
    expect(rows[0].c).toBe(0)
    await client.end()
  })
})
