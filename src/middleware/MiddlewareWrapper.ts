import { Route } from 'vue-router';
import { Store } from 'vuex';
import { RootState } from '@/store/types';

export interface IMiddlewareContext {
  to: Route,
  from: Route,
  next: Function,
  store: Store<RootState>
}

export interface IMiddleware {
    (context: IMiddlewareContext): void;
}

export default class MiddlewareWrapper {
    public middleware: IMiddleware;

    constructor (middleware: IMiddleware) {
        this.middleware = middleware;
    }
}
