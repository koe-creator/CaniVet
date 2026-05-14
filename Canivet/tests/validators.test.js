import assert from 'node:assert/strict'

import {
  validateAppointmentForm,
  validateClientForm,
  validatePaymentForm,
  validatePetForm,
  validatePrice,
} from '../src/utils/validators.js'

const cases = [
  {
    name: 'validateClientForm acepta un cliente válido',
    run: () => {
      assert.deepEqual(
        validateClientForm({ nombre: 'Ana Pérez', email: 'ana@example.com' }),
        {},
      )
    },
  },
  {
    name: 'validateClientForm marca email inválido',
    run: () => {
      assert.deepEqual(
        validateClientForm({ nombre: 'Ana Pérez', email: 'ana' }),
        { email: 'Email inválido' },
      )
    },
  },
  {
    name: 'validatePetForm exige dueño',
    run: () => {
      assert.deepEqual(
        validatePetForm({ nombre: 'Luna', cliente_id: '' }),
        { cliente_id: 'Selecciona un dueño' },
      )
    },
  },
  {
    name: 'validateAppointmentForm exige campos obligatorios',
    run: () => {
      assert.deepEqual(
        validateAppointmentForm({ fecha: '', hora: '', cliente_id: '', mascota_id: '', servicio_id: '' }),
        {
          fecha: 'La fecha es requerida',
          hora: 'La hora es requerida',
          cliente_id: 'Selecciona un cliente',
          mascota_id: 'Selecciona una mascota',
          servicio_id: 'Selecciona un servicio',
        },
      )
    },
  },
  {
    name: 'validatePrice rechaza montos negativos',
    run: () => {
      assert.equal(validatePrice(-10), false)
      assert.equal(validatePrice(0), true)
    },
  },
  {
    name: 'validatePaymentForm exige monto y fecha válidos',
    run: () => {
      assert.deepEqual(
        validatePaymentForm({ cliente_id: '1', monto: '-2', fecha: '' }),
        {
          monto: 'Monto inválido',
          fecha: 'La fecha es requerida',
        },
      )
    },
  },
]

let passed = 0

for (const testCase of cases) {
  testCase.run()
  passed += 1
  console.log(`OK ${testCase.name}`)
}

console.log(`\n${passed} pruebas completadas`)
