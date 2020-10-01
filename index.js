#!/usr/bin/env node
'use strict';

const fetch = require('node-fetch');
const updateNotifier = require('update-notifier');
const yargs = require('yargs');

const pkg = require('./package.json');

updateNotifier({pkg}).notify();
  
const argv = yargs
  .option('page', {
    alias: 'p',
    type: 'number',
    default: 1,
  })
  .option('limit', {
    alias: 'l',
    type: 'number',
    default: 20,
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean'
  })
  .argv;

const url = `https://icanhazdadjoke.com`;

const options = {
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'dadjoke (https://github.com/mcbobby123/dadjoke)',
  }
};

function fetchFromAPI(path, params = {}){
  const paramEntries = Object.entries(params);
  const qs = paramEntries.length ? '?' + paramEntries.map(([k, v]) => `${k}=${v}`).join('&') : '';
  try{
    return fetch(`${url}${path}${qs}`, options).then(r => r.json());
  }catch(e){
    return {status: 400, message: e};
  }
}

function logJoke(joke){
  if(!joke.status || joke.status === 200) {
    console.log(joke.joke);
    if(argv.verbose) console.log('id:', joke.id);
  } else {
    console.log('Uh oh,', joke.message);
  }
}

(async()=>{
  if(!argv._.length){
    const joke = await fetchFromAPI(argv.id ? `/j/${argv.id}` : '/');
    logJoke(joke);
  }else{
    switch(argv._[0]){
      case 'search': {
        const results = await fetchFromAPI(`/search`, {
          page: argv.page,
          limit: argv.limit,
          term: argv._[1],
        });
        if(results.status !== 200){
          console.log(`Uh oh, ${results.message}`);
        } else {
          console.log(`Found ${results.total_jokes} results ${results.total_jokes > results.results.length ? `(Displaying ${results.results.length})` : ''}`);
          results.results.forEach(logJoke);
        }
      }
    }
  }
})();
