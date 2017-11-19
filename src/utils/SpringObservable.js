import {Observable} from 'rxjs';
import {Spring as WobbleSpring} from 'wobble/dist/wobble.es';

export const Spring = WobbleSpring;

export const createSpringObservable = spring =>
  Observable.create(observer => {
    spring.onUpdate(({currentValue}) => {
      observer.next(currentValue);
    });
  }).startWith(spring.currentValue);
