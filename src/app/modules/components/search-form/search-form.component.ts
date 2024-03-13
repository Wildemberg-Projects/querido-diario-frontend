import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Moment } from 'moment';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Territory } from 'src/app/interfaces/territory';
import { TerritoryService } from 'src/app/services/territory/territory.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.sass'],
})
export class SearchFormComponent implements OnInit {
  termControl = new FormControl();

  @Input()
  form: any;

  timeout: ReturnType<typeof setTimeout> | undefined;

  options: string[] = [
    'Compra emergencial COVID-19',
    'Dispensa de licitação',
    'Contratação',
    'Nomeação',
    'Saneamento básico',
  ];

  filteredOptions: Observable<string[]> = new Observable();

  cityControl = new FormControl();
  territories: Territory[] = [];
  selectedCities: Territory[] = [];
  territory: string[] = [];
  cityListToInput: Territory[] = [];
  loadingCities = false;

  @ViewChild('cityField') cityField!: ElementRef;
  @ViewChild('termField') termField!: ElementRef;
  @ViewChild('periodField') periodField!: ElementRef;

  since: string = '';
  until: string = '';
  query: string = '';
  sort_by: string = '';

  subscriptions: Subscription[] = [];

  constructor(
    private territoryService: TerritoryService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.filteredOptions = this.termControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterTerms(value))
    );
    console.log(">>> @ngOnInit()"); // Exibe o título atual no console

    this.subscriptions.push(
      this.route.queryParams.subscribe((params) => {
        const { term, city, since, until, sort_by } = params;
        console.log(">>> @subscriptions"); // Exibe o título atual no console
        this.territory = city;
        this.selectedCities = [];
        this.since = since;
        this.until = until;
        this.sort_by = sort_by;

        this.titleService.setTitle("Testing head updates with angular object");
        this.metaService.updateTag({ name: 'keywords', content: term });
        this.metaService.updateTag({ name: 'robots', content: 'index,follow' });
        this.metaService.updateTag({ name: 'description', content: "Este é um teste da descrição da página de resultados do Querido Diário" });
        console.log("Título da página:"); // Exibe o título atual no console
        console.log(this.titleService.getTitle()); // Exibe o título atual no console
        console.log("Termos da busca:");
        console.log(this.metaService.getTag('name=keywords')); // Exibe a meta tag 'keywords' atual no console
        console.log("Descrição detalhada do conteúdo da página:");
        console.log(this.metaService.getTag('name=description')); // Exibe a meta tag 'description' atual no console
        if(city) {
          if(Array.isArray(city)) {
            city.forEach(currCity => {
              this.findCityById(currCity);
            })
          } else {
            this.findCityById(city);
          }
        }

        this.termControl.setValue(term);

      })
    );
  }

  getCityList() {
    const selectedIds = this.selectedCities.map(city => city.territory_id);
    return [...this.territories.filter(city => !selectedIds.includes(city.territory_id)) ,...this.selectedCities]
  }

  findCities() {
    this.loadingCities = true;
    if(this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(() => {
      this.territoryService.findByName(this.query.trim()).subscribe(response => {
        response.forEach(city => {
          this.territories.push(city);
        });
        this.loadingCities = false;
      });
    }, 500);
  }

  findCityById(id: string) {
    this.territoryService.findOne({territoryId: id}).subscribe(response => {
      this.selectedCities.push(response);
    });
  }

  search(): void {
    let queryParams = {};
    const term = this.termField.nativeElement.value;

    if (this.territory && this.territory.length) {
      queryParams = { ...queryParams, city: this.territory };
    } else {
      queryParams = { ...queryParams, city: null };
    }

    if (term) {
      queryParams = { ...queryParams, term };
    } else {
      queryParams = { ...queryParams, term: null };
    }

    if (this.since && this.until) {
      queryParams = { ...queryParams, since: this.since, until: this.until };
    } else {
      queryParams = { ...queryParams, since: null, until: null };
    }

    if (this.sort_by && this.sort_by.length) {
      queryParams = { ...queryParams, sort_by: this.sort_by };
    } else {
      queryParams = { ...queryParams, sort_by: null };
    }

    this.router.navigate(['/pesquisa'], { queryParams });
  }

  onRangeSelected(range: { start: Moment; end: Moment }) {
    if (range.start) {
      this.since = range.start.format('YYYY-MM-DD');
    }
    if (range.end) {
      this.until = range.end.format('YYYY-MM-DD');
    }
  }

  private _filterTerms(value: string): string[] {
    if (!value) {
      return [];
    }
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  displayFn(territory: Territory): string {
    return territory && territory.territory_label
      ? territory.territory_label
      : '';
  }

  onChangeLocation(locations: string[]) {
    this.territory = locations;
  }

  onChangeQuery(query: string) {
    this.query = query;
    if(this.query && this.query.length >= 3) {
      this.findCities();
    }
  }

  ngOnDestroy() {
    for (let subscriptions of this.subscriptions) {
      subscriptions.unsubscribe();
    }
  }
}
