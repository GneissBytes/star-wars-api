import userModel from '../models/users.model';
import { SwapiClient } from '../api/swapi';
import HttpException from '../exceptions/HttpException';
import * as schemas from '../schemas';

class ResourcesService {
  public users = userModel;
  private SwapiClient = new SwapiClient();

  constructor() {
    this.getFilterCriteria = this.getFilterCriteria.bind(this);
  }

  private categories = ['films', 'planets', 'species', 'starships', 'vehicles', 'people'];

  public async fetchData(heroUrl: string, category = '', id: string) {
    if (category && !this.categories.includes(category)) throw new HttpException(409, 'Unknown Category');

    const filterKey = this.getFilterCriteria(category);
    if (id) {
      const data = await this.SwapiClient.getOne(category, id);
      if (data[filterKey].includes(heroUrl)) return data;
      throw new HttpException(401, 'Unauthorized hero');
    } else {
      const results = await this.SwapiClient.getCategory(category);
      const filteredResources = results.filter(item => item[filterKey].includes(heroUrl));
      return filteredResources;
    }
  }

  public getSchema(category: string) {
    const schema = schemas[category];
    if (schema) return schema;
    throw new HttpException(400, 'Invalid category');
  }

  private getFilterCriteria(category: string): string {
    switch (category) {
      case 'films':
        return 'characters';
      case 'people':
        return 'url';
      case 'planets':
        return 'residents';
      case 'species':
        return 'people';
      case 'starships':
        return 'pilots';
      case 'vehicles':
        return 'pilots';
    }
  }
}

export default ResourcesService;
