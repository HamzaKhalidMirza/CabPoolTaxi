import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RideDetailPage } from './ride-detail.page';

describe('RideDetailPage', () => {
  let component: RideDetailPage;
  let fixture: ComponentFixture<RideDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RideDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RideDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
