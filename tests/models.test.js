const mongoose = require('mongoose');


const joyaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    material: { type: String, required: true, enum: ['Oro', 'Plata', 'Diamante'] },
    precio: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 1 }
});
const Joya = mongoose.model('Joya', joyaSchema);

const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, match: /.+\@.+\..+/ },
    edad: { type: Number, min: 18 }
    });
const Cliente = mongoose.model('Cliente', clienteSchema);

describe('Pruebas de Modelos de la Joyería', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/joyeria_test_db');
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Joya.deleteMany({});
        await Cliente.deleteMany({});
        });

    describe('Modelo: Joya', () => {
    it('1. [Positivo] Debería crear una joya válida con todos los campos', async () => {
        const joya = new Joya({ nombre: 'Anillo', material: 'Oro', precio: 500 });
        const joyaGuardada = await joya.save();
        expect(joyaGuardada._id).toBeDefined();
        expect(joyaGuardada.nombre).toBe('Anillo');
    });

    it('2. [Positivo] Debería asignar el stock por defecto si no se proporciona', async () => {
        const joya = new Joya({ nombre: 'Collar', material: 'Plata', precio: 150 });
        const joyaGuardada = await joya.save();
        expect(joyaGuardada.stock).toBe(1);
    });

    it('3. [Negativo] Debería fallar si falta el campo obligatorio "nombre"', async () => {
        const joyaSinNombre = new Joya({ material: 'Oro', precio: 500 });
        let error = joyaSinNombre.validateSync();
        expect(error.errors.nombre).toBeDefined();
    });

    it('4. [Negativo] Debería fallar si el "material" no está en el enum permitido', async () => {
        const joyaMaterialInvalido = new Joya({ nombre: 'Pulsera', material: 'Madera', precio: 50 });
        let error = joyaMaterialInvalido.validateSync();
        expect(error.errors.material).toBeDefined();
    });

    it('5. [Negativo] Debería fallar si el "precio" es negativo', async () => {
        const joyaPrecioNegativo = new Joya({ nombre: 'Pendientes', material: 'Plata', precio: -10 });
        let error = joyaPrecioNegativo.validateSync();
        expect(error.errors.precio).toBeDefined();
    });
    });

    describe('Modelo: Cliente', () => {
        it('6. [Positivo] Debería crear un cliente válido', async () => {
            const cliente = new Cliente({ nombre: 'Ana', email: 'ana@email.com', edad: 25 });
            const clienteGuardado = await cliente.save();
            expect(clienteGuardado._id).toBeDefined();
    });

    it('7. [Positivo] Debería permitir crear un cliente sin el campo edad (no es required)', async () => {
        const clienteSinEdad = new Cliente({ nombre: 'Luis', email: 'luis@email.com' });
        const clienteGuardado = await clienteSinEdad.save();
        expect(clienteGuardado._id).toBeDefined();
    });

    it('8. [Positivo] Debería actualizar correctamente un cliente existente', async () => {
        const cliente = new Cliente({ nombre: 'Carlos', email: 'carlos@email.com', edad: 30 });
        await cliente.save();
        cliente.edad = 31;
        const actualizado = await cliente.save();
        expect(actualizado.edad).toBe(31);
    });

    it('9. [Negativo] Debería fallar si falta el "nombre" del cliente', async () => {
        const clienteSinNombre = new Cliente({ email: 'test@test.com', edad: 20 });
        let error = clienteSinNombre.validateSync();
        expect(error.errors.nombre).toBeDefined();
    });

    it('10. [Negativo] Debería fallar si el formato del "email" es inválido', async () => {
        const clienteEmailInvalido = new Cliente({ nombre: 'Pedro', email: 'pedrosinarrroba.com' });
        let error = clienteEmailInvalido.validateSync();
        expect(error.errors.email).toBeDefined();
    });

    it('11. [Negativo] Debería fallar si la "edad" es menor al mínimo permitido', async () => {
        const clienteMenor = new Cliente({ nombre: 'Juan', email: 'juan@email.com', edad: 15 });
        let error = clienteMenor.validateSync();
        expect(error.errors.edad).toBeDefined();
    });
});

});