const mongoose = require('mongoose');
const Coleccion = require('../models/Coleccion');
const Reloj = require('../models/Reloj');

describe('Pruebas de Modelos de la Joyería', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/joyeria_test_db');
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Coleccion.deleteMany({});
        await Reloj.deleteMany({});
    });

    // ─── MODELO: Coleccion ────────────────────────────────────────────────────

    describe('Modelo: Coleccion', () => {

        it('1. [Positivo] Debería crear una colección válida con todos los campos', async () => {
            const col = new Coleccion({ nombre: 'Verano Eterno', temporada: 'Verano', activa: false });
            const guardada = await col.save();
            expect(guardada._id).toBeDefined();
            expect(guardada.nombre).toBe('Verano Eterno');
            expect(guardada.temporada).toBe('Verano');
            expect(guardada.activa).toBe(false);
        });

        it('2. [Positivo] Debería asignar los valores por defecto (temporada, activa, fechaLanzamiento)', async () => {
            const col = new Coleccion({ nombre: 'Básica' });
            const guardada = await col.save();
            expect(guardada.temporada).toBe('Atemporal');
            expect(guardada.activa).toBe(true);
            expect(guardada.fechaLanzamiento).toBeDefined();
        });

        it('3. [Positivo] Debería permitir crear una colección solo con el nombre mínimo requerido', async () => {
            const col = new Coleccion({ nombre: 'Abc' });
            const guardada = await col.save();
            expect(guardada._id).toBeDefined();
        });

        it('4. [Positivo] Debería actualizar el campo activa de una colección existente', async () => {
            const col = new Coleccion({ nombre: 'Temporal' });
            await col.save();
            col.activa = false;
            const actualizada = await col.save();
            expect(actualizada.activa).toBe(false);
        });

        it('5. [Negativo] Debería fallar si falta el campo obligatorio "nombre"', () => {
            const col = new Coleccion({ temporada: 'Invierno' });
            const error = col.validateSync();
            expect(error).toBeDefined();
            expect(error.errors.nombre).toBeDefined();
        });

        it('6. [Negativo] Debería fallar si el nombre tiene menos de 3 caracteres', () => {
            const col = new Coleccion({ nombre: 'AB' });
            const error = col.validateSync();
            expect(error).toBeDefined();
            expect(error.errors.nombre).toBeDefined();
        });

        it('7. [Negativo] Debería fallar si la temporada no está en los valores permitidos del enum', () => {
            const col = new Coleccion({ nombre: 'Especial', temporada: 'Monzón' });
            const error = col.validateSync();
            expect(error).toBeDefined();
            expect(error.errors.temporada).toBeDefined();
        });

    });

    // ─── MODELO: Reloj ────────────────────────────────────────────────────────

    describe('Modelo: Reloj', () => {

        let coleccionRef;

        beforeEach(async () => {
            coleccionRef = await new Coleccion({ nombre: 'Referencia' }).save();
        });

        it('8. [Positivo] Debería crear un reloj válido con todos los campos', async () => {
            const reloj = new Reloj({
                modelo: 'Submariner',
                precio: 8500,
                tipoMovimiento: 'Automático',
                resistenciaAgua: 300,
                esEdicionLimitada: true,
                coleccion: coleccionRef._id
            });
            const guardado = await reloj.save();
            expect(guardado._id).toBeDefined();
            expect(guardado.modelo).toBe('Submariner');
            expect(guardado.esEdicionLimitada).toBe(true);
        });

        it('9. [Positivo] Debería asignar los valores por defecto (resistenciaAgua y esEdicionLimitada)', async () => {
            const reloj = new Reloj({ modelo: 'Clásico', precio: 300, coleccion: coleccionRef._id });
            const guardado = await reloj.save();
            expect(guardado.resistenciaAgua).toBe(30);
            expect(guardado.esEdicionLimitada).toBe(false);
        });

        it('10. [Positivo] Debería actualizar el precio de un reloj existente', async () => {
            const reloj = new Reloj({ modelo: 'Sport Pro', precio: 200, coleccion: coleccionRef._id });
            await reloj.save();
            reloj.precio = 250;
            const actualizado = await reloj.save();
            expect(actualizado.precio).toBe(250);
        });

        it('11. [Negativo] Debería fallar si falta el campo obligatorio "modelo"', () => {
            const reloj = new Reloj({ precio: 500, coleccion: coleccionRef._id });
            const error = reloj.validateSync();
            expect(error).toBeDefined();
            expect(error.errors.modelo).toBeDefined();
        });

        it('12. [Negativo] Debería fallar si el precio es negativo', () => {
            const reloj = new Reloj({ modelo: 'Diver', precio: -100, coleccion: coleccionRef._id });
            const error = reloj.validateSync();
            expect(error).toBeDefined();
            expect(error.errors.precio).toBeDefined();
        });

        it('13. [Negativo] Debería fallar si el tipoMovimiento no está en el enum permitido', () => {
            const reloj = new Reloj({ modelo: 'Digital X', precio: 150, tipoMovimiento: 'Eléctrico', coleccion: coleccionRef._id });
            const error = reloj.validateSync();
            expect(error).toBeDefined();
            expect(error.errors.tipoMovimiento).toBeDefined();
        });

    });

});
