import { Router } from 'express';
import Route from '../interfaces/routes.interface';
import ResourcesController from '../controllers/resources.controller';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import { VerifyTokenDto } from '../dtos/token.dto';
import { CategoryDto } from '../dtos/catQuery.dto';
import { ItemDto } from '../dtos/itemQuery.dto';
class ResourcesRoute implements Route {
  public router = Router();
  public ResourcesController = new ResourcesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    const prefix = '/res';
    this.router.get(`${prefix}`, this.ResourcesController.apiIndex);
    this.router.get(`${prefix}/:category`, validationMiddleware(CategoryDto, 'params'), validationMiddleware(VerifyTokenDto, 'headers'), authMiddleware, this.ResourcesController.fetchResources);
    this.router.get(`${prefix}/:category/schema`, validationMiddleware(CategoryDto, 'params'), this.ResourcesController.fetchSchema);
    this.router.get(`${prefix}/:category/:id`, validationMiddleware(ItemDto, 'params'), validationMiddleware(VerifyTokenDto, 'headers'), authMiddleware, this.ResourcesController.fetchResources);
  }
}

export default ResourcesRoute;
