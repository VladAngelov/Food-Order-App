import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppConstants } from 'src/app/constants/app.constants';
import { IProduct } from 'src/app/interfaces/product';
import { Product } from 'src/app/models/product';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class OrderService {
  BASE = AppConstants.BASE_API_URL;
  ADD = AppConstants.ORDER_MAKE;
  products: Product[] = [];

  constructor(private http: HttpClient) { }

  transfer(productsInOrder: IProduct[]) {
    this.products = productsInOrder;
  }

  addOrder(order) {
    this.http.post(this.BASE + this.ADD, order, httpOptions).subscribe(x => {
      console.log('X -->> ', x);
    });
  }

}