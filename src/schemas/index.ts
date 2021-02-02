export const films = {
  description: 'A Star Wars film',
  title: 'Film',
  required: ['title', 'episode_id', 'opening_crawl', 'director', 'producer', 'release_date', 'characters', 'planets', 'starships', 'vehicles', 'species', 'url', 'created', 'edited'],
  $schema: 'http://json-schema.org/draft-04/schema',
  type: 'object',
  properties: {
    starships: { type: 'array', description: 'The starship resources featured within this film.' },
    edited: { type: 'string', description: 'the ISO 8601 date format of the time that this resource was edited.', format: 'date-time' },
    planets: { type: 'array', description: 'The planet resources featured within this film.' },
    producer: { type: 'string', description: 'The producer(s) of this film.' },
    title: { type: 'string', description: 'The title of this film.' },
    url: { type: 'string', description: 'The url of this resource', format: 'uri' },
    release_date: { type: 'string', description: 'The release date at original creator country.', format: 'date' },
    vehicles: { type: 'array', description: 'The vehicle resources featured within this film.' },
    episode_id: { type: 'integer', description: 'The episode number of this film.' },
    director: { type: 'string', description: 'The director of this film.' },
    created: { type: 'string', description: 'The ISO 8601 date format of the time that this resource was created.', format: 'date-time' },
    opening_crawl: { type: 'string', description: 'The opening crawl text at the beginning of this film.' },
    characters: { type: 'array', description: 'The people resources featured within this film.' },
    species: { type: 'array', description: 'The species resources featured within this film.' },
  },
};

export const people = {
  description: 'A person within the Star Wars universe',
  title: 'People',
  required: ['name', 'height', 'mass', 'hair_color', 'skin_color', 'eye_color', 'birth_year', 'gender', 'homeworld', 'films', 'species', 'vehicles', 'starships', 'url', 'created', 'edited'],
  $schema: 'http://json-schema.org/draft-04/schema',
  type: 'object',
  properties: {
    starships: {
      type: 'array',
      description: 'An array of starship resources that this person has piloted',
    },
    edited: {
      type: 'string',
      description: 'the ISO 8601 date format of the time that this resource was edited.',
      format: 'date-time',
    },
    name: {
      type: 'string',
      description: 'The name of this person.',
    },
    created: {
      type: 'string',
      description: 'The ISO 8601 date format of the time that this resource was created.',
      format: 'date-time',
    },
    url: {
      type: 'string',
      description: 'The url of this resource',
      format: 'uri',
    },
    gender: {
      type: 'string',
      description: 'The gender of this person (if known).',
    },
    vehicles: {
      type: 'array',
      description: 'An array of vehicle resources that this person has piloted',
    },
    skin_color: {
      type: 'string',
      description: 'The skin color of this person.',
    },
    hair_color: {
      type: 'string',
      description: 'The hair color of this person.',
    },
    height: {
      type: 'string',
      description: 'The height of this person in meters.',
    },
    eye_color: {
      type: 'string',
      description: 'The eye color of this person.',
    },
    mass: {
      type: 'string',
      description: 'The mass of this person in kilograms.',
    },
    films: {
      type: 'array',
      description: 'An array of urls of film resources that this person has been in.',
    },
    species: {
      type: 'array',
      description: 'The url of the species resource that this person is.',
    },
    homeworld: {
      type: 'string',
      description: 'The url of the planet resource that this person was born on.',
    },
    birth_year: {
      type: 'string',
      description: 'The birth year of this person. BBY (Before the Battle of Yavin) or ABY (After the Battle of Yavin).',
    },
  },
};

export const planets = {
  description: 'A Star Wars film',
  title: 'Film',
  required: ['title', 'episode_id', 'opening_crawl', 'director', 'producer', 'release_date', 'characters', 'planets', 'starships', 'vehicles', 'species', 'url', 'created', 'edited'],
  $schema: 'http://json-schema.org/draft-04/schema',
  type: 'object',
  properties: {
    starships: { type: 'array', description: 'The starship resources featured within this film.' },
    edited: { type: 'string', description: 'the ISO 8601 date format of the time that this resource was edited.', format: 'date-time' },
    planets: { type: 'array', description: 'The planet resources featured within this film.' },
    producer: { type: 'string', description: 'The producer(s) of this film.' },
    title: { type: 'string', description: 'The title of this film.' },
    url: { type: 'string', description: 'The url of this resource', format: 'uri' },
    release_date: { type: 'string', description: 'The release date at original creator country.', format: 'date' },
    vehicles: { type: 'array', description: 'The vehicle resources featured within this film.' },
    episode_id: { type: 'integer', description: 'The episode number of this film.' },
    director: { type: 'string', description: 'The director of this film.' },
    created: { type: 'string', description: 'The ISO 8601 date format of the time that this resource was created.', format: 'date-time' },
    opening_crawl: { type: 'string', description: 'The opening crawl text at the beginning of this film.' },
    characters: { type: 'array', description: 'The people resources featured within this film.' },
    species: { type: 'array', description: 'The species resources featured within this film.' },
  },
};

export const species = {
  description: 'A species within the Star Wars universe',
  title: 'People',
  required: ['name', 'classification', 'designation', 'average_height', 'average_lifespan', 'hair_colors', 'skin_colors', 'eye_colors', 'homeworld', 'language', 'people', 'films', 'url', 'created', 'edited'],
  $schema: 'http://json-schema.org/draft-04/schema',
  type: 'object',
  properties: {
    edited: { type: 'string', description: 'The ISO 8601 date format of the time that this resource was edited.', format: 'date-time' },
    name: { type: 'string', description: 'The name of this species.' },
    classification: { type: 'string', description: 'The classification of this species.' },
    people: { type: 'array', description: 'An array of People URL Resources that are a part of this species.' },
    eye_colors: { type: 'string', description: 'A comma-seperated string of common eye colors for this species, none if this species does not typically have eyes.' },
    created: { type: 'string', description: 'The ISO 8601 date format of the time that this resource was created.', format: 'date-time' },
    designation: { type: 'string', description: 'The designation of this species.' },
    skin_colors: { type: 'string', description: 'A comma-seperated string of common skin colors for this species, none if this species does not typically have skin.' },
    language: { type: 'string', description: 'The language commonly spoken by this species.' },
    url: { type: 'string', description: 'The hypermedia URL of this resource.', format: 'uri' },
    hair_colors: { type: 'string', description: 'A comma-seperated string of common hair colors for this species, none if this species does not typically have hair.' },
    homeworld: { type: 'string', description: 'The URL of a planet resource, a planet that this species originates from.' },
    films: { type: 'array', description: ' An array of Film URL Resources that this species has appeared in.' },
    average_lifespan: { type: 'string', description: 'The average lifespan of this species in years.' },
    average_height: { type: 'string', description: 'The average height of this person in centimeters.' },
  },
};

export const starships = {
  description: 'A Starship',
  title: 'Starship',
  required: ['name', 'model', 'manufacturer', 'cost_in_credits', 'length', 'max_atmosphering_speed', 'crew', 'passengers', 'cargo_capacity', 'consumables', 'hyperdrive_rating', 'MGLT', 'starship_class', 'pilots', 'films', 'created', 'edited', 'url'],
  $schema: 'http://json-schema.org/draft-04/schema',
  type: 'object',
  properties: {
    passengers: { type: 'string', description: 'The number of non-essential people this starship can transport.' },
    pilots: { type: 'array', description: 'An array of People URL Resources that this starship has been piloted by.' },
    name: { type: 'string', description: 'The name of this starship. The common name, such as Death Star.' },
    hyperdrive_rating: { type: 'string', description: 'The class of this starships hyperdrive.' },
    url: { type: 'string', description: 'The hypermedia URL of this resource.', format: 'uri' },
    cargo_capacity: { type: 'string', description: 'The maximum number of kilograms that this starship can transport.' },
    edited: { type: 'string', description: 'the ISO 8601 date format of the time that this resource was edited.', format: 'date-time' },
    consumables: { type: 'string', description: 'The maximum length of time that this starship can provide consumables for its entire crew without having to resupply.' },
    max_atmosphering_speed: { type: 'string', description: 'The maximum speed of this starship in atmosphere. n/a if this starship is incapable of atmosphering flight.' },
    crew: { type: 'string', description: 'The number of personnel needed to run or pilot this starship.' },
    length: { type: 'string', description: 'The length of this starship in meters.' },
    MGLT: {
      type: 'string',
      description:
        'The Maximum number of Megalights this starship can travel in a standard hour. A Megalight is a standard unit of distance and has never been defined before within the Star Wars universe. This figure is only really useful for measuring the difference in speed of starships. We can assume it is similar to AU, the distance between our Sun (Sol) and Earth.',
    },
    starship_class: { type: 'string', description: 'The class of this starship, such as Starfighter or Deep Space Mobile Battlestation.' },
    created: { type: 'string', description: 'The ISO 8601 date format of the time that this resource was created.', format: 'date-time' },
    films: { type: 'array', description: 'An array of Film URL Resources that this starship has appeared in.' },
    model: { type: 'string', description: 'The model or official name of this starship. Such as T-65 X-wing or DS-1 Orbital Battle Station.' },
    cost_in_credits: { type: 'string', description: 'The cost of this starship new, in galactic credits.' },
    manufacturer: { type: 'string', description: 'The manufacturer of this starship. Comma seperated if more than one.' },
  },
};

export const vehicles = {
  description: 'A vehicle.',
  title: 'Starship',
  required: ['name', 'model', 'manufacturer', 'cost_in_credits', 'length', 'max_atmosphering_speed', 'crew', 'passengers', 'cargo_capacity', 'consumables', 'vehicle_class', 'pilots', 'films', 'created', 'edited', 'url'],
  $schema: 'http://json-schema.org/draft-04/schema',
  type: 'object',
  properties: {
    vehicle_class: { type: 'string', description: 'The class of this vehicle, such as Wheeled.' },
    passengers: { type: 'string', description: 'The number of non-essential people this vehicle can transport.' },
    pilots: { type: 'array', description: 'An array of People URL Resources that this vehicle has been piloted by.' },
    name: { type: 'string', description: 'The name of this vehicle. The common name, such as Sand Crawler.' },
    created: { type: 'string', description: 'The ISO 8601 date format of the time that this resource was created.', format: 'date-time' },
    url: { type: 'string', description: 'The hypermedia URL of this resource.', format: 'uri' },
    cargo_capacity: { type: 'string', description: 'The maximum number of kilograms that this vehicle can transport.' },
    edited: { type: 'string', description: 'the ISO 8601 date format of the time that this resource was edited.', format: 'date-time' },
    consumables: { type: 'string', description: 'The maximum length of time that this vehicle can provide consumables for its entire crew without having to resupply.' },
    max_atmosphering_speed: { type: 'string', description: 'The maximum speed of this vehicle in atmosphere.' },
    crew: { type: 'string', description: 'The number of personnel needed to run or pilot this vehicle.' },
    length: { type: 'string', description: 'The length of this vehicle in meters.' },
    films: { type: 'array', description: 'An array of Film URL Resources that this vehicle has appeared in.' },
    model: { type: 'string', description: 'The model or official name of this vehicle. Such as All Terrain Attack Transport.' },
    cost_in_credits: { type: 'string', description: 'The cost of this vehicle new, in galactic credits.' },
    manufacturer: { type: 'string', description: 'The manufacturer of this vehicle. Comma seperated if more than one.' },
  },
};
