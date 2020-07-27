import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilteredRidesListPage } from './filtered-rides-list.page';

describe('FilteredRidesListPage', () => {
  let component: FilteredRidesListPage;
  let fixture: ComponentFixture<FilteredRidesListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteredRidesListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilteredRidesListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
