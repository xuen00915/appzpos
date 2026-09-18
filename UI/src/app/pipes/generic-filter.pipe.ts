// generic-filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genericFilter'
})
export class GenericFilterPipe implements PipeTransform {
  transform<T>(items: T[], filterFn: (item: T) => boolean): T[] {
    if (!items || !filterFn) {
      return items;
    }

    return items.filter(filterFn);
  }
}
