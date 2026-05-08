const express = require('express');
const router = require('../src/routes/indexRouter');

const app = express();
app.use(express.json());
app.use('/', router);

console.log('--- Verificando rutas registradas ---');
const routes = [];

function print(path, layer) {
  if (layer.route) {
    layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
  } else if (layer.name === 'router' && layer.handle.stack) {
    layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
  } else if (layer.method) {
    routes.push(`${layer.method.toUpperCase()} ${path.concat(split(layer.regexp)).filter(Boolean).join('/')}`)
  }
}

function split(thing) {
  if (typeof thing === 'string') {
    return thing.split('/')
  } else if (thing.fast_slash || thing.fast_star) {
    return ''
  } else {
    var b = thing.toString().replace('\\/?', '').replace('(?=\\/|$)', '').match(/^\/\^((?:\\[.*+?^${}()|[\]\\]|[^\/*+?^${}()|[\]\\])*)\$\//)
    return b ? b[1].replace(/\\(.)/g, '$1').split('/') : '<complex:' + thing.toString() + '>'
  }
}

app._router.stack.forEach(print.bind(null, []))

const expectedRoutes = [
  'GET food',
  'POST food',
  'POST order',
  'PUT order',
  'GET user',
  'POST user',
  'POST favorite',
  'GET review',
  'POST review'
];

let allFound = true;
expectedRoutes.forEach(expected => {
  const found = routes.some(r => r.includes(expected));
  if (found) {
    console.log(`✅ [OK] Ruta encontrada: ${expected}`);
  } else {
    console.log(`❌ [ERROR] Ruta no encontrada: ${expected}`);
    allFound = false;
  }
});

if (allFound) {
  console.log('\n--- Resultado: Todas las rutas críticas están registradas correctamente ---');
} else {
  console.log('\n--- Resultado: Faltan rutas críticas ---');
}
