import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LocationSetupPage } from './location-setup.page';

describe('LocationSetupPage', () => {
  let component: LocationSetupPage;
  let fixture: ComponentFixture<LocationSetupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationSetupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationSetupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
