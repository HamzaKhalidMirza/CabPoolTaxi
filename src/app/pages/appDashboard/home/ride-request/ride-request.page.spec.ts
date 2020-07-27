import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RideRequestPage } from './ride-request.page';

describe('RideRequestPage', () => {
  let component: RideRequestPage;
  let fixture: ComponentFixture<RideRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RideRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RideRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
