var express = require('express');
var router = express.Router();

const pokedex = require('./pokedex.api')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send('pokedex');
});

router.use('/pokemons', pokedex)




module.exports = router;
