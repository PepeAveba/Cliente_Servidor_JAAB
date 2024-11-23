const {request, response} = require('express');
const pool = require('../db/connection');
const { pokemonQueries } = require('../models/pokemon');

const getAll = async (req = request, res = response) => {
    let conn;
    try{
        conn = await pool.getConnection();
        const pokemons = await conn.query(pokemonQueries.getAll);
        res.send(pokemons);
    }
    catch(err){
        res.status(500).send(err);
    }

    finally{
        if (conn) conn.end();
    }
}

const getByID = async (req = request, res = response) =>{
    const {id} = req.params;

    if (isNaN (id)){
        res.status(400).send('Invalid ID!');
        return;
    }

    let conn;
    try{
        conn = await pool.getConnection();
        const pokemon = await conn.query(pokemonQueries.getByID, [id]);
    
    if (pokemon.lenght===0) {
        res.status(404).send('Pokemon not Found!');
        return;
    }
        res.send(pokemon);
    }   catch (error){
        res.status(500).send(error);
    }   finally{
        if (conn) conn.end();
    }

}

const addPokemon = async (req = request, res = response) => {
    const {pokemon} = req.body;

    if (!pokemon){
        res.status(400).send('Pokemon Fiels is Required');
        return;
    }

    let conn;
    try{
        conn = await pool.getConnection();

        const pokemon_exists = await conn.query(pokemonQueries.getByPokemonName, [pokemon]);

        if(pokemon_exists.lenght > 0){
            res.status(400).send('Pokemon Already Exists');
            return;
        }

        const newPokemon = await conn.query(pokemonQueries.createPokemon, [pokemon]);

        if (newPokemon.affectedRows === 0 ){
            res.status(500).send('Failed to Create the Pokemon');
            return;
        }

        res.status(200).send('Pokemon Added'); 
    }

    catch (error){
        res.status(500).send(error);
    }

    finally{
        if (conn) conn.end();
    }
   }

   const updatePokemon = async (req = request, res = response) => {
    const {id} = req.params;
    const {pokemon} = req.body;

    if (isNaN(id)){
        res.status(400).send('Invalid ID');
        return;
    }

    if (!pokemon){
        res.status(400).send('Pokemon Field is Required');
        return;
    }

    let conn;
    try{
        conn = await pool.getConnection();

        const pokemon_exists = await conn.query(pokemonQueries.getByID, [id]);
        if (pokemon_exists.lenght === 0) {
            res.status(400).send('Pokemon not Found');
            return;
        }

        const updatePokemon = await conn.query(pokemonQueries.updatePokemon, [pokemon, id]);
        if (updatePokemon.affectedRows === 0){
            res.status(500).send('Failed to Update Pokemon');
            return;
        }

        res.status(200).send('Pokemon Updated Successfully');
    }
    
    catch (error) {
        res.status(500).send(error);
    }

    finally {
        if(conn) conn.end();
    }

   }

   const deletePokemon = async (req = request, res = response) => {
    const {id} = req.params;

    if (isNaN(id)){
        res.status(400).send('Invalid ID');
        return;
    }

    let conn;
    try{
        conn = await pool.getConnection();

        const pokemon_exists = await conn.query(pokemonQueries.getByID, [id]);
        if (pokemon_exists.lenght === 0) {
            res.status(400).send('Pokemon not Found');
            return;
        }

        const deletePokemon = await conn.query(pokemonQueries.deletePokemon, [id]);
        if (updatePokemon.affectedRows === 0){
            res.status(500).send('Failed to Delete Pokemon');
            return;
        }
        res.status(200).send('Pokemon Deleted Successfully');
    }
    
    catch (error) {
        res.status(500).send(error);
    }

    finally{
        if(conn) conn.end();
    }  
        }

module.exports = {
    getAll,
    getByID,
    addPokemon,
    updatePokemon,
    deletePokemon
}