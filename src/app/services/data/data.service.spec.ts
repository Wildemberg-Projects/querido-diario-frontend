import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSearchService } from './data.service';

describe('DataServiceComponent', () => {
  let component: DataSearchService;
  let fixture: ComponentFixture<DataSearchService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSearchService ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSearchService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
