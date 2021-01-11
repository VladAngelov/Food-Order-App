import {
  Component,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import { AppConstants } from 'src/app/constants/app.constants';
import { IProduct } from 'src/app/interfaces/product';
import { ImageModel } from 'src/app/models/Image';
import { Product } from 'src/app/models/product';
import { ImageService } from 'src/app/_services/image/image.service';
import { OrderService } from 'src/app/_services/order/order.service';
import { ProductService } from 'src/app/_services/product/product.service';
import { TokenStorageService } from 'src/app/_services/token/token-storage.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  base64Data: any;
  retrieveResonse: any;

  products: Product[] = [];
  salads: Product[] = [];
  soups: Product[] = [];
  mainDishes: Product[] = [];
  desserts: Product[] = [];
  drinks: Product[] = [];

  order: Product[] = [];

  private roles: string[];
  isLoggedIn = false;
  isAdmin = false;

  PRODUCT_IMAGE_DATA_FORMAT = AppConstants.PRODUCT_IMAGE_DATA_FORMAT;
  HOME = AppConstants.HOME_URL;
  ADD_ORDER = AppConstants.ORDER_MAKE;

  constructor(
    private productService: ProductService,
    private tokenStorageService: TokenStorageService,
    private router: Router,
    private imageService: ImageService,
    private orderServcie: OrderService
  ) { }

  ngOnInit(): void {
    this.productService.getAll()
      .subscribe(products => {
        for (var p of products) {
          let product = new Product();
          product.id = p.id,
            product.name = p.name,
            product.content = p.content,
            product.price = p.price,
            product.volume = p.volume,
            product.type = p.type;

          this.imageService.getImage(product.name).subscribe(
            res => {
              this.retrieveResonse = res;
              this.base64Data = this.retrieveResonse.picByte;
              product.picture = 'data:image/jpeg;base64,' + this.base64Data;
            })

          this.products.push(product);
          this.sortProducts(product);
        }
      })

    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      this.isAdmin = this.roles.includes('ROLE_ADMIN');
    }
    this.redirecting();
  }

  sortProducts(prduct: Product): void {
    switch (prduct.type) {
      case 'Супа':
        this.soups.push(prduct);
        break;
      case 'Салата':
        this.salads.push(prduct);
        break;
      case 'Осново ястие':
        this.mainDishes.push(prduct);
        break;
      case 'Десерт':
        this.desserts.push(prduct);
        break;
      case 'Напитка':
        this.drinks.push(prduct);
        break;
      default:
        break;
    }
  }

  onAddToOrder(product: IProduct) {
    this.order.push(product);
  }

  checkout() {
    console.log('In Checkout');
    this.orderServcie.transfer(this.order);
    this.router.navigateByUrl('/order');
  }

  redirecting() {
    if (!this.isLoggedIn) {
      this.router.navigate[`${this.HOME}`];
    }
  }

}
