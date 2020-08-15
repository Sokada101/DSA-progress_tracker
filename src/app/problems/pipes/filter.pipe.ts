import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "filter",
})
export class FilterPipe implements PipeTransform {
  // debugger
  transform(items: any[], searchText: string): any[] {
    // debugger

    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter((it) => {
      console.log("it", it)
      return it.title.toLowerCase().includes(searchText);
    });
  }
}
