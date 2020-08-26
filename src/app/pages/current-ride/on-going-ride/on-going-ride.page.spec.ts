import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnGoingRidePage } from './on-going-ride.page';

describe('OnGoingRidePage', () => {
  let component: OnGoingRidePage;
  let fixture: ComponentFixture<OnGoingRidePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnGoingRidePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnGoingRidePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
