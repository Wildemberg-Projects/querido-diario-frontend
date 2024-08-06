import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { States } from 'src/app/interfaces/state';

@Component({
  selector: 'data-state-filter',
  templateUrl: './data-state-filter.component.html',
  styleUrls: ['./data-state-filter.component.sass']
})

export class DataStateFilterComponent implements OnChanges {
  @Input() states: States[] = [];
  @Input() label: string = 'Novo local...';
  @Input() loadingStates = false;
  @Input() showAll = false;
  showDropdown = false;
  isLoading = true;
  selectedStates: States | null = null;
  showPlaceholder = true;
  query = '';
  uniqueStates: States[] = [];
  @Input() initialValue: string[] = [];
  @Output() changeLocations: EventEmitter<string[]> = new EventEmitter();
  @Output() changeQuery: EventEmitter<string> = new EventEmitter();

  getText() {
    const text = document.getElementById('state-filter-data')?.textContent;
    this.query = text as string;
    this.changeQuery.emit(this.query);
  }

  onShowPlaceholder() {
    setTimeout(() => {
      this.resetInput();
      this.showPlaceholder = true;
    }, 300);
  }

  onHidePlaceholder() {
    this.showPlaceholder = false;
  }

  removeState(state: States, event: Event) {
    event.stopPropagation();
    if (this.selectedStates === state ){
      this.selectedStates = null;
    }
    this.emitLocations();
    this.onShowPlaceholder();
  }

  addState(state: States) {
    this.resetInput();
    this.selectedStates = state;
    this.showPlaceholder = false;
    this.emitLocations();
    this.showDropdown = false;
  }

  emitLocations() {
    if (this.selectedStates) {
      this.changeLocations.emit([this.selectedStates.state_code]);
    } else {
      this.changeLocations.emit([]);
    }
  }

  focusOutInput() {
    this.showDropdown = false;
  }

  focusOnInput() {
    let container = document.getElementById('state-filter-data')
    if(container) {
      container.focus();
    }
    this.showDropdown = true;
  }

  resetInput() {
    this.query = '';
    let container = document.getElementById('state-filter-data');
    if(container) {
      container.textContent = '';
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  getStatesList() {
    if (this.query.length >= 2 || this.showAll) {
      return States.filter(state =>
        state.name.toLowerCase().includes(this.query.toLowerCase().trim()) ||
        state.state_code.toLowerCase().includes(this.query.toLowerCase().trim())
      ).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 100);
    }
    return [];
  }

  ngOnChanges(): void {
    if(this.states && this.states.length) {
      this.isLoading = false;
    }
    this.uniqueStates = [];
    this.states.forEach(state => {
      if(!this.uniqueStates.find(uniqueState => state.state_code === uniqueState.state_code)) {
        this.uniqueStates.push(state);
      }
    });

    if(this.initialValue && this.initialValue.length) {
      this.selectedStates = this.uniqueStates.find(state => this.initialValue.includes(state.state_code)) || null;
      this.showPlaceholder = !this.selectedStates;
    }
  }
}
