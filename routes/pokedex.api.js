const fs = require("fs");
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  const allowedFilter = ["page", "limit","type", "search"];
  // request url /pokemons?page=${page}&limit=${POKEMONS_PER_PAGE}&search=${search}&type=${type}`;
  try {
    let { page, limit,  ...filterQuery } = req.query;
    // console.log(search)
    console.log(filterQuery)
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    offset = limit * (page - 1);
    const filterKeys = Object.keys(filterQuery);
    console.log(filterKeys)

    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        const exception = new Error(`Query ${key} is not allowed`);
        exception.statusCode = 401;
        throw exception;
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });

    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const { data } = db;
    let result = [];
    if (filterKeys.length) {

      console.log('got key')
      filterKeys.map((condition)=>{
        if(condition == 'search'){
          // const matcher = new RegExp(`^${filterQuery[condition]}, 'g`)
          let filterByName = data.filter((poke)=> poke.name.includes(filterQuery[condition]))
          result = filterByName
        } else if(condition == 'type'){
          let filterByType = data.filter((poke)=> poke.types.includes(filterQuery[condition]))
          result = filterByType
        }
      })
    } else {
      result = data;
    }
    result = result.slice(offset, offset + limit);

    // console.log(result);

    res.status(200).send({data:result});
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.get('/:pokemonId', (req,res,next)=>{
  let {pokemonId} = req.params
  pokemonId = parseInt(pokemonId)
  try {
    let db = fs.readFileSync('db.json', 'utf-8')
    db = JSON.parse(db)
    const {data, totalPokemons} = db

    let result = {
      pokemon: {},
      previousPokemon: {},
      nextPokemon: {},
    }
    let curr = pokemonId
    let next = (curr + 1) % data.length
    let prev = curr === 1 ? data.length : (curr + data.length - 1) % data.length
    data.map((poke)=> {
      switch (poke.id) {
        case next:
              result.nextPokemon = poke
          break;
        case prev:
              result.previousPokemon = poke 
          break;
        case curr:
              result.pokemon = poke
          break;
        default:
          return poke

      }
    })
    console.log(prev, curr, next, pokemonId)
    res.status(200).send( {data:result})
  } catch (error) {
    res.status(500).json(error.message)
  }
})

router.post('/', (req,res,next)=> {
  const pokemonTypes = [
    "bug", "dragon", "fairy", "fire", "ghost", 
    "ground", "normal", "psychic", "steel", "dark", 
    "electric", "fighting", "flyingText", "grass", "ice", 
    "poison", "rock", "water"
    ]
  try {
    const { name, id, url, types } = req.body
    if(!name || !id || !url || !types){
      const exception = new Error('Missing body info')
      exception.statusCode = 401
      throw exception
    }
    
    if(types.length > 2){
      let exception = new Error('No more than 2 types')
      exception.statusCode = 401
      throw exception
    }

    types.forEach((type)=>{
      console.log(type)
      if(!pokemonTypes.includes(type)){
        let exception = new Error('type not exist')
        exception.statusCode = 401
        throw exception
      }
      if (!types[type]) delete types[type]
    })


    console.log(newPokemon)
    let db = fs.readFileSync('db.json', 'utf-8')
    db=JSON.parse(db)
    const {data} = db
    data.forEach((poke)=>{
      if(poke.name == name || poke.id === id){
        let exception = new Error('pokemon already exist')
        exception.statusCode = 401
        throw exception
      }
    })
    const newPokemon = {id, name, types, url }
    res.status(200).send({data:newPokemon})
  } catch (error) {
    res.status(500).json(error.message)
    
  }
})

module.exports = router;
