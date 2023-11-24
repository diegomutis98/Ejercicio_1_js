
// constantes para el despliege del error y de la tageta prinsipal
const containerErrorElement = document.querySelector(".containerError");
const containerInfoElement = document.querySelector(".containerInfo");

// variable para ir obteniendo el nombre de la siguente evolucion dado el caso
var nextEvolutio = "";

// captura del evento click search
const button1 = document.querySelector(".buttonSearch");
button1.addEventListener("click",()=> capturar());

// captiure cleck event for evolution
const button2 = document.querySelector('.buttonEvolution');
button2.addEventListener("click",()=> evolucionar());

// function for button search
function capturar(){
    const in1 = document.getElementById('in1').value;
    // construcion de la url para el pokemeon dado
    const url = "https://pokeapi.co/api/v2/pokemon/" + in1;
    const responseApi = ConsumirApiWithAxios(url);
    getDatosApi(responseApi);
}

// funtion fot button Evolution
function evolucionar(){
    const url = "https://pokeapi.co/api/v2/pokemon/" + nextEvolutio;
    console.log(url);
    const responseApi = ConsumirApiWithAxios(url);
    getDatosApi(responseApi);
}

// funcion para consultar la Api, nos retorna una promesa
async function ConsumirApiWithAxios(url){
    containerErrorElement.style.display = 'none';
    try{
        const response = await axios.get(url);
        console.log(`la petición a la Api se completó correctamente: ${response.status}`);
        return await response.data;
    }
    catch(error){
        console.log(`Falló la peticion con error: ${error.message}`);
        containerInfoElement.style.display = 'none';
        document.querySelector('.containerEvolution').style.display = 'none';
        containerErrorElement.style.display = 'flex';
    }
}

// Funcion para consumir la Api
async function getDatosApi(resp){
    const resApi = await resp;
    //console.log(resApi);
    const forms = resApi.forms;

    // name of the pokemon
    const pokemonName = forms[0].name;
    document.querySelector('.pokemonName').textContent = `${pokemonName}`;
    //console.log(pokemonName);

    // imagen of the pokemon
    const pokemonSprites = resApi.sprites.other["official-artwork"].front_default;
    document.querySelector('.pokemonImg').src = pokemonSprites;
    //console.log(pokemonSprites);

    // information type for the pokemon
    const pokemenType = resApi.types[0].type.name;
    document.querySelector('.pokemonType').textContent = `${pokemenType}`;

    // for para extrael las abilidades
    const numHabilities = resApi.abilities.length;
    var abilities = "";
    if(numHabilities>0){
        abilities = resApi.abilities[0].ability.name;
        for(let i = 1; i < numHabilities; i++){
            abilities = abilities + ', ' + resApi.abilities[i].ability.name;
        }
    }
    else{
        abilities = "None";
    }
    document.querySelector('.pokemonAbilities').textContent = `${abilities}`;

    // we add the prisipal information
    containerInfoElement.style.display = 'flex';

    // accedemos al endpoint Species
    const pokemonSpeciesUrl = resApi.species.url;
    const responseApiSpecies = ConsumirApiWithAxios(pokemonSpeciesUrl);
    getDatosApiSpecies(responseApiSpecies);
}

async function getDatosApiSpecies(resp){
    const resApi = await resp;

    // obtenemos la descripción para un pokemon dado
    const pokemonDescription1 = resApi.flavor_text_entries[26].flavor_text;
    const pokemonDescription2 = resApi.flavor_text_entries[79].flavor_text;
    const pokemonDescription = pokemonDescription1+' '+pokemonDescription2;
    document.querySelector('.pokemonDescrition').textContent = pokemonDescription;

    // accedemos al endpoint de evolution chain
    const evolutionChainUrl = resApi.evolution_chain.url;
    const responseApiEvoltionChain = ConsumirApiWithAxios(evolutionChainUrl);
    getDatosApiSEvolutionChain(responseApiEvoltionChain); 
}

async function getDatosApiSEvolutionChain(resp){
    const resApi = await resp;
    let nextChain = resApi.chain;
    let pokename = resApi.chain.species.name;

    // para obtener el objeto con los datos de la evolución adecuada
    while(pokename != document.querySelector('.pokemonName').textContent){
        nextChain = calcular_next(nextChain);
        pokename = nextChain.species.name;
        console.log(nextChain);
    }

    // verificamos si el pokemon tiene evoluciones
    if(nextChain.evolves_to.length > 0){
        nextEvolutio = nextChain.evolves_to[0].species.name;
        console.log(nextEvolutio);

        document.querySelector('.containerEvolution').style.display = 'flex';

    }
    else{
        document.querySelector('.containerEvolution').style.display = 'none';
    }
}

// función para carcular los parametros adecuados para le evolución
function calcular_next(nextEvolution){
    return nextEvolution.evolves_to[0];
}