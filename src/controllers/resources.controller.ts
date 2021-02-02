import { Response, NextFunction } from 'express';

import ResourcesService from '../services/resources.service';
import { Request } from 'express';
import { RequestWithHeroUrl } from '../interfaces/auth.interface';

// resource controllers are responsible for fetching data from services and sending them to users
class ResourcesController {
  public resourcesService = new ResourcesService();

  public fetchSchema = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { category } = req.params;
      const schema = this.resourcesService.getSchema(category);
      res.status(200).send(schema);
    } catch (e) {
      next(e);
    }
  };

  public fetchResources = async (req: RequestWithHeroUrl, res: Response, next: NextFunction) => {
    const { heroUrl } = req;
    const { category, id } = req.params;
    try {
      const data = await this.resourcesService.fetchData(heroUrl, category, id);
      res.status(200).send(data);
    } catch (e) {
      next(e);
    }
  };

  public apiIndex(_req, res: Response) {
    return res.send({
      people: '/res/people',
      planets: '/res/planets',
      films: '/res/films',
      species: '/res/species',
      vehicles: '/res/vehicles',
      starships: '/res/starships',
    });
  }
}

export default ResourcesController;
