declare module 'nunjucks-date-filter' {
    import { Filter } from 'nunjucks';
  
    interface DateFilter extends Filter {
      (date: Date | string | number, format?: string): string;
    }
  
    const dateFilter: DateFilter;
  
    export = dateFilter;
  }
  